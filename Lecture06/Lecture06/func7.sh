#!/bin/bash
function f {
	if (($1!=1)); then
		(( n *= $1 ))
		f $(($1 - 1))
	fi
}
n=1
f $1
echo $n
