function estPalindrome(string) {
	let start = 0;
	let end = string.length - 1;
	while ((string[start] == string[end]) && (start <= end))
	{
		start += 1;
		end -= 1;
		if (string[start] == " ")
			start += 1;
		if (string[end] == " ")
			end -= 1;
	}
	if (start > end)
		return true;
	else
		return false;
}

function estPalindrome2(str) {
	str = str.split(" ").join("");
    return str === str.split("").reverse().join("");
}



console.log(estPalindrome("ASSIETTE"));
console.log(estPalindrome("ESOPE RESTE ICI ET SE REPOSE"));