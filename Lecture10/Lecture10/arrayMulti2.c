#include <stdio.h>

#define SIZE_ROW 5
#define SIZE_COL 3

void printArray(int a[], int size){
	for (int i=0; i<size; i++)
		printf("%2d ", a[i]);
	printf("\n");
}

void main() {
	int arr1[SIZE_ROW][SIZE_COL] = { {1, 2, 3},
		{4, 5, 6}, {7, 8, 9}, {10, 11, 12} };
	for (int i=0; i<SIZE_ROW-1; i++)
		printArray(arr1[i], SIZE_COL*2);

	for (int i=0; i<SIZE_ROW; i++)
		printf("%p\n", arr1[i]);
}