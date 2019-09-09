/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const testFolder = './';

const fileToFolder = process.argv[2];

if (!fileToFolder) {
  console.log('Need to pass the file to folder as an argument.');
  process.exit(1);
}

const parentDir = path.dirname(fileToFolder);

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

console.log('testing');