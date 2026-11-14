#!/bin/bash
echo "We are in the directory $PWD with files:"
ls #lists files

echo -e "\nContent of the file text.txt:"
cat text.txt

cd ..
echo -e "\nWe are in the directory $PWD with files:"
ls
