#!/bin/bash
function f {
	if (($1==1)); then
		return 1
	else
		f $(($1 - 1))
		return $(($1 * $?))
	fi
}
f $1
echo $?
