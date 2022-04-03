#!/usr/bin/bash

generator="CodeBlocks - Unix Makefiles"

build_directory="./cmake-build-gcc-debug"
c_compiler="/usr/bin/gcc"
cxx_compiler="/usr/bin/g++"

build_type="Debug"

cmake -S"./" -B${build_directory} -G"${generator}" -DCMAKE_BUILD_TYPE=${build_type} -DCMAKE_C_COMPILER=${c_compiler} -DCMAKE_CXX_COMPILER=${cxx_compiler}
