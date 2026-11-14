#include <stdio.h>

#define mul(x1, x2) (x1 * x2)
#define NUM 100

#ifndef NUM
#define NUM 10000
#endif

#ifndef PRECISION
#define PRECISION 5
#endif

#ifndef PI
#if PRECISION==2
#define PI 3.14
#elif PRECISION==3
#define PI 3.141
#elif PRECISION==4
#define PI 3.1415
#else
#define PI 3.14159
#endif
#endif

void main() {
	printf("PI: %.6f\n", PI);
	printf("res: %.2f\n", mul(PI, NUM));
}
