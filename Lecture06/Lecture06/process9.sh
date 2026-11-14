#!/bin/bash
function func {
	echo "$$ $((++x))"
	sleep 2
	echo "$$ $((++x))"
}
x=0
for ((i=0; i<5; i++)); do
	func &
done
jobs -p
for pid in $(jobs -p); do
	echo $pid
	wait $pid
done
