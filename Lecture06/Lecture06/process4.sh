#!/bin/bash
function func {
	echo "$$ $((++x))"
	echo "$$ $((++x))"
	sleep 2
	echo "$$ $((++x))"
	echo "$$ $((++x))"
}
x=0
echo "$$ $x"
func &
jobs -l
sleep 1
echo "$$ $((++x))"
echo "$$ $((++x))"
echo "$$ $((++x))"
kill $!
