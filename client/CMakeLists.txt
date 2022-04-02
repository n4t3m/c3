cmake_minimum_required(VERSION 3.16)
project(C2ITRUS)

set(CMAKE_CXX_STANDARD 20)

add_compile_definitions(C2ITRUS_LINUX)
#add_compile_definitions(C2ITRUS_WINDOWS)
add_executable(C2ITRUS internal/main.cpp)

#add_subdirectory(external/curlpp)

add_subdirectory(external/rapidjson)
target_include_directories(C2ITRUS PRIVATE external/rapidjson/include)
target_link_libraries(C2ITRUS PRIVATE curl)