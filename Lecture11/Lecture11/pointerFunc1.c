#include <stdio.h>

int add(int a, int b){
	return a + b;
}

int mul(int a, int b){
	return a * b;
}

int cal(int (*calculate)(int, int), int x, int y){
	return (*calculate)(x, y);
}

void main() {
	int (*calculate)(int, int);
	int a, b, res, choice;
	while (1) {
		scanf("%d %d %d", &a, &b, &choice);
		if (choice == 1)
			calculate = add;
		else if (choice == 2)
			calculate = mul;
		else
			break;
		res = (*calculate)(a, b);
		printf("%d %d res:%d\n", a, b, res);
	}
	res = cal(add, a, b);
	printf("%d %d res:%d\n", a, b, res);
	res = cal(mul, a, b);
	printf("%d %d res:%d\n", a, b, res);
}