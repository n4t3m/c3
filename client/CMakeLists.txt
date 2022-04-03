cmake_minimum_required(VERSION 3.16)
project(C2ITRUS)

set(CMAKE_CXX_STANDARD 20)

add_compile_definitions(C2ITRUS_LINUX)

#add_compile_definitions(C2ITRUS_WINDOWS)
#set(CMAKE_TOOLCHAIN_FILE ${CMAKE_TOOLCHAIN_FILE} "C:/Users/Avereniect/Downloads/vcpkg/scripts/buildsystems/vcpkg.cmake")

add_executable(C2ITRUS internal/main.cpp)

#add_subdirectory(external/curlpp)

set(RAPIDJSON_BUILD_TESTS OFF)
set(RAPIDJSON_BUILD_THIRTPARTY_GTEST OFF)
add_subdirectory(external/rapidjson)
target_include_directories(C2ITRUS PRIVATE external/rapidjson/include)
target_link_libraries(C2ITRUS PRIVATE curl)
