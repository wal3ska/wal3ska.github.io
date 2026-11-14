#!/bin/bash
function sum {
	expr $1 + $2
}
a=3
sum $a 5
sum $a 13 25

function hello (){
	echo "Hello $1."
}
hello
hello Emel
exit
