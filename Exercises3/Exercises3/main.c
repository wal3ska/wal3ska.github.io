#include "exercises3.h"
#include <stdio.h>
#include <string.h>

void printArray(const int*, int);
void printMatrix(const int A[][SIZE_MAX], int, int);

void main(int argc, char* argv[]){
	int A2D[][SIZE_MAX] = { {10,55,20,45,30,35,40,25,50,15}, {9,8,7,6,5,4,3,2,1,0}, {-1,-2,-3,-4,-5,-6,-7,-8,-9,0},
				{8,6,4,2,0,8,6,4,2,0}, {11,15,21,29,26,22,18,14,8,4}, {0,-5,-10,-11,-3,3,-11,20,30,40} };
	int sizeA=34, A[] = {-3,-1,0,1,99,1,2,22,34,3,3,46,55,5,6,-10,6,7,8,80,4,10,11,13,15,18,90,9,20,25,30,35,38,45};
	int sizeA1=18, A1[] = {-5,-2,0,1,2,2,3,5,6,8,8,11,11,11,15,18,20,29};
	int sizeA2=17, A2[] = {-5,-3,-1,0,1,2,3,4,6,7,8,8,10,13,17,22,25};
	char* strings[] = {"System Programming", "Deep Learning", "Computer Vision", "Artificial Neural Network",
			"Machine Learning", "Data Structure", "Computer Engineering", "Artificial Intelligence",
			"Linear Algebra", "Data Science", "@gmail", "101 BIL", "<stdio.h>", "---Linux---", "#of"};
	char c, *cp, **cP=&cp, s[30], *comparison[] = {"is EARLIER than", "is EQUAL to", "is LATER than"};
	int frequencies[26], evens[40], odds[40], B[40], size, x, y, *p=&x;

	printf("----------------------------------------initials----------------------------------------\n");
	printMatrix(A2D, 6, SIZE_MAX);
	for (int i=0; i<15; i++){
		printf("%s\n", strings[i]);
	}

	printf("\n----------------------------------------soru01----------------------------------------\n");
	for (int i=6; i<9; i++){
		printf("%s\n", strings[i]);
		x = soru01(strcpy(s, strings[i]), 'e');
		printf("%s  %d\n", s, x);
		x = soru01(s, 'l');
		printf("%s  %d\n", s, x);
	}
	
	printf("\n----------------------------------------soru02----------------------------------------\n");
	for (int i=0; i<4; i++){
		soru02(strings[i], frequencies);	printArray(frequencies, 26);
	}
	
	printf("\n----------------------------------------soru03----------------------------------------\n");
	printArray(A, sizeA);
	size = soru03(A, sizeA, evens, odds);
	printf("evens: ");	printArray(evens, size);
	printf("odds: ");	printArray(odds, sizeA-size);
	
	printf("\n----------------------------------------soru04----------------------------------------\n");
	printf("A1: ");		printArray(A1, sizeA1);
	printf("A2: ");		printArray(A2, sizeA2);
	soru04(A1, sizeA1, A2, sizeA2, B);
	printf("B: ");		printArray(B, sizeA1+sizeA2);

	printf("\n----------------------------------------soru05----------------------------------------\n");
	for (int i=0; i<6; i++){
		soru05(strcpy(s, strings[i]));		printf("%s\n", s);
	}
	
	printf("\n----------------------------------------soru06----------------------------------------\n");
	x=211791583,	y=5;	soru06(x, s, y);	printf("%d equals to %s in base %d.\n", x, s, y);
	x=211791583,	y=16;	soru06(x, s, y);	printf("%d equals to %s in base %d.\n", x, s, y);
	x=745121879,	y=8;	soru06(x, s, y);	printf("%d equals to %s in base %d.\n", x, s, y);
	x=745121879,	y=36;	soru06(x, s, y);	printf("%d equals to %s in base %d.\n", x, s, y);

	printf("\n----------------------------------------soru07----------------------------------------\n");
	printf("%s  %d\n", strings[5], soru07(strings[5], "ta S"));
	printf("%s  %d\n", strings[9], soru07(strings[9], "ta S"));
	printf("%s  %d\n", strings[3], soru07(strings[3], " Ne"));
	printf("%s  %d\n", strings[6], soru07(strings[6], "bil"));
	printf("%s  %d\n", strings[6], soru07(strings[6], "in"));

	printf("\n----------------------------------------soru08----------------------------------------\n");
	soru08(A2D, 6, 10, evens, odds);
	printf("Row sums: ");			printArray(evens, 6);
	printf("Column sums: ");		printArray(odds, 10);
	soru08(A2D, 4, 6, evens, odds);
	printf("Row sums: ");			printArray(evens, 4);
	printf("Column sums: ");		printArray(odds, 6);
}

void printArray(const int* A, int size){
	for (int i=0; i<size-1; i++){
		printf("%d ", A[i]);
	}
	printf("%d\n", A[size-1]);
}

void printMatrix(const int A[][SIZE_MAX], int rowSize, int colSize){
	for (int i=0; i<rowSize; i++){
		printArray(A[i], colSize);
	}
}
