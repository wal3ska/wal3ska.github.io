#!/bin/bash
echo $(( 3 * (2 + 1) ))
echo $((3*(2+1)))
x=$((3*(2+1)))
echo $x
echo $((x+3))
((x+=1))
((x += 2))
echo $x
echo $((x++))
echo $((++x))
echo $((x=4,y=5,a=x*y,b=a/2))
echo $x $y $a $b
