let stack =[];

let s ="12 3 * 34 +";

class RPNCalc {
	constructor(){
		this.stack = [];
		stack.push(0);
	}

	add(s){
		let tab = s.split(" ");
		let a, b;
		while (tab.length > 0) {
			let symbol = tab.shift();
			switch(symbol){
				case '*':
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push(a*b);
					break;
				case '/':
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push(a/b);
					break;
				case '+':
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push(a+b);
					break;
				case '-':
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push(a-b);
					break;
				case '>':
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push((a > b) ? true:false);
					break;
				case '<':
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push((a < b) ? false:false);
					break;
				case '=':
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push((a === b) ? true:false);
					break;
				default:
					this.stack.push(parseInt(symbol));
					break;
			}
		}
	}

	pop(){
		return this.stack[this.stack.length - 1];
	}

	flush() {
		while (this.stack.length > 1)
			this.stack.pop();
		this.stack.push(0);
	}
}

let calc = new RPNCalc();
calc.add("12 3 * 36 =");
console.log(calc.pop());