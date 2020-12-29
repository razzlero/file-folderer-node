# File Folderer Node

This is an evolution of my previous [file-folderer](https://github.com/razzlero/file-folderer) project. the aim of both projects is to give a convenient way of sorting files into folders based on the file names.

This version of file folderer has no UI of it's own, but is instead intended to be used from the windows "Send to" context menu item.

- [File Folderer Node](#file-folderer-node)
  - [Installation](#installation)
    - [1 - Easiest way](#1---easiest-way)
    - [2 - Easy: Better way](#2---easy-better-way)
    - [3 - Advanced: Building folderer.exe yourself](#3---advanced-building-foldererexe-yourself)
    - [4- Advanced: Use folderer.js without building](#4--advanced-use-foldererjs-without-building)
  - [Usage](#usage)
    - [What happens](#what-happens)
    - [Usage Notes](#usage-notes)

## Installation

First download the latest version of `folderer.exe from` the releases page and then follow one of the first 2 methods below.

If you are afraid of downloading an exe file you can follow method 3 or 4 instead which require [nodejs](https://nodejs.org/en/download/) to be installed on your system.

### 1 - Easiest way

- Move `folderer.exe` into `C:\Users\<yourusername>\AppData\Roaming\Microsoft\Windows\SendTo`

It's that simple, but the context menu item will say "folderer.exe", and that folder is not really intended to store applications. So I recommend the following better approach.

### 2 - Easy: Better way

- Move `folderer.exe` to any location where you don't expect it to move. (I personally use `C:\tools\folderer\folderer.exe` for example).
- Create a shortcut to `folderer.exe` named `folderer` and place that shortcut inside `C:\Users\<yourusername>\AppData\Roaming\Microsoft\Windows\SendTo`.

### 3 - Advanced: Building folderer.exe yourself

- Install [nodejs](https://nodejs.org/en/download/) if you have not already installed it
- Download/clone this repository
- run this command: `npm run build`
- Then follow either method 1 or 2 with the folderer.exe that was crated

### 4- Advanced: Use folderer.js without building

- Install [nodejs](https://nodejs.org/en/download/) if you have not already installed it
- Download `folderer.js` from the releases page (or from the repo).
- Move `folderer.js` to any location where you don't expect it to move. (For example `C:\tools\folderer\folderer.js`).
- Create a shortcut to nodejs.
- Modify the shortcut target to pass the location of folderer.js as a parameter. (For example the target might look like `"C:\Program Files\nodejs\node.exe" "C:\tools\folderer\folderer.js"`)
- Rename the shortcut to "folderer"
- Place that shortcut inside `C:\Users\<yourusername>\AppData\Roaming\Microsoft\Windows\SendTo`.
## Usage


Once you install the application you can use it in the following way.

- Select a file or files in the windows file explorer and right click to bring up the context menu.
- In the context menu select `Send to` > `folderer` (or` folderer.exe`)

### What happens

Folderer will try to send the selected files to a folder using the following steps:
- First it tries to place the files into an existing folder in the same directory. If the names of all the selected files contain the name of an existing folder the files will be moved into that folder.
  - If multiple folders match then the folder with the longest name will be used.
- If there is no existing matching directory then it tries to create a new directory by finding common text that exists in names of all the selected files.
  - In this case if only 1 is file selected nothing will happen.

### Usage Notes
- All the selected files will be placed into the same folder. The app doesn't support sorting files into multiple different folders currently (but it is something I would like to add in future).
