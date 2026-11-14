#include <stdio.h>

void main(int argc, char *argv[]) {
	printf("argv[0]: %s\n", argv[0]);
	printf("argv[4]: %s\n", argv[4]);
	printf("argc: %d\n", argc);
	argc--;

	int arr[argc], sum=0;
	char *p;
	for(int i=0; i<argc; i++) {
		p = argv[i+1];
		arr[i] = 0;
		while (*p != '\0'){
			arr[i] *= 10;
			arr[i] += *p - '0';
			p++;
		}
		sum += arr[i];
	}
	for(int i=0; i<argc; i++)
		printf("%d ", arr[i]);
	printf("\nSum: %d\n", sum);
}