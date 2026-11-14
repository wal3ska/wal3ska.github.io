#!/bin/bash
i=1
while [ "$i" -le 10 ]
do
	if [ "$i" -lt 10 ]
	then
		echo -n "$i "
	else
		echo "$i"
	fi
	i=$(expr "$i" + 1)
done
