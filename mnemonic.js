const path = require('path');
const fs = require('fs');

const filePath = path.resolve(__dirname,'private','mnemonic');
const source = fs.readFileSync(filePath,'utf8');

module.exports = source;