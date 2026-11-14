#include <stdio.h>

void swap1(int i1, int i2){
	int tmp = i1;
	i1 = i2;
	i2 = tmp;
}

void swap2(int *ptr1, int *ptr2){
	int *tmp = ptr1;
	ptr1 = ptr2;
	ptr2 = tmp;
}

void swap3(int *ptr1, int *ptr2){
	int tmp = *ptr1;
	*ptr1 = *ptr2;
	*ptr2 = tmp;
}

void swap4(int **ptr1, int **ptr2){
	int *tmp = *ptr1;
	*ptr1 = *ptr2;
	*ptr2 = tmp;
}

void main() {
	int x=99, y=25, *p1=&x, *p2=&y;
	printf(" x: %p %d\n", &x, x);
	printf(" y: %p %d\n", &y, y);
	
	x=99; y=25; swap1(x, y);
	printf("p1: %p %d x:%d\n", p1, *p1, x);
	printf("p2: %p %d y:%d\n", p2, *p2, y);

	x=99; y=25; swap2(p1, p2);
	printf("p1: %p %d x:%d\n", p1, *p1, x);
	printf("p2: %p %d y:%d\n", p2, *p2, y);

	x=99; y=25; swap3(p1, p2);
	printf("p1: %p %d x:%d\n", p1, *p1, x);
	printf("p2: %p %d y:%d\n", p2, *p2, y);

	x=99; y=25; swap4(&p1, &p2);
	printf("p1: %p %d x:%d\n", p1, *p1, x);
	printf("p2: %p %d y:%d\n", p2, *p2, y);
}