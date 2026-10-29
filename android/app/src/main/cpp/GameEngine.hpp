#ifndef ARROW_GAME_ENGINE_HPP
#define ARROW_GAME_ENGINE_HPP

#include <vector>
#include <string>
#include <memory>
#include <optional>
#include <cstdint>

namespace ArrowPuzzle {

enum class Direction {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
};

enum class ArrowType {
    STANDARD = 0,
    ROTATOR = 1,
    DOUBLE = 2,
    LOCKED = 3,
    OBSTACLE = 4
};

struct ArrowTile {
    int id;
    int row;
    int col;
    Direction direction;
    std::optional<Direction> secondaryDirection;
    ArrowType type;
    std::string colorHex;
    bool isLocked = false;
    int requiredKeys = 0;
    bool isCleared = false;
};

struct TapResult {
    bool success;
    bool canExit;
    int exitingArrowId = -1;
    int blockedByArrowId = -1;
    Direction rotatedTo = Direction::UP;
    bool didRotate = false;
    std::string message;
};

struct LevelData {
    int levelNumber;
    int gridRows;
    int gridCols;
    std::string title;
    int chapter;
    std::string chapterName;
    int maxMoves;
    int target3Stars;
    int target2Stars;
    std::vector<ArrowTile> arrows;
};

class GameEngine {
public:
    GameEngine();
    ~GameEngine() = default;

    void loadLevel(int levelNum);
    TapResult tapTile(int tileId);
    bool undoLastMove();
    std::optional<int> getHintArrowId();
    bool isLevelCompleted() const;
    
    int getCurrentLevelNum() const { return currentLevelNumber; }
    int getMoveCount() const { return moveCount; }
    int getCombo() const { return combo; }
    const LevelData& getCurrentLevelData() const { return currentLevel; }
    std::string getLevelAsJson() const;

    static LevelData generateLevel(int levelNum);

private:
    int currentLevelNumber = 1;
    int moveCount = 0;
    int combo = 0;
    LevelData currentLevel;
    std::vector<std::vector<ArrowTile>> undoHistory;

    bool checkDirectionExit(const ArrowTile& tile, Direction dir, int& outBlockerId) const;
    Direction getNextClockwise(Direction d) const;
};

} // namespace ArrowPuzzle

#endif // ARROW_GAME_ENGINE_HPP
