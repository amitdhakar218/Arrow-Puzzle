#include "GameEngine.hpp"
#include <algorithm>
#include <sstream>

namespace ArrowPuzzle {

static const std::string PALETTE[] = {
    "#38bdf8", "#f43f5e", "#10b981", "#f59e0b",
    "#8b5cf6", "#ec4899", "#06b6d4", "#eab308"
};

GameEngine::GameEngine() {
    loadLevel(1);
}

void GameEngine::loadLevel(int levelNum) {
    if (levelNum < 1) levelNum = 1;
    if (levelNum > 100) levelNum = 100;
    currentLevelNumber = levelNum;
    currentLevel = generateLevel(levelNum);
    moveCount = 0;
    combo = 0;
    undoHistory.clear();
}

Direction GameEngine::getNextClockwise(Direction d) const {
    switch (d) {
        case Direction::UP: return Direction::RIGHT;
        case Direction::RIGHT: return Direction::DOWN;
        case Direction::DOWN: return Direction::LEFT;
        case Direction::LEFT: return Direction::UP;
    }
    return Direction::UP;
}

bool GameEngine::checkDirectionExit(const ArrowTile& tile, Direction dir, int& outBlockerId) const {
    int dr = 0, dc = 0;
    switch (dir) {
        case Direction::UP: dr = -1; dc = 0; break;
        case Direction::RIGHT: dr = 0; dc = 1; break;
        case Direction::DOWN: dr = 1; dc = 0; break;
        case Direction::LEFT: dr = 0; dc = -1; break;
    }

    int curR = tile.row + dr;
    int curC = tile.col + dc;

    while (curR >= 0 && curR < currentLevel.gridRows && curC >= 0 && curC < currentLevel.gridCols) {
        for (const auto& a : currentLevel.arrows) {
            if (!a.isCleared && a.id != tile.id && a.row == curR && a.col == curC) {
                outBlockerId = a.id;
                return false;
            }
        }
        curR += dr;
        curC += dc;
    }

    outBlockerId = -1;
    return true;
}

TapResult GameEngine::tapTile(int tileId) {
    TapResult res;
    res.success = false;
    res.canExit = false;

    auto it = std::find_if(currentLevel.arrows.begin(), currentLevel.arrows.end(),
                           [tileId](const ArrowTile& a) { return a.id == tileId && !a.isCleared; });

    if (it == currentLevel.arrows.end()) {
        res.message = "Tile already cleared or not found";
        return res;
    }

    if (it->type == ArrowType::OBSTACLE) {
        res.message = "Blockers cannot be tapped";
        return res;
    }

    if (it->isLocked) {
        res.message = "Tile is locked";
        res.blockedByArrowId = it->id;
        combo = 0;
        return res;
    }

    // Save snapshot for undo
    undoHistory.push_back(currentLevel.arrows);
    moveCount++;

    int blockerId = -1;
    if (checkDirectionExit(*it, it->direction, blockerId)) {
        it->isCleared = true;
        combo++;
        res.success = true;
        res.canExit = true;
        res.exitingArrowId = it->id;
        res.message = "Cleared";

        // Unlock logic
        int remaining = 0;
        for (const auto& a : currentLevel.arrows) {
            if (!a.isCleared && a.type != ArrowType::OBSTACLE) remaining++;
        }
        for (auto& a : currentLevel.arrows) {
            if (a.isLocked && remaining <= a.requiredKeys) {
                a.isLocked = false;
            }
        }
        return res;
    }

    // If double arrow, check secondary direction
    if (it->type == ArrowType::DOUBLE && it->secondaryDirection.has_value()) {
        if (checkDirectionExit(*it, it->secondaryDirection.value(), blockerId)) {
            it->direction = it->secondaryDirection.value();
            it->isCleared = true;
            combo++;
            res.success = true;
            res.canExit = true;
            res.exitingArrowId = it->id;
            res.message = "Cleared via secondary";
            return res;
        }
    }

    // If rotator, rotate clockwise
    if (it->type == ArrowType::ROTATOR) {
        it->direction = getNextClockwise(it->direction);
        res.success = true;
        res.canExit = false;
        res.didRotate = true;
        res.rotatedTo = it->direction;
        res.blockedByArrowId = blockerId;
        res.message = "Rotated";
        return res;
    }

    // Blocked
    combo = 0;
    res.success = true;
    res.canExit = false;
    res.blockedByArrowId = blockerId;
    res.message = "Blocked";
    return res;
}

bool GameEngine::undoLastMove() {
    if (undoHistory.empty()) return false;
    currentLevel.arrows = undoHistory.back();
    undoHistory.pop_back();
    if (moveCount > 0) moveCount--;
    combo = 0;
    return true;
}

std::optional<int> GameEngine::getHintArrowId() {
    for (const auto& a : currentLevel.arrows) {
        if (a.isCleared || a.isLocked || a.type == ArrowType::OBSTACLE) continue;
        int dummy = -1;
        if (checkDirectionExit(a, a.direction, dummy)) return a.id;
        if (a.type == ArrowType::DOUBLE && a.secondaryDirection.has_value()) {
            if (checkDirectionExit(a, a.secondaryDirection.value(), dummy)) return a.id;
        }
    }
    return std::nullopt;
}

bool GameEngine::isLevelCompleted() const {
    for (const auto& a : currentLevel.arrows) {
        if (!a.isCleared && a.type != ArrowType::OBSTACLE) return false;
    }
    return true;
}

LevelData GameEngine::generateLevel(int levelNum) {
    LevelData data;
    data.levelNumber = levelNum;
    data.chapter = std::min(5, (levelNum + 19) / 20);

    const std::string chapterNames[] = {
        "Rookie Outpost", "Tangled Crossroads", "Rotator & Switch Core",
        "Chamber of Knots", "Grandmaster Labyrinth"
    };
    data.chapterName = chapterNames[data.chapter - 1];
    data.title = "Level " + std::to_string(levelNum);

    int rows = 3, cols = 3, arrowCount = 4;
    if (levelNum <= 5) {
        rows = 3; cols = 3; arrowCount = 3 + levelNum;
    } else if (levelNum <= 15) {
        rows = 4; cols = 4; arrowCount = 6 + (int)((levelNum - 5) * 0.7);
    } else if (levelNum <= 35) {
        rows = 5; cols = 5; arrowCount = 10 + (int)((levelNum - 15) * 0.5);
    } else if (levelNum <= 65) {
        rows = 6; cols = 6; arrowCount = 16 + (int)((levelNum - 35) * 0.4);
    } else if (levelNum <= 85) {
        rows = 7; cols = 7; arrowCount = 22 + (int)((levelNum - 65) * 0.4);
    } else {
        rows = 8; cols = 8; arrowCount = 28 + (int)((levelNum - 85) * 0.5);
    }

    data.gridRows = rows;
    data.gridCols = cols;

    uint32_t seed = levelNum * 997 + 1337;
    auto nextRand = [&seed]() -> float {
        seed = (seed * 16807) % 2147483647;
        return (float)(seed - 1) / 2147483646.0f;
    };

    int idGen = 1;
    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < cols; ++c) {
            if ((int)data.arrows.size() >= arrowCount) break;
            if (nextRand() > 0.45f) {
                ArrowTile tile;
                tile.id = idGen++;
                tile.row = r;
                tile.col = c;
                int dirIdx = (int)(nextRand() * 4.0f) % 4;
                tile.direction = static_cast<Direction>(dirIdx);
                tile.type = ArrowType::STANDARD;

                if (data.chapter >= 3 && nextRand() < 0.22f) {
                    tile.type = ArrowType::ROTATOR;
                } else if (data.chapter >= 4 && nextRand() < 0.18f) {
                    tile.type = ArrowType::DOUBLE;
                    tile.secondaryDirection = static_cast<Direction>((dirIdx + 1) % 4);
                }

                int palIdx = (int)(nextRand() * 8.0f) % 8;
                tile.colorHex = PALETTE[palIdx];
                tile.isCleared = false;
                data.arrows.push_back(tile);
            }
        }
    }

    // Guarantee initial free move on an edge tile
    if (!data.arrows.empty()) {
        auto& first = data.arrows[0];
        if (first.row == 0) first.direction = Direction::UP;
        else if (first.row == rows - 1) first.direction = Direction::DOWN;
        else if (first.col == 0) first.direction = Direction::LEFT;
        else first.direction = Direction::RIGHT;
    }

    data.maxMoves = (int)(data.arrows.size() * 1.5f);
    data.target3Stars = (int)data.arrows.size() + 1;
    data.target2Stars = (int)(data.arrows.size() * 1.25f);

    return data;
}

std::string GameEngine::getLevelAsJson() const {
    std::ostringstream ss;
    ss << "{\"levelNumber\":" << currentLevel.levelNumber
       << ",\"rows\":" << currentLevel.gridRows
       << ",\"cols\":" << currentLevel.gridCols
       << ",\"arrowsCount\":" << currentLevel.arrows.size()
       << ",\"moves\":" << moveCount
       << ",\"combo\":" << combo
       << ",\"cleared\":" << (isLevelCompleted() ? "true" : "false") << "}";
    return ss.str();
}

} // namespace ArrowPuzzle
