#include <stdio.h>
#include <string.h>

void main() {
	char s[20];
	fgets(s, 20, stdin);
	printf ("s: %s %lu\n", s, strlen(s));
	fgets(s, 20, stdin);
	printf ("s: %s %lu\n", s, strlen(s));
	if (s[8] == '\n')
		printf ("It is new line character.\n");
}