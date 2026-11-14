#!/bin/bash
echo $((2/3))
printf "$((2/3))\n"
printf "%.1f\n" "1e+2"
printf "%.3f\n" "1e-3"
printf "%.3f\n" "125e-3"
printf "%.3f\n" "$((10**3 * 2/3))e-3"
printf "%.1f\n" "$((10**3 * 2/3))e-3"
printf "%.5f\n" "$((10**3 * 2/3))e-3"
