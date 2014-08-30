var midi = require('midi');
var input = new midi.input();
var output = new midi.output();

console.log('------- INPUT PORTS -------');
for(var i=0; i < input.getPortCount(); i++){
	console.log("Port " + i + ": " +input.getPortName(i));
}

console.log('------- OUTPUT PORTS -------');
for(var i=0; i < output.getPortCount(); i++){
	console.log("Port " + i + ": " + output.getPortName(i));
}

process.exit();