#include <iostream>

#include <magic_enum.hpp>
#include <fmt/core.h>
#include <antlr4-runtime/antlr4-runtime.h>


#if USING_EMSCRIPTEN

float lerp(float a, float b, float t) {
	return (1 - t) * a + t * b;
}

#include <emscripten/bind.h>

EMSCRIPTEN_BINDINGS(my_module) {
	emscripten::function("lerp", &lerp);
}

#else
int main()
{
	fmt::print("Hello from x64 and fmt!");
	return 0;
}
#endif

