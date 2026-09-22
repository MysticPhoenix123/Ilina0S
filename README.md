# IlinaOS

A browser-based personal WebOS with draggable apps, productivity tools, persistent storage, and a built-in coding environment.

<img width="1278" height="585" alt="image" src="https://github.com/user-attachments/assets/17c27a04-bd60-4734-8a87-500dca4a593b" />


## Try It

Link: https://mysticphoenix123.github.io/Ilina0S/

## Quick Start

No installation is needed to try IlinaOS.

1. Open the live demo.
2. Click any desktop icon to launch an app.
3. Drag, resize, minimize, maximize, and close windows just like a desktop operating system.

## Features

- 🖥️ **Desktop-style interface** with a custom animated wallpaper, top bar, live clock, app icons, and movable windows.
- 🔴🟡🟢 **Window controls** for closing, minimizing, maximizing, restoring, dragging, resizing, and bringing apps to the front.
- ✨ **SparkLog** for creating, saving, reopening, and deleting personal notes.
- 📋 **TaskList** with task creation, completion tracking, filters, deletion, and persistent storage.
- 🧮 **Calculator** for basic arithmetic inside its own resizable desktop window.
- 📁 **Projects** for browsing content created inside IlinaOS.
- 💻 **Ilina Code Studio**, a browser-based mini IDE with a file explorer, folders, editor tabs, context menus, terminal, code execution, and live web previews.

## Ilina Code Studio

Ilina Code Studio is the most advanced app inside IlinaOS.

It includes:

- A VS Code-inspired file explorer
- Multiple files and folders
- New file and new folder creation
- Rename and delete
- Cut, copy, and paste
- Copy path and relative path
- Editor tabs
- Syntax highlighting with Monaco Editor
- HTML, CSS, and JavaScript support
- Python execution through Pyodide
- Built-in terminal commands
- Live HTML/CSS/JavaScript previews
- File importing from local folders
- Optional Auto Save
- Persistent browser storage

The coding workspace begins with a small starter project containing `index.html`, `style.css`, and `script.js`, so there is something ready to experiment with immediately.

## How It Works

IlinaOS is built entirely as a client-side web application using HTML, CSS, and JavaScript.

Each app is represented by its own window. JavaScript manages window stacking, dragging, resizing, minimizing, maximizing, opening, and closing. A shared z-index system keeps the active window in front, while reusable window functions allow the different apps to behave consistently.

SparkLog, TaskList, and Ilina Code Studio use localStorage, which means their data can remain available in the browser even after the page is refreshed.

Ilina Code Studio uses Monaco Editor, the editor technology behind VS Code, for syntax highlighting and code editing. Its virtual file system is managed in JavaScript and stored inside the browser rather than directly modifying files on the user's computer.

For Python, IlinaOS uses Pyodide, which runs Python through WebAssembly directly in the browser. HTML, CSS, and JavaScript projects can be rendered inside the Code Studio preview without requiring a separate backend server.

One of the biggest challenges was making Code Studio behave like a small desktop IDE while still keeping the whole project browser-based.

# I hope you enjoy using it. I will continue updating this project and adding new features so stay tuned!
