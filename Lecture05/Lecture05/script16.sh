#!/bin/bash
names=(Emel Ulku "Muhammed Yilmaz")
echo ${names[1]}
echo $names	# wrong use
echo $names[1]	# wrong use
echo ${names[@]}
echo ${names[2]}
echo ${names[3]}
echo ${#names[@]}
echo ${#names[1]} ${#names[2]}
x=12
y=4.8
echo ${#x} ${#y}
