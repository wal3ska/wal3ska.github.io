#!/bin/bash
f="$(cat files)"
for file in $f
do
	if [ -f $file ]
	then
		echo "$file"
	fi
done
