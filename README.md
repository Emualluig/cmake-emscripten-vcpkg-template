# cmake-emscripten-vcpkg-template
 A template of a project using CMake, Emscripten, and vcpkg together.

As an example the vcpkg packages of fmt, magic_enum, and antlr4 are present.

Now you can develop a program for both desktop and the web using C++.

Works for x64-windows and wasm32-emscripten. Can convert between both presents and intellisense will detect it too!

## Installation and Requirements
1. Have node.js and npm installed. Additionally a server is necessary to serve WASM. You could use [serve](https://www.npmjs.com/package/serve) or other servers to do so.
2. Have the CMake build system installed. This can be done via Visual Studio. (This is how I have it set up for me)
3. Have [emsdk](https://github.com/emscripten-core/emsdk) installed
    - Have the EMSDK enviroment variable set to your emsdk install location.
4. Have [vcpkg](https://github.com/microsoft/vcpkg) installed.
    - Have the VCPKG_ROOT enviroment variable set to your vcpkg install location.
    - In this template the packages fmt, magic_enum and antlr4 are used. Every package must be install for triples x64-windows and wasm32-emscripten to function properly.
    - Note: You will have to run the [relative-antlr4-headers/main.js](./scripts/relative-antlr4-headers/main.js) script in order for the antlr4 package to work correctly when compiling to wasm. More information is in CMakeLists.txt

