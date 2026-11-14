#!/bin/bash
function func {
	sleep 2
	echo "$$ $((++x))"
	echo "$$ $((++x))"
	echo "$$ $((++x))"
}
x=0
echo "$$ $x"
func &
func &
jobs -l
sleep 0.6
echo "$$ $((++x))"
wait %1
wait %2
