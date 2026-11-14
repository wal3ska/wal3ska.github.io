#include <stdio.h>

void makeUpper(char);

int main() {
	char x;
	printf("Enter a character\n");
	scanf("%c", &x);
	makeUpper(x);
	return 0;
}

void makeUpper(char c) {
	if (c<'a' || 'z'<c)
		return;
	printf("%c\n", 'A' + (c - 'a'));
}
