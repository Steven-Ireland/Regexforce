#Regular expression solver!

Taking inspiration from the site http://regex.alf.nu/, this program aims to be able to brute force regular expressions based on sample "good" and "bad" sets of input. 

Currently it takes a list of valid regular expression symbols (To improve speed, they can be commented out with # in regexes.reference) and combines that with all symbols found in the good and bad list of files. It then uses this combined list to brute force a regular expression that matches the good and does not match the bad!

You can run it like:

```
node regexforce.js -g good.example -b bad.example -n 4
```

-g: Line-delimited good words
-b: Line-delimited bad words
-n: Max length of regular expression to generate (beware, this grows exponentially with the size of the dataset!)

Next up:
- Some form of logic to stop generating so many trash expressions
- Limited option (use a number of lines from good and bad files which have similar character sets to cut down on execution time)
- Generic mode (do not consider the characters in the text, only use regular expression symbols
