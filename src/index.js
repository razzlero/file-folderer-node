/* eslint-disable no-console */
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version('0.0.1')
  .description('File Folderer')
  .option('-f, --file <fileName>', 'File to process')
  .option('-d, --directory <directoryPath>', 'Directory to process');

// Very useful looking article, includes commander
// https://blog.developer.atlassian.com/scripting-with-node/

// TODO: take a directory by default. take an optional file name/list for specific files to process
// if no files are specified processes all files in the folder.

// Maybe if no directory is specified do the current directory?
// Add  dry run option
// Maybe stop for confirmaiton by default unless a -y flag is given (coudl ue inquirer for asking)

//program
//  .command('file <fileToFolder>')
//  .alias('f')
//  .description('Move a file into a subfolder with the closest matching name.')
//  .action((fileToFolder) => {  
//	const parentDir = path.dirname(fileToFolder);
//	console.log(parentDir);
//    //TODO
//	console.log("TODO");
//  });

program.parse(process.argv);

console.log(program.opts())

if (program.file) {
  console.log('Process single file');
  console.log("TODO");
}


const testFolder = './';
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

console.log('testing');