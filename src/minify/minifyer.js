
const fs = require("fs");
const querystring = require('querystring');
const https = require('https');

const minjs = (i, o) => min(i, o, 1)
const mincss = (i, o) => min(i, o, 0)
function min(inputfile, outputfile, isjs) {
    fs.readFile(inputfile, (err, buff) => {
        const path =isjs? '/developers/javascript-minifier/api/raw':'/developers/cssminifier/api/raw'
        const req = https.request({
            method: 'POST',
            hostname: 'www.toptal.com',
            path,
        }, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk.toString());
            response.on('end', () => {
                data = data.replaceAll(/\s\s\s\s/g, '').replaceAll('//!SECTION', '').replaceAll(/\t/g, '').replaceAll(/\n/g, '').replaceAll('//!STUB', '')
                fs.appendFile(outputfile, data, function (err) { });
            });
        })
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.end(querystring.stringify({ input: buff.toString() }), 'utf8');
    })
}

minjs('./src/Shery.js', './src/minify/Shery-min.js')
mincss('./src/Shery.css', './src/minify/Shery-min.css')