#!/bin/bash
echo "What would you like to eat?"
read var
case "$var" in
	[Bb]urger) echo "burger is being prepared";;
	[Ff]ries) echo "fries is being prepared";;
	[Pp]izza) echo "pizza is being prepared";;
	*) echo "invalid input"
	echo "exiting";;
esac
