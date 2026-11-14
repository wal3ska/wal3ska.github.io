#include <stdio.h>

int main(){
	char c, s[100];
	printf("Enter a char and string:\n");
	scanf("%c %s", &c, s);
	printf("%c\t%s\n", c, s);

	printf("Enter a char and string:\n");
	scanf(" %c %s", &c, s);
	printf("%c\t%s\n", c, s);

	printf("Enter a string:\n");
	scanf("%s", s);
	printf("Enter a char:\n");
	getchar();
	c = getchar();
	printf("%c\t%s\n", c, s);
	return 0;
}