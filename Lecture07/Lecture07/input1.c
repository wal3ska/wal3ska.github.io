#include <stdio.h>

int main(){
	int x;
	float y;
	printf("Enter an integer and a float:\n");
	scanf("%d %f", &x, &y);
	printf("x: %d\ty: %.3f\n", x, y);
	printf("Address of x: %p\n", &x);
	printf("Address of y: %p\n", &y);
	return 0;
}