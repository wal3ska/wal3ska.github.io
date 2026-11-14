#include <stdio.h>
#include <string.h>

int main() {
	char s[20];
	fgets(s, 20, stdin);
	printf ("s: %s\n", s);
	printf ("len: %lu\n", strlen(s));

	s[strlen(s)-1] = '\0';
	printf ("s: %s\n", s);
	printf ("len: %lu\n", strlen(s));
	return 0;
}