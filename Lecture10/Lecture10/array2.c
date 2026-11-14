#include <stdio.h>

#define RESPONSES_SIZE 40
#define FREQUENCY_SIZE 11

void main() {
	int responses[RESPONSES_SIZE] = {1, 2, 6, 4, 8, 5, 9, 7, 8, 10,
					1, 6, 3, 8, 6, 10, 3, 8, 2, 7,
					6, 5, 7, 6, 8, 6, 7, 5, 6, 6,
					5, 6, 7, 5, 6, 4, 8, 6, 8, 10};
	int frequencies[FREQUENCY_SIZE] = {0};
	for (int i=0; i<RESPONSES_SIZE; i++)
		frequencies[responses[i]]++;

	printf ("%s%15s\n", "Rating", "Frequencies");
	for (int i=1; i<FREQUENCY_SIZE; i++)
		printf ("%6d%15d\n", i, frequencies[i]);
}