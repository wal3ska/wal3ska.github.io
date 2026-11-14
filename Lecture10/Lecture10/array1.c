#include <stdio.h>

#define SIZE 5

void main() {
	int arr[SIZE];
	printf("%p\n", arr);
	printf("%lu\n", sizeof(arr)/sizeof(int));

	for (int i=0; i<SIZE; i++)
		arr[i] = i*10;
	
	printf("%s%10s\n", "Element", "Value");
	for (int i=0; i<SIZE; i++){
		printf("%7d%10d\n", i, arr[i]);
	}
}