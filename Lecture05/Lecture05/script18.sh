#!/bin/bash
arr=(a b c d e "m n")
for x in "${arr[@]}"; do
	echo -n "$x, "
done
echo
for ((i=0; i<${#arr[@]}-1; i++)); do
	echo -n "${arr[$i]}, "
done
echo ${arr[$i]}
