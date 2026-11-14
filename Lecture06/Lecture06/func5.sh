#!/bin/bash
function func {
	expr $x \* $y
	a=$(( (x+y) * $1 ))
	((x*=4, y++)) 
	local b=100
}
x=3; y=5
func 10
echo $a $b $x $y
