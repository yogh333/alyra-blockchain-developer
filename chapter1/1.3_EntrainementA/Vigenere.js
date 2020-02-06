const utf16_A = "A".charCodeAt(0);
const utf16_Z = "Z".charCodeAt(0);
const utf16_a = "a".charCodeAt(0);
const utf16_z = "z".charCodeAt(0);

function cipherVigenere(data, keyword){
	let out = "";
	let pos = 0;
	for (let i = 0; i < data.length; i++){
		let utf16_l = data.charCodeAt(i);

		if ( ((utf16_l >= utf16_A) && (utf16_l <= utf16_Z)) ||
			  ((utf16_l >= utf16_a) && (utf16_l <= utf16_z)) ) {

			/* Make assumption keyword is only capital letter */
			let key = keyword.charCodeAt(pos) - utf16_A;
			//console.log(data[i], " ", keyword[pos], " ", key);
			pos = (pos + 1) % keyword.length;

			if (utf16_l <= utf16_Z)
				utf16_l = utf16_A + (utf16_l - utf16_A + key) % 26;
			else
				utf16_l = utf16_a + (utf16_l - utf16_a + key) % 26;
		}
		out += String.fromCharCode(utf16_l);
			
			
	}
	return out;
}

function decipherVigenere(data, keyword){
	let out = "";
	let pos = 0;
	for (let i = 0; i < data.length; i++){
		let utf16_l = data.charCodeAt(i);

		if ( ((utf16_l >= utf16_A) && (utf16_l <= utf16_Z)) ||
			  ((utf16_l >= utf16_a) && (utf16_l <= utf16_z)) ) {

			/* Make assumption keyword is only capital letter */
			let key = keyword.charCodeAt(pos) - utf16_A;
			//console.log(data[i], " ", keyword[pos], " ", key);
			pos = (pos + 1) % keyword.length;

			if (utf16_l <= utf16_Z)
				utf16_l = utf16_A + (utf16_l - utf16_A + (26 - key)) % 26;
			else
				utf16_l = utf16_a + (utf16_l - utf16_a + (26 - key)) % 26;
		}
		out += String.fromCharCode(utf16_l);
			
			
	}
	return out;
}

function cluster(text, n){
	let tab = [];

	for (let i = 0 ; i < n ; i++){
		let cluster = "";
		for (let j = 0; j < text.length - i; j += n){
			cluster += text[i + j];
		}
		tab.push(cluster);
	}
	return tab;
}

function freqAnalysis(text){

	let histogram = [];
	for (let l = 0; l < text.length; l++){

		let symbol = text[l];

		let idx = 0;
		let pair = histogram[idx++];
		while (pair !== undefined){
			if (pair[0] === symbol)
				break;
			else 
				pair = histogram[idx++];
		}
		if (pair !== undefined)
			pair[1] += 1;
		else {
			pair = [symbol, 1];
			histogram.push(pair);
		}
	}
	return histogram;
}

//let text = "VOI  CIU  NME  SSA  GE";
//let ciphered = cipherVigenere(text, "ABC");
//let deciphered = decipherVigenere(ciphered, "ABC");
//text = "MES VIEILLES TANTES";
text = 
	"PVADGHFLSHPJNPLUVAGXVVRBRUKCGXEVQINPVBXLVZLRMKFLSXEZQXOGCCHXEICIXUKSCXKEDDKORRXHPHSXGGJRRHPESTJWVBTJWVJFNGJSCLQ" +
	"LBJGUVSATNRJXFKKCBTKJOJXEVJJBQLATNZHSXECUCIBGELTGVGCJOGERPMQLRBHOVLIKGMCAXTCCHXEICIXUKYRVGJQXUNVYIHWJATLVSGTGRFSGJ" +
	"WFGXEARSCITFZAXOVBJLGTPTMEVOJBHRGIITFZAXOVBPGUCCHXEICIVGJRFNKCNTNVVRGXFZTJEILCIKCYGGXXVJTHGUGEXHZLXMRRPSXEYGUYTVPA" +
	"XPZEBXFLQEAKEVHBXFSHOQLJTSRVPRXTCCHLGTPTMUTCHMNRRPVJVBTECIYXLQECCNPJCCLEVQIECKYRAGUCATRYGAHUFNWBGRSRHPKPPBTVJTF" +
	"AJRTKGVQIICIBTYKEGIBQEBJGCLRGXQIBGXSLCAXRIMQEGDCXEGJRXGCTATLUZZAXCCYGTKJMCWCEQAXUDWHMGICHWGCYCMKHSXMGJCJEUUCGT" +
	"TVQXGKKGTLRRPKBGELTGVRJPVQDNGXJVLHBQEBJFAJRTKGVRAXEYPXLVZYCBUDCTLVSCPNEFSEINLQGTFZAPEGEADKGCCBRUKCGXGJRRXSLGTLVR" +
	"ZHHNLKTGVZLPVEVQHBDCCPECIYXLQERWHORQSTSLGCEGGJJLIIYCWVYCDEQXGTGFVRDNVVJPVJICIBGERTFGUGTOCCCTMNRPTYGICCVGVLRHTVYJ" +
	"CQLPSAWZBTMQLRTECKFTHNFEXXEYPTMKVLCXKEQXLVVQJKNVDPBVHSTECIYIBQEYABVVQPKTVRTTWJCJBNUSBRUKCGXNVKNLVVPTXUKQPVTVQX" +
	"OQLQEKGWCGXBZJTLVKPPGUTCCWCERXEGJRSBXZLPEQIQFNGCCHXEICIXUKNGHHRLTEGJCRKGKCHMKDKPGGERPECTMCWKKGDGJLKPBPVGAXUK" +
	"FJFCZLTMEVQIIQLPFNQZDXWGCCPLCMMRTVZMCECGPDUNVKPMKJYIBQEJPKGWJTQKFLEAKCMHHRYGFNGZLIXTIMVXNVQTVTVRXGVVPGHIVJWNOR" +
	"LXMGUSHXEICILKTCITKKSCFAJRTKGVJAXPVJXGVVPGHIVPPBVGYHEGDWHMGICCXUKNPLWECRTVVEDKKVNWBNFQDIJZOJX";

let pool = cluster(text.split(" ").join(""), 5);
console.log(pool);
console.log("---------------------------------");
for (let p = 0; p < pool.length; p++){
	let histo = freqAnalysis(pool[p]);
	for (let i = 0; i < histo.length; i++){
		let out = histo[i][0] + ": ";
		for (let j = 0; j < histo[i][1]; j++)
			out += "#";
		console.log(out);
	}
	console.log("---------------------------------");
}
let deciphered = decipherVigenere(text, "CRYPT");
console.log(deciphered);
