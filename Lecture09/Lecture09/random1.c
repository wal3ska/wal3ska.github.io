#include <stdio.h>
#include <stdlib.h>

void main(){
	printf("%d\t%d\t%d\n", rand(), rand(), rand());

	srand(0);
	printf("%d\t%d\t%d\n", rand(), rand(), rand());
	printf("%d\t%d\t%d\n", rand(), rand(), rand());
	
	srand(0);
	printf("%d\t%d\t%d\n", rand(), rand(), rand());
	printf("%d\t%d\t%d\n", rand(), rand(), rand());
}