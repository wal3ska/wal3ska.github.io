#!/bin/bash
function func {
	return A
}
func
echo $?
echo "Last line"
exit 100
