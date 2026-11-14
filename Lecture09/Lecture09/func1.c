#include <stdio.h>

int isUpperCase(char);

int main() {
	char x;
	printf("Enter a character\n");
	scanf("%c", &x);
	printf("%d\n", isUpperCase(x));
	return 0;
}

int isUpperCase(char c) {
	if ('A'<=c && c<='Z')
		return 1;
	return 0;
}
