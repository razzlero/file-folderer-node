#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { setgroups } = require('process');


function main() {
  // The args contain this script, anything which called this script, and the file paths passed as parameters.
  // So first we want to get only those file paths
  const filePaths = getArgFiles(process.argv);

  if (filePaths.length === 0) {
    throw new Error("No file paths provided")
  }

  const matchingDirName = findMatchingDirName(filePaths)
  if (matchingDirName !== null) {
    moveFiles(filePaths, matchingDirName)
  } else if (filePaths.length > 1) {
    const fileNames = getFileNames(filePaths);
    const targetDirName = findLongestCommonString(fileNames);
    if (!targetDirName) {
      throw new Error("Unable to determine common folder name.")
    }
    moveFiles(filePaths, targetDirName)
  } else {
    throw new Error("Unable to move file(s) to folder.");
  }
}

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

function findMatchingDirName(filePaths) {
  // First check if the file names match any directory
  const fileNames = getFileBaseNames(filePaths);
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

function getSubDirNames(source) {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter((entity) => entity.isDirectory())
    .map((dir) => dir.name);
}

function getFileBaseNames(filePaths) {
  return filePaths.map((filePath) => (
    path.basename(filePath)
  ))
}

function getFileNames(filePaths) {
  return filePaths.map((filePath) => (
    path.parse(filePath).name
  ))
}

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

function findLongestCommonString(fileNames) {
  // Sort from smallest name to biggest because the longest substring can't be longer than the smallest name
  fileNames.sort((a, b) => (a.length - b.length));
  // TODO
  // could take a pretty naive approach of getting every substring of the first file name and checking if they exist in all other filenames
  // It will have bad performance, but I don't think it will matter,and  in exchange it will keep this script more readable.
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
