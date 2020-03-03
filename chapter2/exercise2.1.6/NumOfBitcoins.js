function bitcoinsEnCirculation(hauteurBloc) {

	let q = Math.floor((hauteurBloc+1) / 210000);
	let r = (hauteurBloc+1) % 210000;
	let numBC = 0;
	let reward = 50;

	for (let i = 0; i < q; i++){
		numBC += reward * 210000;
		reward = (Math.floor((50 / Math.pow(2, Math.floor(i+1))) * Math.pow(10, 8)) / Math.pow(10,8));
	}

	numBC += reward * r;

    return numBC;
}

console.log(bitcoinsEnCirculation(0));
console.log(bitcoinsEnCirculation(210000));
console.log(bitcoinsEnCirculation(2100001));
