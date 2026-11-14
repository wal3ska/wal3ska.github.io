#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int increase1(int a) {
	return ++a;
}

int decrease1(int a) {
	return --a;
}

int multiply2(int a) {
	return a*2;
}

int divide2(int a) {
	return a/2;
}

int add10(int a) {
	return a+10;
}

int subtract10(int a) {
	return a-10;
}

void main() {
	int (*operation[6])(int) = {increase1, decrease1, multiply2, divide2, add10, subtract10};
	srand( time(NULL) );
	int num = rand() % 100;
	int guess, step=1, choice;

	printf("Enter initial guess (between 0 and 99): ");
	scanf("%d", &guess);
	printf("Options list:\n- 1 to increase by 1\n- 2 to decrease by 1\n- 3 to multiply with 2");
	printf("\n- 4 to divide with 2\n- 5 to add 10\n- 6 to subtract 10\n- 0 to end the game\n");
	while (guess != num) {
		printf("Step %2d: %d is %s than the number: ", step, guess, guess<num ? "lower" : "higher");
		scanf("%d", &choice);
		if (choice == 0)
			break;
		guess = (*operation[choice-1])(guess);
		step++;
	}
	printf("You guess the number %d correctly in %d steps.\n", num, step);
}