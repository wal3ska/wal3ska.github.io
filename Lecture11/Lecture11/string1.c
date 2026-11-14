#include <stdio.h>

void main() {
	char s[] = "0123456789";
	char *p = s;
	*p = 'A';

	printf("%c\n", p[3]);
	printf("%c\n", *(s+5));

	printf("%s\n", p);
	printf("%s\n", s+2);
	printf("%s\n", &p[4]);
}