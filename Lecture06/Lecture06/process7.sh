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
sleep 0.6
func &
jobs -l
echo "$$ $((++x))"
wait %2
wait %1
