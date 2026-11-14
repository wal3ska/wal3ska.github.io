#include <stdio.h>

const char *monthNames[] = {"", "January", "February", "March", "April", "May",
	"June", "July", "August", "September", "October", "November", "December"};

enum months1 { JAN=1, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC };

void main() {
	enum months1 m1 = JUN;
	printf("%2d %s\n", m1, monthNames[m1]);
	m1 += 3;
	printf("%2d %s\n", m1, monthNames[m1]);

	for (enum months1 m = JAN; m<=DEC; m++)
		printf("%2d %s\n", m, monthNames[m]);

	enum months2 { JAN=1, FEB, MAY=5, JUN, JUL, OCT=JUL+3, NOV, DEC };
	enum months2 m2 = MAY;
	printf("%2d %s\n", m2, monthNames[m2]);
	m2 = OCT;
	printf("%2d %s\n", m2, monthNames[m2]);
}
