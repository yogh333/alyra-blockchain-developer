var crypto = require('crypto');
const sha256 = require('crypto-js/sha256');
const ripemd160 = require('crypto-js/ripemd160');
var ecurve = require('ecurve');
var BigInteger = require('bigi');
const b58 = require('b58');


/*let randomBits = "";
for (let i = 0; i < 1024; i++)
	randomBits += (Math.random() < 0.5 ? "0":"1");
let privateKey = sha256(randomBits).toString();
console.log("Private key = " + privateKey.split(''));*/

var privateKey = Buffer.from("1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd", 'hex');

let ecparams = ecurve.getCurveByName('secp256k1');
var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privateKey));
var x = curvePt.affineX.toBuffer(32);
var y = curvePt.affineY.toBuffer(32);

var publicKey = Buffer.concat([Buffer.from([0x04]), x, y]);
//console.log(publicKey.toString('hex'));

hash160 = ripemd160(sha256(publicKey.toString('hex')).toString()).toString();

console.log(hash160);

let temp = '00'+hash160+sha256(sha256('00' + hash160).toString()).toString().substring(0, 8);
console.log(temp);
let bytes = Buffer.from(temp, 'hex');
console.log(bytes);
address = b58.encode(bytes);
console.log(address);