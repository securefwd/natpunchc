var io = require('socket.io-client');
var dgram = require('dgram');
var exec = require('child_process').exec;
var sendudp = require('./sendudp');

var serverUrl = 'http://151.80.177.19:3000';
var socket = io.connect(serverUrl);

var srcip = '172.18.0.2';
var srcport = '1194';
var destip = '151.80.177.19';
var data = new Buffer(''); //Don't change this phrase for natpunch to work.

console.log('Starting socket.io client...');
socket.on('connect', function () {
    console.log("socket connected");
    socket.emit('register', { name: 'blue', email: 'blue@securefwd.io', api: 'abc', port: '12345' });
});

socket.on('udpfire', function(msg){
    	console.log('udpfire: ' + msg.port);
	sendudp.sendudp(srcip, srcport, destip, msg.port, data);
});

setInterval(function() {
    socket.emit('keepalive', '');
}, 2000);


