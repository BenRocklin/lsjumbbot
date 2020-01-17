#!/bin/sh
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
echo $SCRIPTPATH
for d in */
do
	if [ "$d" = "Images/" ]; then
		continue
	fi
	directory=$(basename "$d")
	for entry in "$d"*
	do
		filename=$(basename -- "$entry")
		filename="${filename%.*}"
		foo="Images/${filename}"
		echo "$foo"
		pdftoppm "$entry" "$foo" -png
	done
done