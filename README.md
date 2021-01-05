# File Folderer Node

This is an evolution of my previous [file-folderer](https://github.com/razzlero/file-folderer) project. the aim of both projects is to give a convenient way of sorting files into folders based on the file names.

This version of file folderer has no UI of it's own, but is instead intended to be used from the windows "Send to" context menu item.

- [File Folderer Node](#file-folderer-node)
  - [Installation](#installation)
    - [Optional: Config Parameters](#optional-config-parameters)
    - [Optional: Building folderer.exe yourself](#optional-building-foldererexe-yourself)
  - [Usage](#usage)
    - [What happens](#what-happens)
    - [Usage Notes](#usage-notes)

## Installation

- Download the latest version of `folderer.exe from` the releases page. (If you are cautious of downloading an exe file you can follow the instructions in the section below to build it yourself)
- Move `folderer.exe` to any location where you don't expect it to move. (I personally use `C:\tools\folderer\folderer.exe` for example).
- Create a shortcut to `folderer.exe` named `Folderer` and place that shortcut inside `C:\Users\<yourusername>\AppData\Roaming\Microsoft\Windows\SendTo`.

### Optional: Config Parameters

You can add parameters to the shortcut created above to set additional config. For example you could modify the shortcut to look like the following:
```
"C:\tools\folderer\folderer.exe" --no--tag --no-trailing-zero --no-trailing-dash
```

Here are the currently supported parameters you can add:
- `--no-tag`
  - Does not include square brackets and text between when generating folder names. (For example `[MyTag]fileName.txt` and would `[MyTag]fileName 2.txt` be placed in a new folder called `fileName` as opposed to `[MyTag]fileName`)
- `--no-trailing-zero`
  - Does not include trailing zeroes when generating folder names. (For example `fileName 001.txt` and would `fileName 002.txt` be placed in a new folder called `fileName` as opposed to `fileName 00`)
- `--no-trailing-dash`
  - Does not include trailing dashes when generating folder names. (For example `fileName - 1.txt` and would `fileName - 2.txt` be placed in a new folder called `fileName` as opposed to `fileName -`)
  - Note: This may be used with `--no-trailing-zero`. (For example `fileName - 01.txt` and would `fileName - 02.txt` be placed in a new folder called `fileName` as opposed to `fileName - 0`)

### Optional: Building folderer.exe yourself

- Install [nodejs](https://nodejs.org/en/download/) if you have not already installed it
- Download/clone this repository
- run this command: `npm run build`
- Then follow the installation instructions above.
## Usage


Once you install and configure the application you can use it in the following way.

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
