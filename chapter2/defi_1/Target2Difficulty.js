function convertHexaToDecimal(d){
    hexa = parseInt(d, 16);
    /*if (hexa.length % 2 == 1) {
      hexa = '0' + hexa
    }*/
    return hexa;
 }

const calculerDifficulte = (target) => {
    return ((Math.pow(2, 16) - 1) * Math.pow(2, 208)) / convertHexaToDecimal(target);
};

document.getElementById('compute_difficulty').addEventListener('click', event => {
 	bitstream = document.getElementById('target_in').value;
 	document.getElementById('difficulty_out').innerHTML = calculerDifficulte(bitstream);
 })

