cmake_minimum_required(VERSION 3.22.1)

project("arrowpuzzle")

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Check if building within Android NDK
if(ANDROID)
    add_library(arrowpuzzle SHARED
        native-lib.cpp
        GameEngine.cpp
    )

    find_library(log-lib log)
    target_link_libraries(arrowpuzzle ${log-lib})
else()
    # Standalone host build for CI/CD testing
    add_library(arrowpuzzle_core STATIC
        GameEngine.cpp
    )

    add_executable(arrow_engine_tests
        tests.cpp
    )
    target_link_libraries(arrow_engine_tests arrowpuzzle_core)
endif()
