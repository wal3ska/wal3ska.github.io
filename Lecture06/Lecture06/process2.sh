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
func &
jobs -l
sleep 3
echo "$$ $((++x))"
