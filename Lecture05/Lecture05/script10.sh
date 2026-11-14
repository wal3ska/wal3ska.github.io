#!/bin/bash
echo My name is $0
echo My process ID is $$
echo I was called with $# parameters
echo "$*"
i=1
while [ "$#" -gt 0 ]
do
	echo "argument $i is $1"
	i=$(expr "$i" + 2)
	if ! shift 2
	then
		shift 1
	fi
done
