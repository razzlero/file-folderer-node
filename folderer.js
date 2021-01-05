#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapping of arguments to option names
const argOptions = {
  '--no-tag': 'noTag',
  '--no-trailing-zero': 'noTrailingZero',
  '--no-trailing-dash': 'noTrailingDash',
};

const defaultOptions = {
  noTag: false,
  noTrailingZero: false,
  noTrailingDash: false,
};

function main() {
  const scriptArgs = getScriptArgs(process.argv);
  const { options, filePaths } = parseScriptArgs(scriptArgs);

  if (filePaths.length === 0) {
    throw new Error('No file paths provided');
  }

  const fileNames = getFileNames(filePaths);
  const dirPath = path.dirname(filePaths[0]);

  const matchingDirName = findMatchingDirName(fileNames, dirPath);
  if (matchingDirName !== null) {
    moveFiles(filePaths, matchingDirName);
  } else if (filePaths.length > 1) {
    const targetDirName = findCommonName(fileNames);
    if (!targetDirName) {
      throw new Error('Unable to determine common folder name.');
    }
    const formattedDirName = formatDirName(targetDirName, options);
    moveFiles(filePaths, formattedDirName);
  } else {
    throw new Error('Unable to move file(s) to folder.');
  }
}

// Gets all args which appear after the script call
function getScriptArgs(allArgs) {
  const scriptName = path.basename(__filename);
  let scriptFound = false;
  const scriptArgs = [];
  for (let i = 0; i < allArgs.length; i++) {
    const fixedArg = fixPath(allArgs[i]);
    if (scriptFound) {
      scriptArgs.push(fixedArg);
    } else {
      const fileName = path.basename(fixedArg);
      if (fileName === scriptName) {
        scriptFound = true;
      }
    }
  }

  if (!scriptFound) {
    throw new Error('Script not found in arguments');
  }

  return scriptArgs;
}

// Makes sure that paths are in a standardized format which will be handled correctly.
function fixPath(inPath) {
  return path.normalize(inPath.split(path.sep).join(path.posix.sep));
}

// Given script args parses returns options and files.
// Any arg which starts with a `-` is considered an option, and others are considered files.
function parseScriptArgs(scriptArgs) {
  const options = { ...defaultOptions };
  const filePaths = [];
  scriptArgs.forEach((arg) => {
    if (arg.startsWith('-')) {
      const argLower = arg.toLowerCase();
      if (argOptions[argLower]) {
        const optionName = argOptions[argLower];
        options[optionName] = true;
      } else {
        throw new Error(`Unrecognized option "${arg}"`);
      }
    } else {
      filePaths.push(arg);
    }
  });
  return { options, filePaths };
}

// Given a list of fle paths returns a list of file names (with no file extension)
function getFileNames(filePaths) {
  return filePaths.map((filePath) => (
    path.parse(filePath).name
  ));
}

// Given a list of files paths (assumed to be in the same directory) returns a folder in the same
// directory which the files could be moved to. If no suitable folder is found returns null.
function findMatchingDirName(fileNames, dirPath) {
  // First check if the file names match any directory
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

// Given a list of files moves them into the folder with the given name.
function moveFiles(filePaths, subDirName) {
  const dirPath = path.dirname(filePaths[0]);
  const targetDir = path.join(dirPath, subDirName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  filePaths.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const targetPath = path.join(targetDir, fileName);
    fs.renameSync(filePath, targetPath);
  });
}

// Finds a common name between files to use as their folder name
function findCommonName(fileNames) {
  // Sort from smallest name to biggest because the longest substring can't be longer than the
  // smallest name
  fileNames.sort((a, b) => (a.length - b.length));
  const smallestName = fileNames.shift();
  // TODO: Decide on a minimum size, or make it configurable
  let commonName = null;
  for (let i = smallestName.length; !commonName && i > 0; i--) {
    const subs = getSubStrings(smallestName, i);
    commonName = subs.find((sub) => (allIncludes(fileNames, sub)));
  }
  if (commonName) {
    commonName = commonName.trim();
  }
  return commonName;
}

// Gets all substrings of a given size in a string
function getSubStrings(str, size) {
  const subs = [];
  for (let i = 0; i + size <= str.length; i++) {
    const sub = str.substring(i, i + size);
    subs.push(sub);
  }
  return subs;
}

function allIncludes(stringList, targetStr) {
  return stringList.every((str) => (str.includes(targetStr)));
}

// returns the dir name formatted based on the passed in options
function formatDirName(dirName, options) {
  let formattedDirName = dirName;
  if (options.noTag) {
    // Remove square bracket [tags] from the filename
    formattedDirName = formattedDirName.replace(/(\[.*?\])/g, '');
  }

  if (options.noTrailingZero && options.noTrailingDash) {
    formattedDirName = formattedDirName.replace(/([ ]*[-0])*$/g, '');
  } else if (options.noTrailingZero) {
    formattedDirName = formattedDirName.replace(/([ ]*[0])*$/g, '');
  } else if (options.noTrailingDash) {
    formattedDirName = formattedDirName.replace(/([ ]*[-])*$/g, '');
  }

  return formattedDirName;
}

main();
