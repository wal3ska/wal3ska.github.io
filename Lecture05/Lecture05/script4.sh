#!/bin/bash
for file in *.sh
do
	cat $file >> record.txt 
	echo "Status: $?"
done
