#include "GameEngine.hpp"
#include <cassert>
#include <iostream>

int main() {
    std::cout << "[Arrow C++ Engine] Running tests for 100 levels..." << std::endl;
    ArrowPuzzle::GameEngine engine;

    // Test level 1
    engine.loadLevel(1);
    assert(engine.getCurrentLevelNum() == 1);
    assert(!engine.getCurrentLevelData().arrows.empty());

    // Test hint
    auto hint = engine.getHintArrowId();
    assert(hint.has_value());
    std::cout << "Level 1 hint found: arrow id " << hint.value() << std::endl;

    // Test tap on hint arrow
    auto res = engine.tapTile(hint.value());
    assert(res.success);
    assert(res.canExit);
    assert(res.exitingArrowId == hint.value());
    std::cout << "Tapped hint arrow: exited cleanly!" << std::endl;

    // Test level 100 generation
    auto lvl100 = ArrowPuzzle::GameEngine::generateLevel(100);
    assert(lvl100.levelNumber == 100);
    assert(lvl100.chapter == 5);
    assert(lvl100.gridRows == 8 && lvl100.gridCols == 8);
    std::cout << "Level 100 generated with " << lvl100.arrows.size() << " arrows." << std::endl;

    std::cout << "[Arrow C++ Engine] All native tests passed successfully!" << std::endl;
    return 0;
}
