#!/usr/bin/env node

const program = require('commander');
const { readdirSync } = require('fs');


function getDirSubDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter((entity) => entity.isDirectory())
    .map((dir) => dir.name);
}

function getDirFiles(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter((entity) => entity.isFile())
    .map((file) => file.name);
}

program
  .version('0.0.1')
  .description('File Folderer')
  .arguments('[files...]')
  .option('-d, --directory <directoryPath>', 'Directory to process')
  .action((files) => {
    const processDir = program.directory || './';
    console.log('dir:');
    console.log(processDir);

    if (files) {
      console.log('argument files:');
      console.log(files);
    }

    const subDirs = getDirSubDirectories(processDir);
    console.log('Subdirectories:');
    console.log(subDirs);

    const dirFiles = getDirFiles(processDir);
    console.log('Dir Files:');
    console.log(dirFiles);
  })
  .parse(process.argv);

// Very useful looking article, includes commander
// https://blog.developer.atlassian.com/scripting-with-node/

// TODO: take a directory by default. take an optional file name/list for specific files to process
// if no files are specified processes all files in the folder.

// Maybe if no directory is specified do the current directory?
// Add  dry run option
// Maybe stop for confirmation by default unless a -y flag is given (could use inquirer for asking)
