const ipfsClient = require('ipfs-http-client')

// connect to ipfs daemon API server
const ipfs = ipfsClient('http://localhost:5001') // (the default in Node.js)


function between(min, max) {  
	return Math.floor(Math.random() * (max - min) + min);
}

async function getMyID() {
	return await ipfs.id();
}
getMyID().then(id => console.log("My Peer ID = " + id.id));

async function pingPeer(peerID){
	for await (const res of ipfs.ping(peerID)) {
		if (res.time) {
			console.log(`Pong received: time=${res.time} ms`)
		} else {
			console.log(res.text)
		}
	}
}

ipfs.swarm.addrs().then(peerInfos => {
	pingPeer(peerInfos[between(0, peerInfos.length)].id);
});

const chunks = []
async function getString(ipfsPath) {
	for await (const chunk of ipfs.cat(ipfsPath)) {
		chunks.push(chunk)
	}
	console.log(Buffer.concat(chunks).toString())	
}

getString("QmfEP7Kjpt6MCQtYYuWiEnKcShv9Zx1frSZLNhxYH4PAjW");
