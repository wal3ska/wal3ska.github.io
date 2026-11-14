#include <stdio.h>

int main(){
	printf("Enter a character.\n");
	char c = getchar();
	printf("Character %c has the value %d.\n", c, c);
	for (int i=0; i<10; i++){
		putchar(c++);
	}
	printf("\n");
	return 0;
}