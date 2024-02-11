cmake_minimum_required (VERSION 3.8)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()

project("main")
add_executable(main)
find_package(fmt CONFIG REQUIRED)
find_package(magic_enum CONFIG REQUIRED)
find_package(antlr4-runtime CONFIG REQUIRED)

# Add source to this project's executable.
set_property(TARGET main PROPERTY CXX_STANDARD 20)

target_sources(main PRIVATE "src/main.cpp")

if (EMSCRIPTEN_PRESET) 
	# Needed to make VS detect the EMSCRIPTEN preprocessor definition
	target_compile_definitions(main PRIVATE USING_EMSCRIPTEN=true)

	# Modify the vcpkg antlr4 files
	# TODO. Currently we can manually call "C:\SSD-dev\github-repos\cmake-emscripten-vcpkg-template\scripts\relative-antlr4-headers\main.js" with argument 
	# "C:\SSD-dev\github-repos\cmake-emscripten-vcpkg-template\out\build\emscripten-base\vcpkg_installed\wasm32-emscripten\include\antlr4-runtime"

	# Emscripten only compilation flags and directories
	target_include_directories(main PUBLIC "$ENV{EMSDK}/upstream/emscripten/system/include")
	set_target_properties(main PROPERTIES LINK_FLAGS "--embind-emit-tsd interface.d.ts -lembind")
	set_target_properties(main PROPERTIES SUFFIX ".html")

	# Based on vcpkg's suggestion, I used antlr4_static here instead of shared
	target_link_libraries(main PRIVATE antlr4_static)
else()
	target_compile_definitions(main PRIVATE USING_EMSCRIPTEN=false)
	target_link_libraries(main PRIVATE antlr4_shared)
endif()

target_link_libraries(main PRIVATE magic_enum::magic_enum)
target_link_libraries(main PRIVATE fmt::fmt-header-only)
