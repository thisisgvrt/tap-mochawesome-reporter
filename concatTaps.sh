#!/bin/bash
set -Ee    

files=("$@")
if ((${#files[@]} == 0)); then
	echo "files not found"
  	exit 3
fi

echo "TAP version 13"

arraylength=${#files[@]}

for (( i=1; i<${arraylength}+1; i++ ));
do
	file=${files[$i-1]}
	echo "# Subtest:" $file

	test -e ${file} || exit
	broken=false
	while read -r line
	do
		if [[ $line =~ ^not\ ok ]]
			then broken=true
		fi
	    echo "    "${line}
	done < ${file}

	if $broken
		then echo "not ok $i - $file"
	else
		echo "ok $1 - $file"
	fi
	
done

echo "1..$arraylength"