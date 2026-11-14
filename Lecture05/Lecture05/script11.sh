#!/bin/bash
x=2
y=3
if [ $x -lt $y ]; then
	echo "$x < $y"
fi
if (( x < y )); then
	echo "$x < $y"
fi
((x*=5, y++, a=x-y))
echo $x $y $a
