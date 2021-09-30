/**
 * Postinstall script to modify Slickgrid related stuff.
 * 
 */

const COLOR = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',

	fgBlack: '\x1b[30m',
	fgRed: '\x1b[31m',
	fgGreen: '\x1b[32m',
	fgYellow: '\x1b[33m',
	fgBlue: '\x1b[34m',
	fgMagenta: '\x1b[35m',
	fgCyan: '\x1b[36m',
	fgWhite: '\x1b[37m',

	bgBlack: '\x1b[40m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgMagenta: '\x1b[45m',
	bgCyan: '\x1b[46m',
	bgWhite: '\x1b[47m',
};

console.log(`${COLOR.bright + COLOR.fgRed}Post Install script...${COLOR.reset}`);

const multipleSelectFolder = 'node_modules/multiple-select-modified/src';
const sguDistEsmFiltersFolder = 'node_modules/@slickgrid-universal/common/dist/esm/filters'
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = require('stream');

const searchStream = (filename, text) => {

    return new Promise((resolve) => {
        const inStream = fs.createReadStream(filename);
        const outStream = new stream;
        const rl = readline.createInterface(inStream, outStream);
        const result = [];
        const regEx = new RegExp(text, "i")
        rl.on('line', function (line) {
            if (line && line.search(regEx) >= 0) {
                result.push(line)
            }
        });
        rl.on('close', function () {
            console.log('finished search', filename)
            resolve(result)
        });
    })
}

fs.readdir(multipleSelectFolder, (err, files) => {
    console.log(`${COLOR.fgYellow}Copying files...${COLOR.reset}`);
	files.forEach((file) => {
		console.log(file);
        let orig = path.join(`${multipleSelectFolder}`, file);
        let dest = path.join(`${sguDistEsmFiltersFolder}`, file);
        fs.copyFileSync(orig, dest);
	});
    console.log(`${COLOR.fgYellow}...to ${COLOR.bright + COLOR.fgYellow}${sguDistEsmFiltersFolder} ${COLOR.reset}`);
    const filterIndexJS = path.join(`${sguDistEsmFiltersFolder}`, 'index.js');
    console.log(`${COLOR.fgYellow}...updating ${COLOR.bright + COLOR.fgYellow}${filterIndexJS} ${COLOR.reset}`);
    searchStream(filterIndexJS, 'multiple-select.js').then(value => {
        console.log('Search result', value);
        if(value.length === 0) {
            fs.appendFileSync(filterIndexJS, `\nexport * from './multiple-select.js'`);      
        }
    });
});
