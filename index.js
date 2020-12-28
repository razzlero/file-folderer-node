#!/usr/bin/env node

const { readdirSync } = require('fs');
const path = require('path');

// TODO: make this script so that it will work from the sendto menu
// Just need to add a shortcut in sendto to call the script
// when calling the first argv item will be node, then this script, then the full path to all the files selected
// Probably don't need to bother with commander

function main() {
  // The args contain this script, anything which called this script, and the file paths passed as parameters.
  // So first we want to get only those file paths
  const filePaths = getArgFiles(process.argv);

  if (filePaths.length === 0) {
    throw new Error("No file paths provided")
  }

  const matchingDirName = findMatchingDirName(filePaths)
  if (matchingDirName !== null) {
    // TODO: move files into that folder
  } else if (filePaths.length > 1) {
    // TODO: Find longest common string, make folder with that name, move files into it
  } else {
    throw new Error("Unable to move file(s) to folder.")
  }
}

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

function findMatchingDirName(filePaths) {
  // First check if the file names match any directory
  const fileNames = getFileNames(filePaths)
  const dirPath =  path.dirname(filePaths[0]);
  const subDirNames = getSubDirNames(dirPath)
  // Sort subDirNames length, from longest to shortest
  subDirNames.sort((a, b) => (b.length - a.length));

  let matchDir = null
  for (let i = 0; i < subDirNames.length && matchDir === null; i++) {
    const subDirName = subDirNames[i];
    const allMatch = fileNames.every((fileName) => (fileName.includes(subDirName)))
    if (allMatch) {
      matchDir = subDirName
    }
  }
  return matchDir
}

function getSubDirNames(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter((entity) => entity.isDirectory())
    .map((dir) => dir.name);
}

function getFileNames(filePaths) {
  return filePaths.map((filePath) => (
    path.basename(filePath)
  ))
}

main();
