#include <stdio.h>
#include <string.h>

char* suits[4] = {"Clubs", "Diamonds", "Hearts", "Spades"};
char* faces[13] = {"Two", "Three", "Four", "Five", "Six",
		"Seven", "Eight", "Nine", "Ten", "Jack",
		"Queen", "King", "Ace", };

struct {
	char* suit;
	char* face;
} deck[52], card1 = {"Hearts", "Ace"}, *cardPtr = &card1;

struct employee {
	char firstName[20];
	char lastName[20];
	unsigned int age;
	char gender;
	double hourlySalary;
	struct employee *teamLeaderPtr;
};

void display1(struct employee);
void display2(struct employee*);
void assignTeamLeader1(struct employee*, struct employee*);
void assignTeamLeader2(struct employee*, struct employee);

void main() {
	struct employee emp = {"Emel", "Kangal", 30, 'F', 275.5, NULL};
	struct employee *empPtr = &emp;
	struct employee emps[4] = {{"Ali", "Kartal", 35, 'M', 180.0, NULL},
				{"Tuna", "Kaplan", 25, 'F', 218.3, NULL},
				{"Onur", "Aslan", 33, 'M', 194.9, NULL}};
	printf("The size of empPtr: %lu\n", sizeof(empPtr));
	printf("The size of cardPtr: %lu\n", sizeof(cardPtr));
	printf("The size of emp: %lu\n", sizeof(emp));
	printf("The size of emps: %lu\n", sizeof(emps));
	printf("The size of card1: %lu\n", sizeof(card1));
	printf("The size of deck: %lu\n\n", sizeof(deck));

	struct {
		char c;
		short x;
	} align1;
	printf("%lu ", sizeof(align1));
	struct {
		double x;
		char c;
	} align2;
	printf("%lu ", sizeof(align2));
	struct {
		short x;
		double y;
		char c;
	} align3;
	printf("%lu\n", sizeof(align3));

	struct {
		short x;
		char c;
		double a;
		short y, z;
		int b;
	} align4;
	printf("%lu ", sizeof(align4));
	struct {
		short a;
		double x;
		short b;
		double y;
		int z;
	} align5;
	printf("%lu\n", sizeof(align5));

	struct {
		short x;
		double a;
		char c;
		int b;
		short y;
	} align6;
	printf("%lu ", sizeof(align6));
	struct {
		char s[21];
		int x;
		short a;
		char s2[19];
		double y;
	} align7;
	printf("%lu\n\n", sizeof(align7));

	// printf("%p\n", card1);	// error
	printf("%p %p\n", &card1, cardPtr);
	printf("%s %s\n", card1.suit, card1.face);
	printf("%s %s\n", cardPtr->suit, cardPtr->face);
	printf("%s %s\n", (*cardPtr).suit, (*cardPtr).face);
	printf("%c %c\n\n", *card1.suit, *card1.face);
	for (int i=0; i<52; i++){
		deck[i].suit = suits[i/13];
		deck[i].face = faces[i%13];
	}
	/*
	for (int i=0; i<52; i++){
		printf("%2d %-8s %s\n", i+1, deck[i].suit, deck[i].face);
	}*/

	card1.suit = deck[8+13].suit;
	cardPtr->face = deck[8+13].face;
	printf("%-8s %s\n", card1.suit, card1.face);
	card1 = deck[11+13*2];
	printf("%-8s %s\n", card1.suit, card1.face);
	*cardPtr = deck[5+13*3];
	printf("%-8s %s\n", card1.suit, card1.face);
	emps[3] = emp;
	printf("%p\n%p %p\n", emps, &emps[3], &emp);
	printf("emps[3]:\n");	display1(emps[3]);
	printf("\n");

	emps[0].age++;
	emps[0].hourlySalary *= 1.15;
	// emps[0].firstName = "Ahmet";	// error
	strcpy(emps[0].firstName, "Ahmet");
	printf("emps[0]:\n");	display2(emps);
	assignTeamLeader1(emps+1, emps+3);
	printf("emps[1]:\n");	display2(emps+1);
	assignTeamLeader2(emps+2, emps[1]);
	printf("emps[2]:\n");	display2(emps+2);
}

void display1(struct employee emp){
	printf("   %s %s %d %c %.2f\n", emp.firstName, emp.lastName,
			emp.age, emp.gender, emp.hourlySalary);
	if (emp.teamLeaderPtr == NULL)
		printf("   Team Leader is not assigned.\n");
	else	printf("   Team Leader is %s %s.\n",
	emp.teamLeaderPtr->firstName, emp.teamLeaderPtr->lastName);
} 

void display2(struct employee *p){
	printf("   %s %s %d %c %.2f\n", p->firstName, p->lastName,
			p->age, p->gender, p->hourlySalary);
	if (p->teamLeaderPtr == NULL)
		printf("   Team Leader is not assigned.\n");
	else	printf("   Team Leader is %s %s.\n",
	p->teamLeaderPtr->firstName, p->teamLeaderPtr->lastName);
} 

void assignTeamLeader1(struct employee *p1, struct employee *p2){
	p1->teamLeaderPtr = p2;
}

void assignTeamLeader2(struct employee *p, struct employee emp){
	p->teamLeaderPtr = emp.teamLeaderPtr;
}
