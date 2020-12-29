#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function main() {
  const filePaths = getArgFiles(process.argv);

  if (filePaths.length === 0) {
    throw new Error("No file paths provided")
  }

  const matchingDirName = findMatchingDirName(filePaths)
  if (matchingDirName !== null) {
    moveFiles(filePaths, matchingDirName)
  } else if (filePaths.length > 1) {
    const targetDirName = findCommonName(filePaths);
    if (!targetDirName) {
      throw new Error("Unable to determine common folder name.")
    }
    moveFiles(filePaths, targetDirName)
  } else {
    throw new Error("Unable to move file(s) to folder.");
  }
}

// Get the list of passed in file names from the args.
// Basically gets all args after the name of the current script.
function getArgFiles(args) {
  const scriptName = path.basename(__filename);
  let scriptFound = false;
  const filePaths = []
  for (let i = 0; i < args.length; i++) {
    const filePath = fixPath(args[i]);
    const fileName = path.basename(filePath);
    if (scriptFound) {
      filePaths.push(filePath);
    } else if (fileName === scriptName) {
      scriptFound = true;
    }
  }

  if (!scriptFound) {
    throw new Error("Script not found in arguments");
  }

  return filePaths;
}

// Makes sure that paths are in a standardized format which will be handled correctly.
function fixPath(inPath) {
  return path.normalize(inPath.split(path.sep).join(path.posix.sep));
}

// Given a list of files paths (assumed to be in the same directory) returns a folder in the same directory
// which the files could be moved to. If no suitable folder is found returns null.
function findMatchingDirName(filePaths) {
  // First check if the file names match any directory
  const fileNames = getFileNames(filePaths);
  const dirPath =  path.dirname(filePaths[0]);
  const subDirNames = getSubDirNames(dirPath);
  // Sort subDirNames length, from longest to shortest
  subDirNames.sort((a, b) => (b.length - a.length));

  let matchDir = null;
  for (let i = 0; i < subDirNames.length && matchDir === null; i++) {
    const subDirName = subDirNames[i];
    const allMatch = fileNames.every((fileName) => (fileName.includes(subDirName)));
    if (allMatch) {
      matchDir = subDirName;
    }
  }
  return matchDir;
}

// Returns a list of all folders in the given directory.
function getSubDirNames(sourceDir) {
  return fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((entity) => entity.isDirectory())
    .map((dir) => dir.name);
}

// Given a list of fle paths returns a list of file names (with no file extension)
function getFileNames(filePaths) {
  return filePaths.map((filePath) => (
    path.parse(filePath).name
  ))
}

// Given a list of files moves them into the folder with the given name.
function moveFiles(filePaths, subDirName) {
  const dirPath =  path.dirname(filePaths[0]);
  const targetDir = path.join(dirPath, subDirName);
  if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir);
  }
  filePaths.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const targetPath = path.join(targetDir, fileName);
    fs.renameSync(filePath, targetPath);
  })
}

// Finds a common name between files to use as their folder name
function findCommonName(filePaths) {
  const fileNames = getFileNames(filePaths);
  // Sort from smallest name to biggest because the longest substring can't be longer than the smallest name
  fileNames.sort((a, b) => (a.length - b.length));
  const smallestName = fileNames.shift()
  // TODO: Decide on a minimum size, or make it configurable
  let commonName = null
  for (let i = smallestName.length; !commonName && i > 0; i-- ) {
    const subs = getSubStrings(smallestName, i);
    commonName = subs.find((sub) => (allIncludes(fileNames, sub)));
  }
  if (commonName) {
    commonName = commonName.trim()
  }
  return commonName;
}

// Gets all substrings of a given size in a string
function getSubStrings(str, size) {
  const subs = [];
  for (let i = 0; i + size <= str.length; i++) {
    const sub = str.substring(i, i + size)
    subs.push(sub);
  }
  return subs;
}

function allIncludes(stringList, targetStr) {
  return stringList.every((str) => (str.includes(targetStr)))
}

main();
