#include <stdio.h>

int main(){
	double x=20.9;
	int y = (int) x;
	printf("%ld %ld\n", sizeof(y), sizeof(int));
	printf("%ld %ld\n", sizeof(x), sizeof(double));
	return 0;
}