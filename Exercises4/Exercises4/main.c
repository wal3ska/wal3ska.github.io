#include "exercises4.h"
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
	for (int i=8; i<13; i++){
		strcpy(s, strings[i]);		printf("%s\n", s);
		soru01(s);			printf("%s\n", s);
	}
	
	printf("\n----------------------------------------soru02----------------------------------------\n");
	strcpy(s,strings[3]);	c='N';	printf("\'%c\' is %ld-th character in \'%s\'\n", c, soru02(s, c)-s, s);
	strcpy(s,strings[3]);	c='k';	printf("\'%c\' is %ld-th character in \'%s\'\n", c, soru02(s, c)-s, s);
	strcpy(s,strings[6]);	c='e';	printf("\'%c\' is %ld-th character in \'%s\'\n", c, soru02(s, c)-s, s);
	strcpy(s,strings[9]);	c='e';	printf("\'%c\' is %ld-th character in \'%s\'\n", c, soru02(s, c)-s, s);
	strcpy(s,strings[11]);	c='1';	printf("\'%c\' is %ld-th character in \'%s\'\n", c, soru02(s, c)-s, s);
	strcpy(s,strings[13]);	c='-';	printf("\'%c\' is %ld-th character in \'%s\'\n", c, soru02(s, c)-s, s);
	strcpy(s,strings[3]);	c='n';	printf("\'%c\' is %p in \'%s\'\n", c, soru02(s, c), s);
	
	printf("\n----------------------------------------soru03----------------------------------------\n");
	strcpy(s,strings[3]);	c='N';	soru03(s, c, cP); printf("\'%c\' is %ld-th character in \'%s\'\n", c, *cP-s, s);
	strcpy(s,strings[3]);	c='k';	soru03(s, c, cP); printf("\'%c\' is %ld-th character in \'%s\'\n", c, *cP-s, s);
	strcpy(s,strings[6]);	c='e';	soru03(s, c, cP); printf("\'%c\' is %ld-th character in \'%s\'\n", c, *cP-s, s);
	strcpy(s,strings[9]);	c='e';	soru03(s, c, cP); printf("\'%c\' is %ld-th character in \'%s\'\n", c, *cP-s, s);
	strcpy(s,strings[11]);	c='1';	soru03(s, c, cP); printf("\'%c\' is %ld-th character in \'%s\'\n", c, *cP-s, s);
	strcpy(s,strings[13]);	c='-';	soru03(s, c, cP); printf("\'%c\' is %ld-th character in \'%s\'\n", c, *cP-s, s);
	strcpy(s,strings[3]);	c='n';	soru03(s, c, cP); printf("\'%c\' is %p in \'%s\'\n", c, *cP, s);

	printf("\n----------------------------------------soru04----------------------------------------\n");
	soru04(strings[3], ' ', &x);		printf("%s  %d\n", strings[3], x);
	soru04(strings[7], 'i', &x);		printf("%s  %d\n", strings[7], x);
	soru04(strings[10], 'A', &x);		printf("%s  %d\n", strings[10], x);
	soru04(strings[11], '1', &x);		printf("%s  %d\n", strings[11], x);
	soru04(strings[12], '.', &x);		printf("%s  %d\n", strings[12], x);
	soru04(strings[13], '-', &x);		printf("%s  %d\n", strings[13], x);
	
	printf("\n----------------------------------------soru05----------------------------------------\n");
	for (int i=6; i<9; i++){
		strcpy(s, strings[i]);		printf("%s\n", s);
		soru05(s, 'e', &x);		printf("%s  %d\n", s, x);
		soru05(s, 'l', &x);		printf("%s  %d\n", s, x);
	}

	printf("\n----------------------------------------soru06----------------------------------------\n");
	printf("\'%s\' %s \'%s\'\n", strings[3], comparison[soru06(strings[3], strings[7])+1], strings[7]);
	printf("\'%s\' %s \'%s\'\n", strings[9], comparison[soru06(strings[9], strings[1])+1], strings[1]);
	printf("\'%s\' %s \'%s\'\n", strings[0], comparison[soru06(strings[6], strings[11])+1], strings[11]);
	printf("\'%s\' %s \'%s\'\n", strings[6], comparison[soru06(strings[6], strings[6])+1], strings[6]);
	
	printf("\n----------------------------------------soru07----------------------------------------\n");
	strcpy(s, "ABCDEEDCBA");	printf("%s   %s\n", s, soru07(s) ? "Palindrome" : "Not palindrome");
	strcpy(s, "A _.5._ A");		printf("%s   %s\n", s, soru07(s) ? "Palindrome" : "Not palindrome");
	strcpy(s, "123 .4 321");	printf("%s   %s\n", s, soru07(s) ? "Palindrome" : "Not palindrome");
	strcpy(s, "123 .4. 21");	printf("%s   %s\n", s, soru07(s) ? "Palindrome" : "Not palindrome");
	strcpy(s, "12a__-P-__a21");	printf("%s   %s\n", s, soru07(s) ? "Palindrome" : "Not palindrome");
	
	printf("\n----------------------------------------soru08----------------------------------------\n");
	soru08(A, sizeA, &p);		printf("Maximum: %d\n", *p);
	soru08(A1, sizeA1, &p);		printf("Maximum: %d\n", *p);
	soru08(A2, sizeA2, &p);		printf("Maximum: %d\n", *p);

	printf("\n----------------------------------------soru09----------------------------------------\n");
	soru09(A2D, 6, SIZE_MAX, p);		printf("Minimum: %d\n", *p);
	soru09(A2D, 5, SIZE_MAX, p);		printf("Minimum: %d\n", *p);
	soru09(A2D+3, 2, SIZE_MAX, p);		printf("Minimum: %d\n", *p);

	printf("\n----------------------------------------soru10----------------------------------------\n");
	soru10(strings, 15, A);			printArray(A, 15);
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
