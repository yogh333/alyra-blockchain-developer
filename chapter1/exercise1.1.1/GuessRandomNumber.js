function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


let randNumber = getRandomInt(100);
console.log("Number to guess is "+randNumber);
let testNumber = 0;
let difference = 0;
let sign = 0;
do {
	testNumber = parseInt(prompt("Entrez un nombre entre 1 et 100 svp"), 10);
	console.log("Test number = "+testNumber);
	difference = (randNumber - testNumber);
	sign = Math.sign(difference);
	difference = Math.abs(difference);
	console.log("Difference = "+difference);
	if (sign === 0)
		alert("Bravo !");
	else if (difference <= 5)
		if (sign == 1)
			alert("Au dessous mais vous y êtes presque !");
		else 
			alert("Au dessus mais vous y êtes presque !");
	else if (difference <= 10)
		if (sign == 1)
			alert("Au dessous mais vous êtes proche.");
		else
			alert("Au dessus mais vous êtes proches.")
	else 
		if (sign == 1)
			alert("Au dessous...");
		else 
			alert("Au dessus...");
	
} while ((testNumber != randNumber) && !isNaN(testNumber)) ;


