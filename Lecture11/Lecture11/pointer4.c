#include <stdio.h>

/*
int* max0(int i1, int i2){
	if (i1 > i2)
		return &i1;
	else if (i2 > i1)
		return &i2;
	return NULL;
}
*/

int* max1(int i1, int i2) {
	int *ptr=NULL;
	if (i1 > i2)
		ptr = &i1;
	else if (i2 > i1)
		ptr = &i2;
	return ptr;
}

int* max2(int *ptr1, int *ptr2) {
	if (*ptr1 > *ptr2)
		return ptr1;
	else if (*ptr2 > *ptr1)
		return ptr2;
	return NULL;
}

void main() {
	int x=99, y=25, *p;
	printf("x: %p %d\n", &x, x);
	printf("y: %p %d\n", &y, y);
	
	p = max1(x, y);
	printf("p: %p\n", p);

	p = max2(&x, &y);
	printf("p: %p\n", p);
}