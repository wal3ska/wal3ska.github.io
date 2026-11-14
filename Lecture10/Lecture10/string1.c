#include <stdio.h>
#include <string.h>

void main() {
	char a[] = "abc";
	puts(a);
	printf("%lu %d\n", strlen(a), a[3]=='\0');

	char s[18] = "System Programming";
	printf("%s %lu\n", s, strlen(s));
	s[11] = '\0';
	printf("%s %lu\n", s, strlen(s));
	printf("%s %lu\n", &s[0], strlen(&s[0]));
	printf("%s %lu\n", &s[2], strlen(&s[2]));
	printf("%s %lu\n", &s[14], strlen(&s[14]));
	
	printf("%p %p\n", s, &s);
	printf("%p %p\n", &s[0], &s[2]);

	scanf("Input: %s", s);
	printf("%s %lu\n", s, strlen(s));
	scanf("%s", &s[3]);
	printf("%s %lu\n", s, strlen(s));
	printf("%s %lu\n", &s[10], strlen(&s[10]));
}