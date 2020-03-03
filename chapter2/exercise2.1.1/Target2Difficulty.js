const calculerDifficulte = (cible) => {
    return ((Math.pow(2, 16) - 1) * Math.pow(2, 208)) / cible;
} ;

console.log(calculerDifficulte(1147152896345386682952518188670047452875537662186691235300769792000));
