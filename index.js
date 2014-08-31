// Collaborative Launchpad Demo
// (c) TJ Horner 2014
// See LICENSE for license details

var launchpadReady = false;

// lol stackoverflow
var getKeyByValue = function(obj, value){
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop)){
			if(obj[prop] === value)
				return prop;
		}
	}
}

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
try{
	var midi = require('midi-launchpad').connect(parseInt(process.env.LAUNCHPAD_IN), parseInt(process.env.LAUNCHPAD_OUT), false);
}catch(e){
	var errors = ['Could not connect to Launchpad'];
}
var io = require('socket.io')(http);

var colors = {
	red: 3,
	green: 48,
	orange: 23,
	yellow: 34
};

var banned = [
	"208.185.19.18"
];

app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.use(express.static(__dirname + '/public'));

http.listen(3000);
io.on('connection', function(socket){
	if(!launchpadReady)
		socket.emit('socket:error', {error: 'Launchpad not ready! Try again later.', extra: errors});
});

try{
	midi.on("ready", function(launchpad){
		launchpadReady = true;

		toggleButton = function(button, json){
			try{
				if(button.getState() === 0){
					button.light(colors[json.color]);
					io.emit('launchpad:on', json, {for: 'everyone'});
				}else{
					button.dark();
					io.emit('launchpad:off', json, {for: 'everyone'});
				}
			}catch(e){ console.error(e); }
		};

		launchpad.clear();
		launchpad.on("press", function(e){
			var button = launchpad.getButton(e.x, e.y);
			var buttonJSON = {x: e.x, y: e.y, color: 'green'};
			toggleButton(button, buttonJSON);
		});

		io.on('connection', function(socket){
			if(banned.indexOf(socket.request.connection.remoteAddress) !== -1){
				socket.emit('socket:error', {error: 'You have been banned, disconnecting.', extra: errors});
				socket.disconnect();
			}

			var lastCommandCooldown = false;
			for(var x = 0; x < 9; x++) {
				for(var y = 0; y < 9; y++) {
					var button = launchpad.getButton(x, y);
					var buttonColor = getKeyByValue(colors, button.getState()) || colors.red;
					var buttonJSON = {x: x, y: y, color: buttonColor};
					if(button.getState() === 0){
						socket.emit('launchpad:off', buttonJSON);
					}else{
						socket.emit('launchpad:on', buttonJSON);
					}
				}
			}

			socket.on('launchpad:toggle', function(coords){
				if(!lastCommandCooldown){
					lastCommandCooldown = true;
					setTimeout(function(){
						lastCommandCooldown = false;
					}, 100);
					coords = JSON.parse(coords);
					var button = launchpad.getButton(coords.x, coords.y);
					if(!colors[coords.color]){
						color = 'red';
					}else{
						color = coords.color;
					}
					var buttonJSON = {x: coords.x, y: coords.y, color: color};
					toggleButton(button, buttonJSON);
				}else{
					console.log(socket.request.connection.remoteAddress);
				}
			});
		});
	});
}catch(e){
	console.error(e);
}