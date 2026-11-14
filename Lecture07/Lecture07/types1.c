#include <stdio.h>

int main(){
	int x=27, y=7;
	float d = (float) x / y;
	printf("%f\n", d);
	printf("%d\n", x/y);
	float z=100;
	y = 1.9;
	printf("%d %.2f\n", y, x/z);
	return 0;
}