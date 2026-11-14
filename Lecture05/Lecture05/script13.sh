#!/bin/bash
if ((1+2 < 5))
then
	echo "true"
fi
for ((i=10; i<50; i+=10)); do
	echo -n "$i "
done
echo
i=0
while ((i<5)); do
	echo -n "$i "
	((i++))
done
echo
