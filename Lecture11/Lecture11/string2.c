#include <stdio.h>

void toUpper(char *p){
	while(*p != '\0'){
		if ('a'<=*p && *p<='z')
			*p = 'A' + (*p - 'a');
		p++;
	}
}

void main() {
	char s[] = "is The Price $39.99?";
	toUpper(s);
	printf("%s\n", s);
}