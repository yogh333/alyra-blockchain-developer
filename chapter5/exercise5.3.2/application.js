const ipfs = window.IpfsHttpClient('localhost', '5001');

ipfs.version().then(version => {
	console.log(version);
})

ipfs.id().then(id => {
	document.getElementById("myPeerID").innerHTML = id.id;
})

ipfs.swarm.peers().then(peerInfos => {
	let list = "<ol>";
	for (let i = 0; i < peerInfos.length && i < 10; i++){
		console.log(peerInfos[i].peer._idB58String);
		list += "<li>" + peerInfos[i].peer._idB58String + "</li>";
	}
	list += "<ol>";
	document.getElementById("peerID-list").innerHTML = list;
})

async function ping(){

	var peerID = document.getElementById("peerid").value;

	//for await (const res of ipfs.ping(peerID)) {
	ipfs.ping(peerID).then(res => {
    		console.log(res[2].text);
    		document.getElementById("pong").innerHTML = res[2].text;
	});
}

