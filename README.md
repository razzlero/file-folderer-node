# File Folderer Node

This is an evolution of my previous [file-folderer](https://github.com/razzlero/file-folderer) project. the aim of both projects is to give a convenient way of sorting files into folders based on the file names.

This version of file folderer has no UI of it's own, but is instead intended to be used from the windows "Send to" context menu item.

- [File Folderer Node](#file-folderer-node)
  - [Installation](#installation)
    - [Easiest way](#easiest-way)
    - [Better way](#better-way)
  - [Usage](#usage)
    - [How to](#how-to)
    - [What happens](#what-happens)
    - [Usage Notes](#usage-notes)

## Installation

First download the latest version of folderer.exe from the releases page and then follow one of the 2 methods below.

### Easiest way

- Move `folderer.exe` into `C:\Users\<yourusername>\AppData\Roaming\Microsoft\Windows\SendTo`

It's that simple, but the context menu item will say "folderer.exe", and that menu is not really intended to store applications. So I recommend the following better approach.

### Better way

- Move `folderer.exe` to any location where you don't expect it to move. (I personally use `C:\tools\folderer` for example).
- Create a shortcut to `folderer.exe` named `folderer` and place that shortcut inside `C:\Users\<yourusername>\AppData\Roaming\Microsoft\Windows\SendTo`.

## Usage

### How to

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
