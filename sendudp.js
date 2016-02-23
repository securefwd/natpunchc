var exec = require('child_process').exec;
var raw = require ("raw-socket");
var udp = require('udp-packet');
var UdpHeader = require('udp-header');
var IpHeader = require('ip-header');

//var srcip = '172.18.0.2';
//var srcport = '1194';
//var destip = '151.80.177.19';
//var destport = '9999';
//var data = new Buffer('');

//sendudp(srcip, srcport, destip, destport, data);


function sendudp(srcip, srcport, destip, destport, data) {
/*	var buffer = udp.encode({
		sourceIp: srcip,
  		sourcePort: srcport,
		destinationIp: destip,
        	destinationPort: destport,
		data: Buffer(data)
	});
*/
	var udppacket = {sourceIp: '',
                sourcePort: '',
                destinationIp: '',
                destinationPort: '',
                data: ''
	};
	udppacket.sourceIP = srcip;
	udppacket.sourcePort = srcport;
	udppacket.destinationIp = destip;
	udppacket.destinationPort = destport;
	udppacket.data = data;
	
	var buffer = udp.encode(udppacket);

	//Let's create the CORRECT checksum
	var offset = 0;
   	var udpph = new UdpHeader(buffer, offset);
    	var ipdetails = { dst: '', src: '' };
	ipdetails.dst = destip;
	ipdetails.src = srcip;
	//var iph = new IpHeader({dst:'151.80.177.19', src:'172.18.0.2'});
	var iph = new IpHeader(ipdetails);
    	udpph.setChecksum(iph, buffer, offset + udpph.length);
    	var out = udpph.toBuffer()
	bufferCRC = new Buffer(out.toString('hex'), 'hex');

	var options = {
    		addressFamily: raw.AddressFamily.IPv4,
    		protocol: raw.Protocol.UDP,
    		bufferSize: 4096,
    		generateChecksums: false,
    		checksumOffset: 0
	};

	var rawsocket = raw.createSocket (options);
	rawsocket.send (bufferCRC, 0, bufferCRC.length, destip, function (error, bytes) {
        	if (error)
               	console.log (error.toString ());
		rawsocket.close();
        });
	console.log('UDP Sent');
	return;
}

module.exports.sendudp = sendudp;
