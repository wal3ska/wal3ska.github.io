#include <stdio.h>

typedef union {
	struct {
		unsigned char byte1;
		unsigned char byte2;
		unsigned char byte3;
		unsigned char byte4;
	};
	unsigned int word;
} Register;

void main() {
	Register reg1;
	reg1.word = 0xF0A05000;
	printf("%d\n", reg1.byte1);
	printf("%d\n", reg1.byte2);
	printf("%d\n", reg1.byte3);
	printf("%d\n", reg1.byte4);
}
