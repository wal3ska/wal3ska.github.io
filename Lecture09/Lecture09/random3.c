#include <stdio.h>
#include <stdlib.h>
#include <time.h>

double fromInterval(int lowerB, int upperB) {
	double x = (double) rand() / RAND_MAX;
	return x * (upperB - lowerB) + lowerB;
}

void main() {
	int l=-2, u=3;
	srand( time(NULL) );
	printf("%.2f\n", fromInterval(l, u));
	printf("%.2f\n", fromInterval(l, u));

	double sum=0, numberTrial=1000;
	for (int i=0; i<numberTrial; i++)
		sum += fromInterval(l, u);
	printf("%.3f\n", sum / numberTrial);
}
