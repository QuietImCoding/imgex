python3 symb2color.py $2 > symbols.txt
pipenv run python img2regex.py $1 > regex
cat regex | wc -c
