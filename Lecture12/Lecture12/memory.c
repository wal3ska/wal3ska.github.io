#include <stdio.h>
#include <string.h>

void main() {
	char str[] = "ABCDEF 12345 6789";
	printf("%s\n", str);
	memmove(str, str+7, 10);
	printf("%s\n", str);
	memset(str+4, 'A', 8);
	printf("%s\n", str);
}