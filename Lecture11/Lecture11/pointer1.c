#include <stdio.h>

void main() {
	int* p1, x, *p2=&x;
	printf("%p %p\n", p1, p2);
	p1 = p2;
	printf("%p %p\n", p1, p2);
	*p1 = 1000;
	printf("%p %d\n", &x, x);

	int y, * ptr1 = &y;
	printf("%p %p\n", &y, ptr1);
	int* *ptr2 = &ptr1;
	printf("%p %p\n", &ptr1, ptr2);
	int* * *ptr3;
	ptr3 = &ptr2;
	printf("%p %p\n", &ptr2, ptr3);
	* * *ptr3 = 123;
	printf("%d %d\n", *ptr1, ***ptr3);

	**ptr3 = &x;
	**ptr2 = 10;
	printf("%d %d\n", y, x);

	int ** p3, **p4;
	p3 = &p2;
	p4 = &p1;
	**p3 = 250;
	printf("%d %d\n", *p1, **p3);
	printf("%d %d\n", *p2, **p4);
	
	p2 = &y;
	**p3 = 75;
	**p4 = 20;
	printf("%d %d\n", *p1, **p4);
	printf("%d %d\n", *p2, **p3);
}