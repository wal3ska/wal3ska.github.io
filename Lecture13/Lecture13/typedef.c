#include <stdio.h>
#include <limits.h>

#if SHRT_MAX == 2147483647
typedef unsigned short uint32_t;
#elif INT_MAX == 2147483647
typedef unsigned int uint32_t;
#elif LONG_MAX == 2147483647
typedef unsigned long uint32_t ;
#elif LLONG_MAX == 2147483647
typedef unsigned long long uint32_t;
#else
#error "Cannot find integer of 4 bytes."
#endif

void main(){
	uint32_t x = 10;
	printf("%lu %d\n", sizeof(uint32_t), x);
}