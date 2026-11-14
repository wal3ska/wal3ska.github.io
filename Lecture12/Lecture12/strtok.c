#include <stdio.h>
#include <string.h>

void main() {
	char str[] = "This is a sentence with 7 tokens.";
	char *tokenPtr = strtok(str, " ");
	while (tokenPtr != NULL) {
		printf("%s\n", tokenPtr);
		tokenPtr = strtok(NULL, " ");
	}
	printf("\n");

	char str2[] = "This is a sentence with 7 tokens.";
	tokenPtr = strtok(str2, "c");
	printf("%s\n", tokenPtr);
	printf("%s\n", str2);

	tokenPtr = strtok(NULL, "o");
	printf("%s\n", tokenPtr);
	tokenPtr = strtok(NULL, "z");
	printf("%s\n", tokenPtr);
	tokenPtr = strtok(NULL, "k");
	printf("%p\n", tokenPtr);
}