#!/bin/bash
function quit {
	exit 100
}
function sum {
	res=0
	for x in $*; do
		res=$(expr $res + $x)
		res=$((res+x))
		((res+=x))
	done
	printf "Sum of numbers are: %d\n" $((res=res/3))
	printf "Average is: %d\n" $((res/$#))
}
sum 10 50 -5 13 7
quit
echo "Last line"
