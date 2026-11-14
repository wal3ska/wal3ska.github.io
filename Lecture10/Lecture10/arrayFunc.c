#include <stdio.h>

#define SIZE 5

void modifyArray(int a[], int size) {
	for (int i=0; i<size; i++)
		a[i] *= 10;
}

void printArray(int a[], int size) {
	printf("%s%10s\n", "Element", "Value");
	for (int i=0; i<size; i++) 
		printf("%7d%10d\n", i, a[i]);
}
void main() {
	int arr[SIZE];

	for (int i=0; i<SIZE; i++)
		arr[i] = i+1;

	modifyArray(arr, SIZE);
	printArray(arr, SIZE);
}