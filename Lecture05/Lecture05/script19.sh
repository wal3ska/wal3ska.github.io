#!/bin/bash
echo {a,b,c,d,e}
echo {50..55}
echo {8..2}
echo {10..0..2}
echo {A..E}
echo {A..N..3}
echo {040..044}
echo {A..C}{1..3}
echo "Hi "{Ali,Merve,Selim}"."
touch "test_"{1..4}".txt"
ls test_[0-9].txt
dec2bin=({0..1}{0..1}{0..1}{0..1}{0..1}{0..1}{0..1}{0..1})
echo ${dec2bin[25]}
