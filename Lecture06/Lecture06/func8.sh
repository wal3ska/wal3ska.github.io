#!/bin/bash
function f {
	n=1
	for((i=1; i<=$1; i++)); do
		(( n *= i ))
	done
}
f $1
echo $n
