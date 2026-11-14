#include <stdio.h>

#define SIZE 20

void copy1(char* const s1, const char* const s2) {
	int i = 0;
	for ( ; s2[i] != '\0'; i++)
		s1[i] = s2[i];
	s1[i] = '\0';
}

void copy2(char* s1, const char *s2) {
	for ( ; *s2 != '\0'; s1++, s2++) 
		*s1 = *s2;
	*s1 = *s2;
}

void main() {
	char str[SIZE];
	char *p = "System Programming";
	p = &p[0];

	copy1(str, p);
	printf("%s\n", str);

	copy2(str, p+7);
	printf("%s\n", str);
	printf("%s\n", str+14);
}