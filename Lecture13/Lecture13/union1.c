#include <stdio.h>
#include <string.h>

typedef union {
	int x;
	double y;
	char s[7];
} data;

void main() {
	data data1, data2 = { 500.9999 };
	printf("The size of data: %lu\n", sizeof(data));
	printf("x: %d\ty: %f\ts: %s\n", data2.x, data2.y, data2.s);
	data1.y = 50.0099;
	printf("x: %d\ty: %f\ts: %s\n", data1.x, data1.y, data1.s);
	strcpy(data1.s, "BIL214");
	printf("x: %d\ty: %f\ts: %s\n", data1.x, data1.y, data1.s);
	data1.x = -100000;
	printf("x: %d\ty: %f\ts: %s\n", data1.x, data1.y, data1.s);
	data2 = data1;
	printf("x: %d\ty: %f\ts: %s\n", data2.x, data2.y, data2.s);
}
