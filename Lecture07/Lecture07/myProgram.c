#include <stdio.h>
#include "source1.h"

int main(){
	int a = CUBED(5);
	int b = mul1(a);
	int c = mul2(b, 2);
	printf("%d %d %d %.2f\n", a, b, c, PI);

	return 15;
}