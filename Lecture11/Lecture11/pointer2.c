#include <stdio.h>

void display(int *p, int step){
	if (p != NULL)
		printf("Step:%d\tAddr:%p\tValue:%d\n", step, p, *p);
}

void main() {
	int step=0, x=12, y=34;
	int *p1=NULL, *p2=0;
	display(p1, ++step);
	display(p2, ++step);
	// *p1 = 5;	// Segmentation fault

	p1 = &x;
	p2 = &y;
	p2 = p1;
	*p2 *= 10;
	display(p1, ++step);
	display(p2, ++step);

	*p2 = *p1 * 10;
	printf("%d\n", *&*p2);
	display(&*p1, ++step);
	display(*&p2, ++step);
	display(&*&x, ++step);
	// display(*&&x, ++step);	// error
}