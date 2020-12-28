#!/usr/bin/env node

const { readdirSync } = require('fs');
const path = require('path');

// TODO: make this script so that it will work from the sendto menu
// Just need to add a shortcut in sendto to call the script
// when calling the first argv item will be node, then this script, then the full path to all the files selected
// Probably don't need to bother with commander

// The args contain this script, anything which called this script, and the file paths passed as parameters.
// So first we want to get only those file paths
const filePaths = getArgFiles(process.argv);

if (filePaths.length === 0) {
  throw new Error("No file paths provided")
}

const dirPath =  path.dirname(filePaths[0]);
console.log(dirPath)
const subDirs = getSubDirs(dirPath)

console.log(subDirs)


function getArgFiles(args) {
  const scriptName = path.basename(__filename);
  let scriptFound = false
  const filePaths = []
  for (let i = 0; i < args.length; i++) {
    const filePath = fixPath(args[i]);
    const fileName = path.basename(filePath);
    if (scriptFound) {
      filePaths.push(filePath)
    } else if (fileName === scriptName) {
      scriptFound = true
    }
  }

  if (!scriptFound) {
    throw new Error("Script not found in arguments")
  }

  return filePaths
}

// Makes sure that paths are in a standardized format which will be handled correctly.
function fixPath(inPath) {
  return path.normalize(inPath.split(path.sep).join(path.posix.sep))
}

function getSubDirs(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter((entity) => entity.isDirectory())
    .map((dir) => dir.name);
}
