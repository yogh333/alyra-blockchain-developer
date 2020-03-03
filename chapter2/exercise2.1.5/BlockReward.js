function recompenseBloc(hauteurBloc) {
    let expo = hauteurBloc / 210000;
    console.log(expo);
    return Math.floor((50 / Math.pow(2, Math.floor(expo))) * Math.pow(10, 8)) / Math.pow(10,8);
}

console.log(recompenseBloc(0));
console.log(recompenseBloc(210000));
console.log(recompenseBloc(2100001));
