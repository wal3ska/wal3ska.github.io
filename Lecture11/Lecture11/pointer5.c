#include <stdio.h>

#define SIZE 7

void main() {
	int arr[SIZE], *ptr=arr, i;
	printf("%lu\n", sizeof(int));
	printf("%lu\n", sizeof(arr));
	printf("%lu\n", sizeof(unsigned long));
	printf("%lu\n", sizeof(ptr));
	printf("%p\n", arr);
	printf("%p\n", ptr);

	for (i=0; i<SIZE; i++) {
		ptr[i] = i+1;
		*(ptr+i) = *(arr+i) * 10;
	}

	for (i=0; i<SIZE; i++) {
		printf("%d ", *ptr);
		ptr += 1;
	}
	printf("\n");
	ptr -= SIZE;

	printf("%p %d\n", ptr, *arr);
	printf("%p %d\n", &arr[3], ptr[3]);
	printf("%p %d\n", arr+3, *(arr+3));
	ptr = arr + 2;
	printf("%p %d\n", ptr, *ptr);
	ptr += 2;
	printf("%p %d\n", ptr-1, *(ptr-1));
	i = ptr - arr;
	printf("%d %d\n", i, arr[i]);
	printf("%d\n", *(arr + (ptr - arr)) );
}