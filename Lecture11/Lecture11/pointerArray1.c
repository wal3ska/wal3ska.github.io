#include <stdio.h>

void modifyRow(int* p, int size) {
	for(int i=0; i<size; i++)
		p[i] += i+1;
}

void printRow(int* p, int size) {
	for(int i=0; i<size-1; i++)
		printf("%d ", p[i]);
	printf("%d\n", p[size-1]);
}

void printArray(int* A[], int row, int* cols) {
	for(int i=0; i<row; i++) {
		for (int j=0; j<cols[i]-1; j++)
			printf("%d ", A[i][j]);
		printf("%d\n", A[i][cols[i]-1]);
	}
}

void main() {
	int* arr[4];
	int x[8]={0}, y[3]={0}, z[5]={0};
	arr[0] = x;
	arr[1] = y;
	arr[2] = z;
	arr[3] = x;
	int cols[4] = {8, 3, 5, 8};
	modifyRow(arr[3], cols[3]);
	modifyRow(arr[2], cols[2]);
	modifyRow(arr[1], cols[1]);
	modifyRow(arr[1], cols[1]);
	printArray(arr, 4, cols);
	modifyRow(arr[2], cols[2]);
	printRow(arr[2], cols[2]);
}