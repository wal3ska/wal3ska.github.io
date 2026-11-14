#include <stdio.h>

int main() {
	int countChars=0, countLines=0;
	char c;
	while ( (c = getchar()) != EOF ) {
		countChars++;
		if (c == '\n')
			countLines++;
	}
	printf("Number of lines: %d\n", countLines);
	printf("Number of chars: %d\n", countChars);
	return 0;
}
