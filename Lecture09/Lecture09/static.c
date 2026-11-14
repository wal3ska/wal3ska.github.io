#include <stdio.h>

int x = 10;

void count() {
	static int x = 0;
	printf("%d\n", ++x);
}

void main() {
	printf("%d\n", x);
	count(); count();
	count(); count();
	printf("%d\n", x);
}