function Factoriel(a){
	let factoriel = 1;
	for (let i = 2; i <= a; i++){
		factoriel *= i;
	}
	return factoriel;
}

console.log(Factoriel(100));