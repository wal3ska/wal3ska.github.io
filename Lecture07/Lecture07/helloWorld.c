// Before we can use "printf", we need its function declaration (function prototype).
#include <stdio.h>	// This header takes care of that.

// main – the entry point of the program
// int means this program returns an integer.
int main(void) {
	printf("Hello, world!\n");	// sends formatted output to stdout
	return 0;	// exits successfully (returns error code 0)
}