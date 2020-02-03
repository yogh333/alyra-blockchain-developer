function HashCode(string) {
    var hash = 0, i = 0, len = string.length;
    while ( i < len ) {
//        hash  = ((hash << 5) - hash + string.codePointAt(i++)) << 0;
	        hash += string.codePointAt(i++);
    }
    return hash % 8;
};

class server {
	constructor(town, ip){
		this.town = town;
		this.ip = ip;
	}
}

class serverNode {
	constructor(server){
		this.server = server;
		this.next = undefined;
	}
}

class HashTable {
	constructor(){
		this.table = [];
		this.size = 8;
	}
	add(server){
		let key = HashCode(server.town);
		if ((this.table[key]) === undefined)
			this.table[key] = new serverNode(server);
		else {
			let s = this.table[key];
			while (s.next !== undefined)
				s = s.next;
			let node = new serverNode(server);
			s.next = node;
		}
	}

	find(town){
		let key = HashCode(town);
		let serverNode = this.table[key];
		let ipList = [];
		while (serverNode !== undefined){
			if (serverNode.server.town === town){
				ipList.push(serverNode.server.ip);
			}
			serverNode = serverNode.next;	
		}
		return ipList;
	}

	toString(){
		for (let i = 0; i < this.size; i++){
			let s = this.table[i];
			console.log("Key = " + i + "=> ");
			while (s !== undefined){
				console.log("Town: "+s.server.town+" IP: "+s.server.ip+" ");
				s = s.next;
			}
			/*if (s !== undefined)
				console.log(s.server.ip);*/
		}
	}
}



let Servers = [
	new server("Amsterdam","153.8.223.72"),
	new server("Chennai", "169.38.84.49"),
	new server("Dallas", "169.46.49.112"),
	new server("Dallas TX USA", "184.173.213.155"),
	new server("Frankfurt", "159.122.100.41"),
	new server("Hong Kong", "119.81.134.212"),
	new server("London", "5.10.5.200"),
	new server("London", "158.176.81.249"),
	new server("Melbourne", "168.1.168.251"),
	new server("Mexico City", "169.57.7.230"),
	new server("Milan", "159.122.142.111"),
	new server("Paris", "159.8.78.42"),
	new server("San Jose", "192.155.217.197"),
	new server("Sao Paulo", "169.57.163.228"),
	new server("Toronto","169.56.184.72"),
	new server("Washington DC", "50.87.60.166")];

let table = new HashTable();
for (let i in Servers)
	table.add(Servers[i]);
//table.toString();
console.log("London "+table.find("London"));
console.log("Paris "+table.find("Paris"));
console.log("Annecy "+table.find("Annecy"));