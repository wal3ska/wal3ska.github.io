#include <stdio.h>

int x = 1;

void func1(){
	x = 3;
	printf ("%d\n", x);
}

void func2(int x){
	x = 4;
	printf ("%d\n", x);
}

int main(){
	printf ("%d\n", x);
	x = 2;
	printf ("%d\n", x);
	func1();
	printf ("%d\n", x);
	func2(x);
	printf ("%d\n", x);
	{
		int x = 5;
		printf ("%d\n", x);
		{
			x = 6;
			printf ("%d\n", x);
		}
	}
	printf ("%d\n", x);
	return 0;
}
