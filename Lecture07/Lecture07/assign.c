#include <stdio.h>

int main(){
	int x=1, y=2, z=3;
	z *= 2;
	x = (y = z--);
	printf("x:%d\ty:%d\tz:%d\n", x, y, z);

	x=1; y=2; z=3;
	x = y = ++z;
	printf("x:%d\ty:%d\tz:%d\n", x, y, z);

	if (x = 100) {
		printf("x:%d\n", x);
	}

	return 0;
}