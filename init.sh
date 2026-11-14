#!/bin/bash
if [ -d Dir ]; then
	rm -r Dir
fi

mkdir Dir

mkdir Dir/Dir1
touch Dir/Dir1/File{1..20}
touch Dir/Dir1/{1..2}File{1..4}
touch Dir/Dir1/{1..2}{1..4}File
touch Dir/Dir1/{1..2}File{1..4}{1..4}
touch Dir/Dir1/File{A..F}

mkdir Dir/Dir2
touch Dir/Dir2/{m..n}AA{m..n}AA{m..n}
touch Dir/Dir2/{m..n}AAA{m..n}A{m..n}
touch Dir/Dir2/{m..n}AAA{m..n}
touch Dir/Dir2/{m..o}AvAuA{m..o}
touch Dir/Dir2/{m..o}AxuvAuvA{m..o}
touch Dir/Dir2/{m..n}AA{m..o}vA{m..n}
touch Dir/Dir2/{m..n}Au{m..o}AA{m..n}
touch Dir/Dir2/{m..n}A{m..n}{m..n}A{m..n}
touch Dir/Dir2/{m..o}A{m..o}

mkdir Dir/Dir3

mkdir Dir/Texts
printf "pit\nspot\nspate\nspate\nslap two
respite\nrap them\ntapeth\napth\nwrap/try
sap tray\n87ap9th\nab45gt8\nKL88C\napothecary
File\nFile is\nis File\nFile1\nFile2\nFile3
File_M\nFile_5\n_File\n1File\n8File\n_File_
15File\nFile01\nFile20\nAll_are\nxAA11A
All_are_well\nAll_ are_ what?
assumes word senses. Within
does the clustering. In the
but when? It was hard to tell
he arrive. After she had
mess! He did not let it\nA0
it was not hers! She replied
always thought so.) Then\n1AA
125ab\nAll 55 are\n1 zz _Z_ ,
We, are, fine.\nXYZ xyz 123
when 50 is half of 100\nA
Price is $ 100 .\n495\n10A0A1A
What is the PRIZE?
5 of 12 apples are rotten\n" > Dir/Texts/Text.txt
