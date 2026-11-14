#include <stdio.h>

#define SIZE_ROW 2
#define SIZE_COL 3

void printArray(int a[][3]){
	for (int i=0; i<SIZE_ROW; i++){
		for (int j=0; j<SIZE_COL; j++)
			printf("%d ", a[i][j]);
		printf("\n");
	}
}

void main() {
	int arr1[SIZE_ROW][SIZE_COL] = { {1, 2, 3}, {4, 5, 6} };
	printArray(arr1);

	int arr2[SIZE_ROW][SIZE_COL] = { 1, 2, 3, 4, 5 };
	printArray(arr2);

	int arr3[SIZE_ROW][SIZE_COL] = { {1, 2}, {4} };
	printArray(arr3);
}