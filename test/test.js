var fs = require('fs');

var p12 = fs.readFileSync('../scripts/certs/apiclient_cert.p12');

console.log(p12);

