var io = require('socket.io-client');
var dgram = require('dgram');
var exec = require('child_process').exec;
var sendudp = require('./sendudp');
var network = require('network');
var fs = require('fs');

var serverUrl = 'http://151.80.177.19:3000';
var socket = io.connect(serverUrl);

var srcport = '1194';
//var destip = '151.80.177.19';
var data = new Buffer(''); //Don't change this phrase for natpunch to work.
var config = fs.readFileSync('/persistant/natpunchc/config.json', 'utf8');

network.get_private_ip(function(err, ip){
	if (err) {
		console.log(err);
	}else {
		var srcip = ip;
		console.log('myIP: ' + srcip);

		console.log('Starting socket.io client...');
		socket.on('connect', function () {
		    console.log("socket connected");
		    //socket.emit('register', { email: 'blue@securefwd.io', api: 'abc', port: '12345' });
		    socket.emit('register', config);
		});

		socket.on('udpfire', function(msg){
		    	console.log('udpfire: ' + msg.port);
			sendudp.sendudp(srcip, srcport, msg.ip, msg.port, data);
		});

		setInterval(function() {
		    socket.emit('keepalive', '');
		}, 2000);
	}
});






