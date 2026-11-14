#!/bin/bash
echo My name is $0
echo My process ID is $$
echo I was called with $# parameters
echo "Arguments are:"
for x in $*
do
	echo "$x"
done
echo "Argument 3 is $3"
echo
i=1
while [ "$#" -gt 0 ]
do
	echo "Argument $i is $1"
	i=$(expr "$i" + 1)
	shift
done
