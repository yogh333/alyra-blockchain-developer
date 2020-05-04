const ipfsClient = require('ipfs-http-client')

// connect to ipfs daemon API server
const ipfs = ipfsClient('http://localhost:5001') // (the default in Node.js)

ipfs.version().then(version => {
	console.log(version);
})

ipfs.id().then(id => {
	console.log("My Peer ID = " + id.id);
	document.getElementById("myPeerID").innerHTML = id.id;
})

ipfs.swarm.peers().then(peerInfos => {
	let list = "<ol>";
	for (let i = 0; i < peerInfos.length && i < 10; i++){
		console.log(peerInfos[i].peer);
		list += "<li>" + peerInfos[i].peer + "</li>";
	}
	list += "<ol>";
	document.getElementById("peerID-list").innerHTML = list;
})

async function ping(){

	let peerID = document.getElementById("peerid").value;

	console.log("Ping " + peerID);

	let pong = "";
	for await (let res of ipfs.ping(peerID)) {
		if ((res.success === true) && (res.text.length === 0)) {
			console.log(`Pong received: time=${res.time} ms`);
			document.getElementById("pong").innerHTML = `Pong received: time=${res.time} ms`;
		}
	}
}

global.pingPeer = function () {
	ping();
}

async function add(text){
	for await (let res of ipfs.add(text)) {
		console.log(res);
		return "CID = " + res.cid;
	};
}

global.addString = function () {
	var text = document.getElementById("datastring").value;
	add(text).then(s => {
		document.getElementById("CID").innerHTML = s;
	});
}

async function cat(cid){

	let chunks = [];
	for await (const chunk of ipfs.cat(cid)) {
			chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString();
}

global.catString = function () {
	var cid = document.getElementById("cidstring").value;
	cat(cid).then(s => {
		document.getElementById("cidcontent").innerHTML = s; 
	})
}