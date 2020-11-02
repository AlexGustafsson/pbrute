#!/usr/bin/env bash

set -e

curl https://raw.githubusercontent.com/OWASP/passfault/master/wordlists/wordlists/10k-worst-passwords.txt > dictionaries/tmp.txt
sed -i -e "s/\(.*\)/  '\1',/" dictionaries/tmp.txt

# 10 000
echo "module.exports = [" > dictionaries/owasp-top-10000.js
cat dictionaries/tmp.txt >> dictionaries/owasp-top-10000.js
echo "];" >> dictionaries/owasp-top-10000.js

# 100
echo "module.exports = [" > dictionaries/owasp-top-100.js
head -n 100 dictionaries/tmp.txt >> dictionaries/owasp-top-100.js
echo "];" >> dictionaries/owasp-top-100.js

rm dictionaries/tmp.txt
