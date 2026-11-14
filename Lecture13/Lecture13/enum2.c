#include <stdio.h>

enum numberType { INT, FLOAT, DOUBLE };

typedef struct {
	enum numberType type;
	union {
		int nints[2];
		float nfloats[2];
		double ndouble;
	};
} number;

void operate(number *p) {
	switch(p->type) {
	case INT:
		printf("%d\n", p->nints[0]+p->nints[1]);
		break;
	case FLOAT:
		printf("%.2f\n", p->nfloats[0]+p->nfloats[1]);
		break;
	case DOUBLE:
		printf("%.2f\n", p->ndouble);
		break;
	default:
		break;
	}
}

void main() {
	number num1;
	num1.nfloats[0] = 110.16;
	num1.nfloats[1] = 50.32;
	for (enum numberType t=INT; t<=DOUBLE; t++){
		num1.type = t;
		operate(&num1);
	}
}
