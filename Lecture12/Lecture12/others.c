#include <stdio.h>
#include <string.h>

void main() {
	printf("%s\n", strerror(2));
	char *str = strerror(13);
	printf("%s\n", str);	
}