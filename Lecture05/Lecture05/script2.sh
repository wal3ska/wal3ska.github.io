#!/bin/bash
case whoami in
	root) echo "You are the root";;
	*) echo "You are not the root"
	printf "You are: %s\n" $(whoami);;
esac
