#include <stdio.h>

void main() {
	char str[40], s[15] = "Ahmet";
	int size, x=21;
	float y;
	size = sprintf(str, "%s is %d years old.", s, x);
	printf("size:%d str:%s\n", size, str);
	size = scanf("Student %s is %d years old, %f is a number.", s, &x, &y);
	printf("size:%d s:%s x:%d y:%.3f\n", size, s, x, y);
	size = sscanf(str, "%s is %d years old.", s, &x);
	printf("size:%d s:%s x:%d\n", size, s, x);
}
