#include <stdio.h>

#define SIZE_ROW 3
#define SIZE_COL 6

void printArray(int A[][SIZE_COL]) {
	for (int i=0; i<SIZE_ROW; i++){
		for (int j=0; j<SIZE_COL; j++)
			printf("%d ", A[i][j]);
		printf("\n");
	}
}

void modifyArray(int *p, int size) {
	for (int i=0; i<size; i++)
		p[i] += 1;
}

void main() {
	int arr1[SIZE_ROW][SIZE_COL] = {{1, 2, 3, 4, 5, 6}};
	printArray(arr1);

	int arr2[SIZE_COL] = {0};
	modifyArray(arr2, SIZE_COL);
	modifyArray(arr2+3, SIZE_COL-3);
	*(arr2+5) += 1;
	for (int i=0; i<SIZE_COL; i++)
		printf("%d ", arr2[i]);
	printf("\n");

	// modifyArray(arr1);		// error
	modifyArray(arr1[2], SIZE_COL);
	modifyArray(arr1[1], SIZE_COL*2);
	*(*(arr1+2) + 3) += 1;
	printArray(arr1);
}