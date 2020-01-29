function find(number, min, max) {
	let testNumber = min + Math.floor((max - min) / 2);
	console.log("My proposal is " + testNumber);
	if (testNumber == number)
		console.log("Answer is " + testNumber);
	else if (max - min <= 1)
		console.log("Answer is " + ++testNumber);
	else if (testNumber > number)
		find(number, min, testNumber);
	else
		find(number, testNumber, max);
}

let args = process.argv;
if (args.length < 3)
	console.log("Please enter a number between 1 and 100");
else
{
	let number = parseInt(args[2]);
	if (isNaN(number) || (number < 0) || (Math.abs(number) > 100))
		console.log("Please enter a number between 1 and 100");
	else {
		find(number, 0, 100);
 	}
 }
 	

