function convertHexaToDecimal(d){
    hexa = parseInt(d, 16);
    /*if (hexa.length % 2 == 1) {
      hexa = '0' + hexa
    }*/
    return hexa;
 }


 document.getElementById('convert_hex2dec').addEventListener('click', event => {
 	hexadecimal = document.getElementById('hexadecimal_in').value;
 	document.getElementById('decimal_out').innerHTML = convertHexaToDecimal(hexadecimal);
 })