var args = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var os = require('os');
var clear = require('clear');

if (args['g'] === undefined || args['b'] === undefined || args['n'] === undefined) {
	console.log("Arguments invalid: node regexforce.js -g goodfile -b badfile -n size");
	return 0;
}
var good = readFile(args['g']);
var bad = readFile(args['b']);

var regexes = readFile('regexes.reference', '#');

var characters = getChars(good, bad);

var possibilities = characters.concat(regexes);

var positions = args['n'];

var totalPossibilites = Math.pow(possibilities.length, positions);
var completedPossibilities = 0;
var validRegexes = [];

//console.log(possibilities)
generateRegex(positions, "");
outputProgress();

/** This function will try all valid regexes of a particular length.
	It will use available symbols in good and bad coupled with all available
	regex expressions to brute force a working regex. **/
function generateRegex(maxLength, sofar) {

	if (maxLength == 1) {
		for (var i=0; i<possibilities.length; i++) {
			var finishedRegex = sofar + possibilities[i];
			testRegex(finishedRegex);
			completedPossibilities++;
			if (completedPossibilities % 10000 == 0) {
				outputProgress(finishedRegex);
			}
		}
	} else {
		for (var i=0; i< possibilities.length; i++) {
			// test this given possibility before checking its sub possibilities
			var newRegex = sofar+possibilities[i];
			testRegex(newRegex);

			generateRegex(maxLength-1, sofar+possibilities[i]);
		}
	}
}

function testRegex(finishedRegex) {
	try {
		var regex = new RegExp(finishedRegex);
		if (validateRegex(regex)) {
			validRegexes.push(finishedRegex);
		}
		//console.log("Checked regex "+finishedRegex);
	} catch (err) {
		// bzz, not good for us!
	}
}

function getChars(good, bad) {
	var chars = [];

	for (var i=0; i < good.length -1; i++) {
		var thisStr = good[i];
		for (var j=0; j<thisStr.length; j++) {
			if (chars.indexOf(thisStr[j]) == -1)
				chars.push(thisStr[j]);
		}
	}

	for (var i=0; i < bad.length -1; i++) {
		var thisStr = bad[i];
		for (var j=0; j<thisStr.length; j++) {
			if (chars.indexOf(thisStr[j]) == -1)
				chars.push(thisStr[j]);
		}
	}

	return chars;
}

function validateRegex(regex) {
	for (var i = 0; i<good.length -1; i++) {
		var thisStr = good[i];
		if (regex.test(thisStr) == false) {
			return false;
		}
	}

	for (var i = 0; i<bad.length -1; i++) {
		var thisStr = bad[i];
		if (regex.test(thisStr) == true) {
			return false;
		}
	}

	return true; // We did it!
}

function readFile(file, ignore) {
	var op = fs.readFileSync(file, 'utf-8');
	var split = op.split(os.EOL);

	var ret = [];

	for (var i=0; i< split.length; i++) {
		if (split[i][0] != ignore) {
			ret.push(split[i].replace(/[\r\n]/gi, ''));
		}
	}
	return ret;
}

function outputProgress(currentRegex) {
	clear();
	console.log("Progress: "+completedPossibilities+"/"+totalPossibilites+" => "+((completedPossibilities / totalPossibilites)*100)+"%");
	if (currentRegex != null) {
		console.log("Current Regex: "+currentRegex);
	}
	console.log("Valid Regexes: "+validRegexes);
}
