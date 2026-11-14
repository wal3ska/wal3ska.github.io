#!/bin/bash
var1="Global"
function func1 {
	echo $var1
	local var1="Local"
	echo $var1
}
function func2 {
	echo $var1
	echo $var2
	var3="Emel"
	echo $var3
}
func1; echo $var1
var2=125
func2; echo $var3
