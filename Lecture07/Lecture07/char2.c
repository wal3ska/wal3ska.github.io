#include <stdio.h>

int main(){
	printf("Do you want to exit, Yy?\n");
	char c = getchar();
	getchar();
	while (c!='Y' && c!='y'){
		printf("Do you want to exit, Yy?\n");
		c = getchar();
		getchar();
	}
	return 0;
}