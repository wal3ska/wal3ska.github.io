#!/bin/bash
names=(Ali Merve 10.25 15 100)
echo ${#names[@]}
echo ${names[4]} ${names[2*2]}
echo ${names[${#names[@]}-1]}
printf "%.2f\n" ${names[2]}
expr ${names[3]} + ${names[4]}
arr[0]=1
echo ${arr[@]}
arr[1]=2
arr[3]=4
echo ${arr[@]}
echo ${#arr[@]}
echo ${arr[2]}
echo ${arr[3]}
