#include <stdio.h>

int main() {
	int x, y, result = 0;
	scanf("%d %d", &x, &y);
	switch(x) {
	case 1: break;
	case 2:
	case 3: result = 100;
	case 4:
		switch(y) {
		case 5: result += 200; break;
		default: result = -200; break;
		}
		break;
	default: result = 400; break;
	}
	printf("x:%d y:%d result:%d\n", x, y, result);
	return 0;
}
