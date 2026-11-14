#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int roll() {
	return rand()%6 + 1;
}

void main() {
	srand( time(NULL) );
	printf("%d %d %d\n", roll(), roll(), roll());

	int sum=0, numberTrial=1000;
	for (int i=0; i<numberTrial; i++){
		sum += roll();
	}
	printf("%.3f\n", (float) sum / numberTrial);
}