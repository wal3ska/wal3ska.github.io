#include <stdio.h>

#define PI 3.14

int main(){
	int y, z=1, t;
	printf("%d %d %d\n", y, z, t);
	float x;
	printf("%f\n", x);
	int a=50, b=a*100;
	float c = 2.5l;
	int d = 3.9;
	printf("%li\n", sizeof(c));
	printf("%d\n", d);
	printf("%06d %06d %.1f\n", a, b, PI);

	return 0;
}