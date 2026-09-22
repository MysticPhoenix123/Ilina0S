function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function updateTime() {
    const time = $("#timeElement");
    if (time) time.textContent = new Date().toLocaleString();
}

updateTime();
setInterval(updateTime, 1000);

let biggestIndex = 10;
let selectedIcon = null;

function bringToFront(element) {
    if (!element) return;
    biggestIndex++;
    element.style.zIndex = biggestIndex;
}

function getAppIconForWindow(element) {

    if (!element) return null;

    const iconMap = {
        coding: "#codingIcon",
        sparklog: "#sparkLogIcon",
        calculator: "#calculatorIcon",
        projects: "#projectsIcon",
        todo: "#todoIcon"
    };

    const selector =
        iconMap[element.id];

    return selector
        ? document.querySelector(selector)
        : null;
}


function openWindow(element) {

    if (!element) return;

    element.style.display =
        "block";

    const icon =
        getAppIconForWindow(
            element
        );

    if (icon) {

        icon.classList.remove(
            "appMinimized"
        );
    }

    element.dataset.minimized =
        "false";

    bringToFront(
        element
    );
}


function closeWindow(element) {

    if (!element) return;

    element.style.display =
        "none";

    const icon =
        getAppIconForWindow(
            element
        );

    if (icon) {

        icon.classList.remove(
            "appMinimized"
        );
    }

    element.dataset.minimized =
        "false";
}

function selectIcon(element) {
    if (selectedIcon && selectedIcon !== element) {
        selectedIcon.classList.remove("selected");
    }

    if (element) {
        element.classList.add("selected");
    }

    selectedIcon = element || null;
}

function deselectIcon(element) {
    if (element) {
        element.classList.remove("selected");
    }

    if (selectedIcon === element) {
        selectedIcon = null;
    }
}

function freezeWindowPosition(element) {
    const rect = element.getBoundingClientRect();

    element.style.left = rect.left + "px";
    element.style.top = rect.top + "px";
    element.style.width = rect.width + "px";
    element.style.height = rect.height + "px";
    element.style.transform = "none";
}

function addWindowTapHandling(element) {
    if (!element) return;

    element.addEventListener(
        "mousedown",
        function () {
            bringToFront(element);
        }
    );
}

function dragElement(element) {
    if (!element) return;

    const header =
        document.getElementById(
            element.id + "header"
        );

    if (!header) return;

    header.addEventListener(
        "mousedown",
        function (event) {

            if (
                event.button !== 0 ||
                event.target.closest(".closebutton")
            ) {
                return;
            }

            event.preventDefault();

            bringToFront(element);
            freezeWindowPosition(element);

            let lastX =
                event.clientX;

            let lastY =
                event.clientY;

            function move(moveEvent) {

                const rect =
                    element.getBoundingClientRect();

                const dx =
                    moveEvent.clientX -
                    lastX;

                const dy =
                    moveEvent.clientY -
                    lastY;

                lastX =
                    moveEvent.clientX;

                lastY =
                    moveEvent.clientY;

                const left =
                    Math.min(
                        Math.max(
                            rect.left + dx,
                            -element.offsetWidth + 100
                        ),
                        window.innerWidth - 100
                    );

                const top =
                    Math.max(
                        rect.top + dy,
                        55
                    );

                element.style.left =
                    left + "px";

                element.style.top =
                    top + "px";
            }

            function stop() {

                document.removeEventListener(
                    "mousemove",
                    move
                );

                document.removeEventListener(
                    "mouseup",
                    stop
                );
            }

            document.addEventListener(
                "mousemove",
                move
            );

            document.addEventListener(
                "mouseup",
                stop
            );
        }
    );
}

function makeResizable(
    element,
    minWidth = 300,
    minHeight = 220
) {

    if (!element) return;

    [
        "n",
        "s",
        "e",
        "w",
        "ne",
        "nw",
        "se",
        "sw"
    ].forEach(
        function (direction) {

            const handle =
                document.createElement(
                    "div"
                );

            handle.className =
                "resize-handle resize-" +
                direction;

            element.appendChild(
                handle
            );

            handle.addEventListener(
                "mousedown",
                function (event) {

                    if (
                        event.button !== 0
                    ) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();

                    bringToFront(element);
                    freezeWindowPosition(element);

                    const start =
                        element.getBoundingClientRect();

                    const startX =
                        event.clientX;

                    const startY =
                        event.clientY;

                    function resize(moveEvent) {

                        const dx =
                            moveEvent.clientX -
                            startX;

                        const dy =
                            moveEvent.clientY -
                            startY;

                        let left =
                            start.left;

                        let top =
                            start.top;

                        let width =
                            start.width;

                        let height =
                            start.height;

                        if (
                            direction.includes("e")
                        ) {
                            width =
                                start.width +
                                dx;
                        }

                        if (
                            direction.includes("s")
                        ) {
                            height =
                                start.height +
                                dy;
                        }

                        if (
                            direction.includes("w")
                        ) {

                            width =
                                start.width -
                                dx;

                            left =
                                start.left +
                                dx;
                        }

                        if (
                            direction.includes("n")
                        ) {

                            height =
                                start.height -
                                dy;

                            top =
                                start.top +
                                dy;
                        }

                        if (
                            width <
                            minWidth
                        ) {

                            if (
                                direction.includes("w")
                            ) {
                                left =
                                    start.right -
                                    minWidth;
                            }

                            width =
                                minWidth;
                        }

                        if (
                            height <
                            minHeight
                        ) {

                            if (
                                direction.includes("n")
                            ) {
                                top =
                                    start.bottom -
                                    minHeight;
                            }

                            height =
                                minHeight;
                        }

                        if (
                            top < 55 &&
                            direction.includes("n")
                        ) {

                            height +=
                                top - 55;

                            top =
                                55;
                        }

                        element.style.left =
                            left + "px";

                        element.style.top =
                            top + "px";

                        element.style.width =
                            Math.min(
                                width,
                                window.innerWidth -
                                Math.max(
                                    left,
                                    0
                                ) -
                                8
                            ) +
                            "px";

                        element.style.height =
                            Math.min(
                                height,
                                window.innerHeight -
                                Math.max(
                                    top,
                                    55
                                ) -
                                8
                            ) +
                            "px";
                    }

                    function stopResize() {

                        document.removeEventListener(
                            "mousemove",
                            resize
                        );

                        document.removeEventListener(
                            "mouseup",
                            stopResize
                        );
                    }

                    document.addEventListener(
                        "mousemove",
                        resize
                    );

                    document.addEventListener(
                        "mouseup",
                        stopResize
                    );
                }
            );
        }
    );
}

const welcomeScreen =
    $("#welcome");

dragElement(
    welcomeScreen
);

makeResizable(
    welcomeScreen
);

addWindowTapHandling(
    welcomeScreen
);

$("#welcomeclose")
    .addEventListener(
        "click",
        function () {

            closeWindow(
                welcomeScreen
            );
        }
    );

$("#welcomeopen")
    .addEventListener(
        "click",
        function () {

            openWindow(
                welcomeScreen
            );
        }
    );

const sparkLogScreen =
    $("#sparklog");

const sparkLogIcon =
    $("#sparkLogIcon");

const noteTitle =
    $("#noteTitle");

const noteBody =
    $("#noteBody");

const saveStatus =
    $("#saveStatus");

const notesList =
    $("#notesList");

let notes = [];

let currentNoteId =
    null;

try {

    notes =
        JSON.parse(
            localStorage.getItem(
                "ilinaOS.sparklog.notes"
            )
        ) || [];

} catch (error) {

    notes =
        [];
}

function storeNotes() {

    localStorage.setItem(
        "ilinaOS.sparklog.notes",
        JSON.stringify(
            notes
        )
    );
}

function createNewNote() {

    currentNoteId =
        null;

    noteTitle.value =
        "";

    noteBody.value =
        "";

    saveStatus.textContent =
        "New unsaved note";

    noteTitle.focus();

    renderNotesList();
}

function saveCurrentNote() {

    let title =
        noteTitle.value.trim();

    const body =
        noteBody.value.trim();

    if (
        !title &&
        !body
    ) {

        saveStatus.textContent =
            "Write something before saving.";

        return;
    }

    if (!title) {
        title =
            "Untitled Note";
    }

    const now =
        new Date()
            .toISOString();

    if (currentNoteId) {

        const existing =
            notes.find(
                function (note) {

                    return (
                        note.id ===
                        currentNoteId
                    );
                }
            );

        if (existing) {

            existing.title =
                title;

            existing.body =
                body;

            existing.updatedAt =
                now;
        }

    } else {

        const note = {

            id:
                Date.now()
                    .toString(),

            title:
                title,

            body:
                body,

            createdAt:
                now,

            updatedAt:
                now
        };

        notes.unshift(
            note
        );

        currentNoteId =
            note.id;
    }

    storeNotes();

    renderNotesList();

    renderProjects();

    saveStatus.textContent =
        "Saved ✓";
}

function loadNote(id) {

    const note =
        notes.find(
            function (item) {

                return (
                    item.id ===
                    id
                );
            }
        );

    if (!note) return;

    currentNoteId =
        note.id;

    noteTitle.value =
        note.title;

    noteBody.value =
        note.body;

    saveStatus.textContent =
        "Last saved: " +
        new Date(
            note.updatedAt
        ).toLocaleString();

    renderNotesList();
}

function deleteCurrentNote() {

    if (!currentNoteId) {

        createNewNote();

        return;
    }

    if (
        !window.confirm(
            "Delete this SparkLog note?"
        )
    ) {
        return;
    }

    notes =
        notes.filter(
            function (note) {

                return (
                    note.id !==
                    currentNoteId
                );
            }
        );

    storeNotes();

    createNewNote();

    renderProjects();
}

function renderNotesList() {

    notesList.innerHTML =
        "";

    if (!notes.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-message";

        empty.textContent =
            "No saved notes yet.";

        notesList.appendChild(
            empty
        );

        return;
    }

    notes.forEach(
        function (note) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "note-list-item";

            if (
                note.id ===
                currentNoteId
            ) {

                item.classList.add(
                    "active-list-item"
                );
            }

            const title =
                document.createElement(
                    "div"
                );

            title.textContent =
                note.title;

            title.style.fontWeight =
                "bold";

            const date =
                document.createElement(
                    "div"
                );

            date.className =
                "small-muted";

            date.textContent =
                new Date(
                    note.updatedAt
                ).toLocaleDateString();

            item.appendChild(
                title
            );

            item.appendChild(
                date
            );

            item.addEventListener(
                "click",
                function () {

                    loadNote(
                        note.id
                    );
                }
            );

            notesList.appendChild(
                item
            );
        }
    );
}

function openSparkLog(icon) {

    selectIcon(
        icon
    );

    openWindow(
        sparkLogScreen
    );

    renderNotesList();
}

window.openSparkLog =
    openSparkLog;

dragElement(
    sparkLogScreen
);

makeResizable(
    sparkLogScreen
);

addWindowTapHandling(
    sparkLogScreen
);

$("#newNoteButton")
    .addEventListener(
        "click",
        createNewNote
    );

$("#saveNoteButton")
    .addEventListener(
        "click",
        saveCurrentNote
    );

$("#deleteNoteButton")
    .addEventListener(
        "click",
        deleteCurrentNote
    );

$("#sparklogclose")
    .addEventListener(
        "click",
        function () {

            closeWindow(
                sparkLogScreen
            );

            deselectIcon(
                sparkLogIcon
            );
        }
    );

renderNotesList();

const calculatorScreen =
    $("#calculator");

const calculatorIcon =
    $("#calculatorIcon");

const calculatorDisplay =
    $("#calculatorDisplay");

let calculatorCurrent =
    "0";

let calculatorStored =
    null;

let calculatorOperation =
    null;

let calculatorResetNext =
    false;

function updateCalculatorDisplay() {

    calculatorDisplay.textContent =
        calculatorCurrent;
}

function calculate(
    a,
    b,
    operation
) {

    if (
        operation ===
        "add"
    ) {
        return a + b;
    }

    if (
        operation ===
        "subtract"
    ) {
        return a - b;
    }

    if (
        operation ===
        "multiply"
    ) {
        return a * b;
    }

    if (
        operation ===
        "divide"
    ) {
        return (
            b === 0
                ? NaN
                : a / b
        );
    }

    return b;
}

function chooseOperation(
    operation
) {

    const currentNumber =
        Number(
            calculatorCurrent
        );

    if (
        calculatorStored !== null &&
        calculatorOperation &&
        !calculatorResetNext
    ) {

        const result =
            calculate(
                calculatorStored,
                currentNumber,
                calculatorOperation
            );

        calculatorCurrent =
            Number.isFinite(
                result
            )
                ? String(result)
                : "Error";

        calculatorStored =
            Number.isFinite(
                result
            )
                ? result
                : null;

    } else {

        calculatorStored =
            currentNumber;
    }

    calculatorOperation =
        operation;

    calculatorResetNext =
        true;

    updateCalculatorDisplay();
}

function runEquals() {

    if (
        calculatorStored === null ||
        !calculatorOperation
    ) {
        return;
    }

    const result =
        calculate(
            calculatorStored,
            Number(
                calculatorCurrent
            ),
            calculatorOperation
        );

    calculatorCurrent =
        Number.isFinite(
            result
        )
            ? String(result)
            : "Error";

    calculatorStored =
        null;

    calculatorOperation =
        null;

    calculatorResetNext =
        true;

    updateCalculatorDisplay();
}

function openCalculator(icon) {

    selectIcon(
        icon
    );

    openWindow(
        calculatorScreen
    );
}

window.openCalculator =
    openCalculator;

dragElement(
    calculatorScreen
);

makeResizable(
    calculatorScreen,
    280,
    380
);

addWindowTapHandling(
    calculatorScreen
);

$("#calculatorclose")
    .addEventListener(
        "click",
        function () {

            closeWindow(
                calculatorScreen
            );

            deselectIcon(
                calculatorIcon
            );
        }
    );

$$(
    ".calculatorButtons button"
).forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const number =
                    button.dataset.number;

                const operation =
                    button.dataset.operation;

                const action =
                    button.dataset.action;

                if (
                    number !==
                    undefined
                ) {

                    if (
                        calculatorCurrent ===
                            "Error" ||
                        calculatorResetNext
                    ) {

                        calculatorCurrent =
                            number;

                        calculatorResetNext =
                            false;

                    } else {

                        calculatorCurrent =
                            calculatorCurrent ===
                                "0"
                                ? number
                                : calculatorCurrent +
                                  number;
                    }

                    updateCalculatorDisplay();

                    return;
                }

                if (operation) {

                    chooseOperation(
                        operation
                    );

                    return;
                }

                if (
                    action ===
                    "clear"
                ) {

                    calculatorCurrent =
                        "0";

                    calculatorStored =
                        null;

                    calculatorOperation =
                        null;

                    calculatorResetNext =
                        false;

                } else if (
                    action ===
                    "backspace"
                ) {

                    if (
                        calculatorCurrent !==
                        "Error"
                    ) {

                        calculatorCurrent =
                            calculatorCurrent.length >
                            1
                                ? calculatorCurrent.slice(
                                    0,
                                    -1
                                )
                                : "0";
                    }

                } else if (
                    action ===
                    "decimal"
                ) {

                    if (
                        calculatorResetNext ||
                        calculatorCurrent ===
                            "Error"
                    ) {

                        calculatorCurrent =
                            "0.";

                        calculatorResetNext =
                            false;

                    } else if (
                        !calculatorCurrent.includes(
                            "."
                        )
                    ) {

                        calculatorCurrent +=
                            ".";
                    }

                } else if (
                    action ===
                    "equals"
                ) {

                    runEquals();

                    return;
                }

                updateCalculatorDisplay();
            }
        );
    }
);

const codingScreen =
    $("#coding");

const codingIcon =
    $("#codingIcon");

const codeFilesList =
    $("#codeFilesList");

const editorTabs =
    $("#editorTabs");

const codeSaveStatus =
    $("#codeSaveStatus");

const codeCursorPosition =
    $("#codeCursorPosition");

const codeLanguage =
    $("#codeLanguage");

const projectHeading =
    $("#projectHeading");

const folderFallbackInput =
    $("#folderFallbackInput");

const fileDialog =
    $("#fileDialog");

const fileDialogTitle =
    $("#fileDialogTitle");

const fileDialogDescription =
    $("#fileDialogDescription");

const fileDialogInput =
    $("#fileDialogInput");

const fileDialogConfirm =
    $("#fileDialogConfirm");

const fileContextMenu =
    $("#fileContextMenu");

const folderContextMenu =
    $("#folderContextMenu");

document.body.appendChild(
    fileContextMenu
);

document.body.appendChild(
    folderContextMenu
);

const autoSaveCheckbox =
    $("#autoSaveCheckbox");

const terminalPanel =
    $("#terminalPanel");

const terminalOutput =
    $("#terminalOutput");

const terminalInput =
    $("#terminalInput");

const terminalPrompt =
    $("#terminalPrompt");

const previewPanel =
    $("#previewPanel");

const previewTitle =
    $("#previewTitle");

const codePreview =
    $("#codePreview");

const codeTerminal =
    $("#codeTerminal");

const monacoEditorElement =
    $("#monacoEditor");

const fallbackEditor =
    $("#codeEditor");

const WORKSPACE_KEY =
    "ilinaOS.codeStudio.workspace.v5";

let workspaceName =
    "ILINA PROJECT";

let workspaceEntries =
    [];

let codingFiles =
    [];

let currentCodeFileId =
    null;

let selectedFolderPath =
    "";

let openCodeTabIds =
    [];

let openFolderPaths =
    new Set([""]);

let fileDialogMode =
    "new-file";

let fileDialogTarget =
    null;

let contextTarget =
    null;

let internalClipboard =
    null;

let autoSaveEnabled =
    false;

let autoSaveTimer =
    null;

let terminalCwd =
    "";

let monacoEditorInstance =
    null;

let monacoReadyPromise =
    null;

let pyodideInstance =
    null;

let fallbackEditorListenerAdded =
    false;

const monacoModels =
    new Map();

localStorage.removeItem(
    "ilinaOS.coding.files"
);

function normalizePath(path) {

    const parts =
        [];

    String(
        path || ""
    )
        .replace(
            /\\/g,
            "/"
        )
        .split("/")
        .forEach(
            function (part) {

                if (
                    !part ||
                    part === "."
                ) {
                    return;
                }

                if (
                    part === ".."
                ) {

                    parts.pop();

                    return;
                }

                parts.push(
                    part
                );
            }
        );

    return parts.join(
        "/"
    );
}

function joinPath(
    base,
    name
) {

    return normalizePath(
        base
            ? base +
              "/" +
              name
            : name
    );
}

function getParentPath(path) {

    const normalized =
        normalizePath(
            path
        );

    const index =
        normalized.lastIndexOf(
            "/"
        );

    return (
        index === -1
            ? ""
            : normalized.slice(
                0,
                index
            )
    );
}

function getBaseName(path) {

    const normalized =
        normalizePath(
            path
        );

    const index =
        normalized.lastIndexOf(
            "/"
        );

    return (
        index === -1
            ? normalized
            : normalized.slice(
                index + 1
            )
    );
}

function createEntryId(
    type,
    path
) {

    return (
        type +
        ":" +
        normalizePath(
            path
        )
    );
}

function refreshCodingFiles() {

    codingFiles =
        workspaceEntries.filter(
            function (entry) {

                return (
                    entry.type ===
                    "file"
                );
            }
        );
}

function getEntryById(id) {

    return (
        workspaceEntries.find(
            function (entry) {

                return (
                    entry.id ===
                    id
                );
            }
        ) ||
        null
    );
}

function getEntryByPath(path) {

    const normalized =
        normalizePath(
            path
        );

    return (
        workspaceEntries.find(
            function (entry) {

                return (
                    entry.path ===
                    normalized
                );
            }
        ) ||
        null
    );
}

function getFolderEntry(path) {

    const normalized =
        normalizePath(
            path
        );

    if (!normalized) {

        return {

            id:
                "folder:",

            type:
                "folder",

            name:
                workspaceName,

            path:
                "",

            parentPath:
                "",

            isRoot:
                true
        };
    }

    return (
        workspaceEntries.find(
            function (entry) {

                return (
                    entry.type ===
                        "folder" &&
                    entry.path ===
                        normalized
                );
            }
        ) ||
        null
    );
}

function getFileLanguage(filename) {

    const lower =
        String(
            filename || ""
        )
            .toLowerCase();

    if (
        /\.html?$/.test(
            lower
        )
    ) {
        return "HTML";
    }

    if (
        lower.endsWith(
            ".css"
        )
    ) {
        return "CSS";
    }

    if (
        /\.(js|mjs|cjs)$/.test(
            lower
        )
    ) {
        return "JavaScript";
    }

    if (
        lower.endsWith(
            ".ts"
        )
    ) {
        return "TypeScript";
    }

    if (
        lower.endsWith(
            ".py"
        )
    ) {
        return "Python";
    }

    if (
        lower.endsWith(
            ".json"
        )
    ) {
        return "JSON";
    }

    if (
        lower.endsWith(
            ".md"
        )
    ) {
        return "Markdown";
    }

    if (
        lower.endsWith(
            ".java"
        )
    ) {
        return "Java";
    }

    if (
        lower.endsWith(
            ".c"
        )
    ) {
        return "C";
    }

    if (
        /\.(cpp|cc|cxx)$/.test(
            lower
        )
    ) {
        return "C++";
    }

    if (
        lower.endsWith(
            ".xml"
        )
    ) {
        return "XML";
    }

    if (
        /\.ya?ml$/.test(
            lower
        )
    ) {
        return "YAML";
    }

    if (
        lower.endsWith(
            ".sql"
        )
    ) {
        return "SQL";
    }

    return "Plain Text";
}

function getMonacoLanguage(filename) {

    const map = {

        HTML:
            "html",

        CSS:
            "css",

        JavaScript:
            "javascript",

        TypeScript:
            "typescript",

        Python:
            "python",

        JSON:
            "json",

        Markdown:
            "markdown",

        Java:
            "java",

        C:
            "c",

        "C++":
            "cpp",

        XML:
            "xml",

        YAML:
            "yaml",

        SQL:
            "sql",

        "Plain Text":
            "plaintext"
    };

    return (
        map[
            getFileLanguage(
                filename
            )
        ] ||
        "plaintext"
    );
}

function getFileIcon(filename) {

    const icons = {

        HTML:
            "🌐",

        CSS:
            "🎨",

        JavaScript:
            "🟨",

        TypeScript:
            "🔷",

        Python:
            "🐍",

        JSON:
            "⚙️",

        Markdown:
            "📝",

        Java:
            "☕",

        C:
            "📘",

        "C++":
            "📘",

        XML:
            "🧩",

        YAML:
            "🧾",

        SQL:
            "🗃️"
    };

    return (
        icons[
            getFileLanguage(
                filename
            )
        ] ||
        "📄"
    );
}

function isTextFile(filename) {

    const lower =
        String(
            filename || ""
        )
            .toLowerCase();

    const blocked = [

        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".ico",

        ".mp3",
        ".wav",
        ".ogg",

        ".mp4",
        ".mov",
        ".avi",
        ".webm",

        ".pdf",
        ".zip",
        ".rar",
        ".7z",

        ".exe",
        ".dll",
        ".bin",

        ".woff",
        ".woff2",
        ".ttf",
        ".otf"
    ];

    return (
        !blocked.some(
            function (extension) {

                return (
                    lower.endsWith(
                        extension
                    )
                );
            }
        )
    );
}

function saveWorkspaceSnapshot() {

    localStorage.setItem(
        WORKSPACE_KEY,
        JSON.stringify(
            {
                name:
                    workspaceName,

                entries:
                    workspaceEntries.map(
                        function (entry) {

                            return {

                                type:
                                    entry.type,

                                name:
                                    entry.name,

                                path:
                                    entry.path,

                                parentPath:
                                    entry.parentPath,

                                content:
                                    entry.type ===
                                        "file"
                                        ? entry.content ||
                                          ""
                                        : undefined
                            };
                        }
                    )
            }
        )
    );
}

function loadWorkspaceSnapshot() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    WORKSPACE_KEY
                )
            );

        if (
            !saved ||
            !Array.isArray(
                saved.entries
            )
        ) {
            return;
        }

        workspaceName =
            saved.name ||
            "ILINA PROJECT";

        workspaceEntries =
            saved.entries.map(
                function (entry) {

                    const path =
                        normalizePath(
                            entry.path ||
                            entry.name
                        );

                    return {

                        id:
                            createEntryId(
                                entry.type,
                                path
                            ),

                        type:
                            entry.type,

                        name:
                            entry.name ||
                            getBaseName(
                                path
                            ),

                        path:
                            path,

                        parentPath:
                            normalizePath(
                                entry.parentPath ||
                                getParentPath(
                                    path
                                )
                            ),

                        content:
                            entry.type ===
                                "file"
                                ? entry.content ||
                                  ""
                                : undefined,

                        dirty:
                            false
                    };
                }
            );

        refreshCodingFiles();

    } catch (error) {

        workspaceEntries =
            [];

        codingFiles =
            [];
    }
}

function createStarterWorkspace() {

    if (
        workspaceEntries.length >
        0
    ) {
        return;
    }

    workspaceName =
        "MY FIRST PROJECT";

    workspaceEntries = [

        {
            id:
                createEntryId(
                    "file",
                    "index.html"
                ),

            type:
                "file",

            name:
                "index.html",

            path:
                "index.html",

            parentPath:
                "",

            content:
`<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        My IlinaOS Project
    </title>

    <link
        rel="stylesheet"
        href="style.css"
    >

</head>

<body>

    <h1>
        Hello from Ilina Code Studio!
    </h1>

    <p>
        Start coding something amazing.
    </p>

    <button id="helloButton">
        Click Me!
    </button>

    <script src="script.js"><\/script>

</body>

</html>`,

            dirty:
                false
        },


        {
            id:
                createEntryId(
                    "file",
                    "style.css"
                ),

            type:
                "file",

            name:
                "style.css",

            path:
                "style.css",

            parentPath:
                "",

            content:
`body {
    margin: 0;
    padding: 40px;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    text-align: center;

    background:
        linear-gradient(
            135deg,
            #24104f,
            #642998,
            #b143a8
        );

    color: white;
}

h1 {
    font-size: 42px;
}

p {
    font-size: 18px;
}

button {
    padding: 12px 22px;

    border: none;

    border-radius: 10px;

    font-size: 15px;

    cursor: pointer;
}`,

            dirty:
                false
        },


        {
            id:
                createEntryId(
                    "file",
                    "script.js"
                ),

            type:
                "file",

            name:
                "script.js",

            path:
                "script.js",

            parentPath:
                "",

            content:
`console.log(
    "Hello from Ilina Code Studio!"
);

const helloButton =
    document.querySelector(
        "#helloButton"
    );

helloButton.addEventListener(
    "click",
    function () {

        alert(
            "Welcome to Ilina Code Studio!"
        );
    }
);`,

            dirty:
                false
        }

    ];

    refreshCodingFiles();

    saveWorkspaceSnapshot();
}

function hasUnsavedFiles() {

    return (
        codingFiles.some(
            function (file) {

                return (
                    file.dirty
                );
            }
        )
    );
}

function confirmWorkspaceSwitch() {

    if (
        !hasUnsavedFiles()
    ) {
        return true;
    }

    return window.confirm(
        "You have unsaved files. Open another folder anyway?"
    );
}

function resetWorkspaceUI() {

    currentCodeFileId =
        null;

    selectedFolderPath =
        "";

    openCodeTabIds =
        [];

    openFolderPaths =
        new Set([""]);

    terminalCwd =
        "";

    autoSaveEnabled =
        false;

    autoSaveCheckbox.checked =
        false;

    monacoModels.forEach(
        function (model) {

            try {

                model.dispose();

            } catch (error) {
            }
        }
    );

    monacoModels.clear();

    if (
        monacoEditorInstance
    ) {

        monacoEditorInstance.setModel(
            null
        );
    }

    fallbackEditor.value =
        "";

    renderTabs();

    updateTerminalPrompt();
}

async function importFolderFiles(
    fileList
) {

    const files =
        Array.from(
            fileList || []
        );

    if (
        !files.length
    ) {
        return;
    }

    if (
        !confirmWorkspaceSwitch()
    ) {

        folderFallbackInput.value =
            "";

        return;
    }

    const firstRelative =
        files[0]
            .webkitRelativePath ||
        files[0]
            .name;

    workspaceName =
        firstRelative.includes(
            "/"
        )
            ? firstRelative
                .split("/")[0]
            : "IMPORTED PROJECT";

    workspaceEntries =
        [];

    const folders =
        new Set();

    for (
        const file
        of files
    ) {

        if (
            !isTextFile(
                file.name
            )
        ) {
            continue;
        }

        const raw =
            file.webkitRelativePath ||
            file.name;

        const withoutRoot =
            raw.startsWith(
                workspaceName +
                "/"
            )
                ? raw.slice(
                    workspaceName.length +
                    1
                )
                : raw;

        const path =
            normalizePath(
                withoutRoot
            );

        const parentPath =
            getParentPath(
                path
            );

        let running =
            "";

        if (parentPath) {

            parentPath
                .split("/")
                .forEach(
                    function (part) {

                        running =
                            joinPath(
                                running,
                                part
                            );

                        folders.add(
                            running
                        );
                    }
                );
        }

        let content =
            "";

        try {

            content =
                await file.text();

        } catch (error) {

            content =
                "";
        }

        workspaceEntries.push(
            {
                id:
                    createEntryId(
                        "file",
                        path
                    ),

                type:
                    "file",

                name:
                    file.name,

                path:
                    path,

                parentPath:
                    parentPath,

                content:
                    content,

                dirty:
                    false
            }
        );
    }

    Array.from(
        folders
    )
        .sort(
            function (a, b) {

                return (
                    a.split("/")
                        .length -
                    b.split("/")
                        .length ||
                    a.localeCompare(
                        b
                    )
                );
            }
        )
        .forEach(
            function (path) {

                workspaceEntries.push(
                    {
                        id:
                            createEntryId(
                                "folder",
                                path
                            ),

                        type:
                            "folder",

                        name:
                            getBaseName(
                                path
                            ),

                        path:
                            path,

                        parentPath:
                            getParentPath(
                                path
                            ),

                        dirty:
                            false
                    }
                );
            }
        );

    refreshCodingFiles();

    resetWorkspaceUI();

    projectHeading.textContent =
        "▼ " +
        workspaceName.toUpperCase();

    codeSaveStatus.textContent =
        codingFiles.length
            ? "Folder imported"
            : "No code/text files found";

    saveWorkspaceSnapshot();

    renderCodeFiles();

    renderProjects();

    folderFallbackInput.value =
        "";
}

function getDirectChildren(
    parentPath
) {

    const normalized =
        normalizePath(
            parentPath
        );

    return (
        workspaceEntries
            .filter(
                function (entry) {

                    return (
                        entry.parentPath ===
                        normalized
                    );
                }
            )
            .sort(
                function (a, b) {

                    if (
                        a.type !==
                        b.type
                    ) {

                        return (
                            a.type ===
                                "folder"
                                ? -1
                                : 1
                        );
                    }

                    return (
                        a.name.localeCompare(
                            b.name,
                            undefined,
                            {
                                sensitivity:
                                    "base"
                            }
                        )
                    );
                }
            )
    );
}

function renderCodeFiles() {

    codeFilesList.innerHTML =
        "";

    if (
        !workspaceEntries.length
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-message";

        empty.style.padding =
            "12px";

        empty.textContent =
            "Open a folder or create a file.";

        codeFilesList.appendChild(
            empty
        );

        return;
    }

    function renderChildren(
        parentPath,
        depth
    ) {

        getDirectChildren(
            parentPath
        ).forEach(
            function (entry) {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "explorerItem";

                row.style.paddingLeft =
                    (
                        8 +
                        depth * 14
                    ) +
                    "px";

                if (
                    entry.id ===
                        currentCodeFileId ||
                    (
                        entry.type ===
                            "folder" &&
                        entry.path ===
                            selectedFolderPath
                    )
                ) {

                    row.classList.add(
                        "selectedExplorerItem"
                    );
                }

                if (
                    internalClipboard &&
                    internalClipboard.mode ===
                        "cut" &&
                    internalClipboard.sourcePath ===
                        entry.path
                ) {

                    row.style.opacity =
                        "0.45";
                }

                const icon =
                    document.createElement(
                        "span"
                    );

                icon.className =
                    "explorerItemIcon";

                icon.textContent =
                    entry.type ===
                        "folder"
                        ? (
                            openFolderPaths.has(
                                entry.path
                            )
                                ? "📂"
                                : "📁"
                        )
                        : getFileIcon(
                            entry.name
                        );

                const name =
                    document.createElement(
                        "span"
                    );

                name.className =
                    "explorerItemName";

                name.textContent =
                    entry.name;

                row.appendChild(
                    icon
                );

                row.appendChild(
                    name
                );

                row.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        hideContextMenus();

                        if (
                            entry.type ===
                            "folder"
                        ) {

                            selectedFolderPath =
                                entry.path;

                            if (
                                openFolderPaths.has(
                                    entry.path
                                )
                            ) {

                                openFolderPaths.delete(
                                    entry.path
                                );

                            } else {

                                openFolderPaths.add(
                                    entry.path
                                );
                            }

                            renderCodeFiles();

                        } else {

                            selectedFolderPath =
                                entry.parentPath;

                            openCodeFile(
                                entry.id
                            );
                        }
                    }
                );

                row.addEventListener(
                    "contextmenu",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        contextTarget =
                            entry;

                        selectedFolderPath =
                            entry.type ===
                                "folder"
                                ? entry.path
                                : entry.parentPath;

                        renderCodeFiles();

                        if (
                            entry.type ===
                            "folder"
                        ) {

                            showFolderContextMenu(
                                event.clientX,
                                event.clientY,
                                entry
                            );

                        } else {

                            showFileContextMenu(
                                event.clientX,
                                event.clientY,
                                entry
                            );
                        }
                    }
                );

                codeFilesList.appendChild(
                    row
                );

                if (
                    entry.type ===
                        "folder" &&
                    openFolderPaths.has(
                        entry.path
                    )
                ) {

                    renderChildren(
                        entry.path,
                        depth + 1
                    );
                }
            }
        );
    }

    renderChildren(
        "",
        0
    );
}

function showContextMenu(
    menu,
    x,
    y
) {

    hideContextMenus();

    menu.style.display =
        "block";

    menu.style.left =
        x + "px";

    menu.style.top =
        y + "px";

    requestAnimationFrame(
        function () {

            const rect =
                menu.getBoundingClientRect();

            if (
                rect.right >
                window.innerWidth -
                8
            ) {

                menu.style.left =
                    Math.max(
                        8,
                        window.innerWidth -
                        rect.width -
                        8
                    ) +
                    "px";
            }

            if (
                rect.bottom >
                window.innerHeight -
                8
            ) {

                menu.style.top =
                    Math.max(
                        8,
                        window.innerHeight -
                        rect.height -
                        8
                    ) +
                    "px";
            }
        }
    );
}

function showFileContextMenu(
    x,
    y,
    entry
) {

    contextTarget =
        entry;

    showContextMenu(
        fileContextMenu,
        x,
        y
    );
}

function showFolderContextMenu(
    x,
    y,
    entry
) {

    contextTarget =
        entry;

    autoSaveCheckbox.checked =
        autoSaveEnabled;

    folderContextMenu
        .querySelectorAll(
            '[data-action="rename"], [data-action="delete"]'
        )
        .forEach(
            function (button) {

                button.style.display =
                    entry &&
                    entry.isRoot
                        ? "none"
                        : "block";
            }
        );

    showContextMenu(
        folderContextMenu,
        x,
        y
    );
}

function hideContextMenus() {

    fileContextMenu.style.display =
        "none";

    folderContextMenu.style.display =
        "none";
}

function copyText(text) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(
                text
            )
            .catch(
                function () {
                }
            );

    } else {

        const box =
            document.createElement(
                "textarea"
            );

        box.value =
            text;

        box.style.position =
            "fixed";

        box.style.opacity =
            "0";

        document.body.appendChild(
            box
        );

        box.select();

        document.execCommand(
            "copy"
        );

        box.remove();
    }
}

function getDisplayPath(entry) {

    return (
        "/" +
        workspaceName +
        (
            entry &&
            entry.path
                ? "/" +
                  entry.path
                : ""
        )
    );
}

function openFileDialog(
    mode,
    target
) {

    fileDialogMode =
        mode;

    fileDialogTarget =
        target ||
        null;

    if (
        mode ===
        "new-file"
    ) {

        fileDialogTitle.textContent =
            "Create New File";

        fileDialogDescription.textContent =
            "Create the file inside " +
            getDisplayPath(
                getFolderEntry(
                    selectedFolderPath
                )
            ) +
            ".";

        fileDialogInput.placeholder =
            "example.py";

        fileDialogInput.value =
            "";

        fileDialogConfirm.textContent =
            "Create";

    } else if (
        mode ===
        "new-folder"
    ) {

        fileDialogTitle.textContent =
            "Create New Folder";

        fileDialogDescription.textContent =
            "Create the folder inside " +
            getDisplayPath(
                getFolderEntry(
                    selectedFolderPath
                )
            ) +
            ".";

        fileDialogInput.placeholder =
            "src";

        fileDialogInput.value =
            "";

        fileDialogConfirm.textContent =
            "Create";

    } else if (
        mode ===
        "rename"
    ) {

        if (!target) return;

        fileDialogTitle.textContent =
            target.type ===
                "folder"
                ? "Rename Folder"
                : "Rename File";

        fileDialogDescription.textContent =
            "Enter a new name.";

        fileDialogInput.placeholder =
            target.name;

        fileDialogInput.value =
            target.name;

        fileDialogConfirm.textContent =
            "Rename";
    }

    fileDialog.style.display =
        "flex";

    setTimeout(
        function () {

            fileDialogInput.focus();

            fileDialogInput.select();
        },
        0
    );
}

function closeFileDialog() {

    fileDialog.style.display =
        "none";

    fileDialogTarget =
        null;
}

function nameExists(
    name,
    folderPath,
    ignoredPath
) {

    const target =
        joinPath(
            folderPath,
            name
        )
            .toLowerCase();

    return (
        workspaceEntries.some(
            function (entry) {

                return (
                    entry.path
                        .toLowerCase() ===
                        target &&
                    entry.path !==
                        ignoredPath
                );
            }
        )
    );
}

async function createNewFile(
    name,
    folderPath
) {

    const cleanName =
        name.trim();

    if (
        !cleanName ||
        cleanName.includes("/") ||
        cleanName.includes("\\")
    ) {

        window.alert(
            "Enter a file name, not a path."
        );

        return;
    }

    if (
        nameExists(
            cleanName,
            folderPath
        )
    ) {

        window.alert(
            "A file or folder with that name already exists."
        );

        return;
    }

    const path =
        joinPath(
            folderPath,
            cleanName
        );

    const entry = {

        id:
            createEntryId(
                "file",
                path
            ),

        type:
            "file",

        name:
            cleanName,

        path:
            path,

        parentPath:
            normalizePath(
                folderPath
            ),

        content:
            "",

        dirty:
            false
    };

    workspaceEntries.push(
        entry
    );

    refreshCodingFiles();

    openFolderPaths.add(
        normalizePath(
            folderPath
        )
    );

    projectHeading.textContent =
        "▼ " +
        workspaceName.toUpperCase();

    saveWorkspaceSnapshot();

    renderCodeFiles();

    renderProjects();

    await openCodeFile(
        entry.id
    );
}

async function createNewFolder(
    name,
    folderPath
) {

    const cleanName =
        name.trim();

    if (
        !cleanName ||
        cleanName.includes("/") ||
        cleanName.includes("\\")
    ) {

        window.alert(
            "Enter a folder name, not a path."
        );

        return;
    }

    if (
        nameExists(
            cleanName,
            folderPath
        )
    ) {

        window.alert(
            "A file or folder with that name already exists."
        );

        return;
    }

    const path =
        joinPath(
            folderPath,
            cleanName
        );

    workspaceEntries.push(
        {
            id:
                createEntryId(
                    "folder",
                    path
                ),

            type:
                "folder",

            name:
                cleanName,

            path:
                path,

            parentPath:
                normalizePath(
                    folderPath
                ),

            dirty:
                false
        }
    );

    selectedFolderPath =
        path;

    openFolderPaths.add(
        normalizePath(
            folderPath
        )
    );

    openFolderPaths.add(
        path
    );

    projectHeading.textContent =
        "▼ " +
        workspaceName.toUpperCase();

    saveWorkspaceSnapshot();

    renderCodeFiles();

    renderProjects();
}

function cloneTree(
    sourceEntry,
    destinationFolderPath,
    destinationName
) {

    const oldRoot =
        sourceEntry.path;

    const newRoot =
        joinPath(
            destinationFolderPath,
            destinationName
        );

    const tree =
        workspaceEntries.filter(
            function (entry) {

                return (
                    entry.path ===
                        oldRoot ||
                    entry.path.startsWith(
                        oldRoot +
                        "/"
                    )
                );
            }
        );

    tree.forEach(
        function (entry) {

            const suffix =
                entry.path ===
                    oldRoot
                    ? ""
                    : entry.path.slice(
                        oldRoot.length +
                        1
                    );

            const newPath =
                suffix
                    ? joinPath(
                        newRoot,
                        suffix
                    )
                    : newRoot;

            workspaceEntries.push(
                {
                    id:
                        createEntryId(
                            entry.type,
                            newPath
                        ),

                    type:
                        entry.type,

                    name:
                        getBaseName(
                            newPath
                        ),

                    path:
                        newPath,

                    parentPath:
                        getParentPath(
                            newPath
                        ),

                    content:
                        entry.type ===
                            "file"
                            ? entry.content ||
                              ""
                            : undefined,

                    dirty:
                        false
                }
            );
        }
    );
}

function getUniqueCopyName(
    entry,
    destinationFolderPath
) {

    if (
        !nameExists(
            entry.name,
            destinationFolderPath
        )
    ) {
        return entry.name;
    }

    if (
        entry.type ===
        "folder"
    ) {

        let i =
            1;

        let candidate =
            entry.name +
            " copy";

        while (
            nameExists(
                candidate,
                destinationFolderPath
            )
        ) {

            i++;

            candidate =
                entry.name +
                " copy " +
                i;
        }

        return candidate;
    }

    const dot =
        entry.name.lastIndexOf(
            "."
        );

    const base =
        dot > 0
            ? entry.name.slice(
                0,
                dot
            )
            : entry.name;

    const extension =
        dot > 0
            ? entry.name.slice(
                dot
            )
            : "";

    let i =
        1;

    let candidate =
        base +
        " copy" +
        extension;

    while (
        nameExists(
            candidate,
            destinationFolderPath
        )
    ) {

        i++;

        candidate =
            base +
            " copy " +
            i +
            extension;
    }

    return candidate;
}

async function pasteClipboard(
    destinationFolderPath
) {

    if (
        !internalClipboard
    ) {

        codeSaveStatus.textContent =
            "Nothing to paste";

        return;
    }

    const source =
        getEntryByPath(
            internalClipboard.sourcePath
        );

    if (!source) {

        internalClipboard =
            null;

        codeSaveStatus.textContent =
            "Clipboard item no longer exists";

        renderCodeFiles();

        return;
    }

    const destination =
        normalizePath(
            destinationFolderPath
        );

    if (
        source.type ===
            "folder" &&
        (
            destination ===
                source.path ||
            destination.startsWith(
                source.path +
                "/"
            )
        )
    ) {

        window.alert(
            "A folder cannot be pasted inside itself."
        );

        return;
    }

    if (
        internalClipboard.mode ===
            "cut" &&
        destination ===
            source.parentPath
    ) {

        codeSaveStatus.textContent =
            "Item is already in this folder";

        internalClipboard =
            null;

        renderCodeFiles();

        return;
    }

    const destinationName =
        getUniqueCopyName(
            source,
            destination
        );

    const oldRootPath =
        source.path;

    const newRootPath =
        joinPath(
            destination,
            destinationName
        );

    const clipboardMode =
        internalClipboard.mode;

    cloneTree(
        source,
        destination,
        destinationName
    );

    if (
        clipboardMode ===
        "cut"
    ) {

        const tabPaths =
            openCodeTabIds.map(
                function (id) {

                    const entry =
                        getEntryById(
                            id
                        );

                    return (
                        entry
                            ? entry.path
                            : null
                    );
                }
            );

        const currentEntry =
            getEntryById(
                currentCodeFileId
            );

        const currentPath =
            currentEntry
                ? currentEntry.path
                : null;

        workspaceEntries =
            workspaceEntries.filter(
                function (entry) {

                    return (
                        entry.path !==
                            oldRootPath &&
                        !entry.path.startsWith(
                            oldRootPath +
                            "/"
                        )
                    );
                }
            );

        refreshCodingFiles();

        openCodeTabIds =
            tabPaths
                .map(
                    function (path) {

                        if (!path) {
                            return null;
                        }

                        if (
                            path ===
                                oldRootPath ||
                            path.startsWith(
                                oldRootPath +
                                "/"
                            )
                        ) {

                            const suffix =
                                path.slice(
                                    oldRootPath.length
                                );

                            const moved =
                                getEntryByPath(
                                    newRootPath +
                                    suffix
                                );

                            return (
                                moved
                                    ? moved.id
                                    : null
                            );
                        }

                        const same =
                            getEntryByPath(
                                path
                            );

                        return (
                            same
                                ? same.id
                                : null
                        );
                    }
                )
                .filter(
                    Boolean
                );

        if (
            currentPath &&
            (
                currentPath ===
                    oldRootPath ||
                currentPath.startsWith(
                    oldRootPath +
                    "/"
                )
            )
        ) {

            const suffix =
                currentPath.slice(
                    oldRootPath.length
                );

            const movedCurrent =
                getEntryByPath(
                    newRootPath +
                    suffix
                );

            currentCodeFileId =
                movedCurrent
                    ? movedCurrent.id
                    : null;

        } else {

            const sameCurrent =
                currentPath
                    ? getEntryByPath(
                        currentPath
                    )
                    : null;

            currentCodeFileId =
                sameCurrent
                    ? sameCurrent.id
                    : null;
        }

        internalClipboard =
            null;

    } else {

        refreshCodingFiles();
    }

    openFolderPaths.add(
        destination
    );

    saveWorkspaceSnapshot();

    renderCodeFiles();

    renderTabs();

    renderProjects();

    codeSaveStatus.textContent =
        clipboardMode ===
            "cut"
            ? "Moved"
            : "Pasted";

    if (
        currentCodeFileId
    ) {

        await openCodeFile(
            currentCodeFileId
        );
    }
}

async function deleteEntry(entry) {

    if (
        !entry ||
        entry.isRoot
    ) {
        return;
    }

    if (
        !window.confirm(
            "Delete " +
            entry.name +
            "?"
        )
    ) {
        return;
    }

    const removedIds =
        workspaceEntries
            .filter(
                function (item) {

                    return (
                        item.path ===
                            entry.path ||
                        item.path.startsWith(
                            entry.path +
                            "/"
                        )
                    );
                }
            )
            .map(
                function (item) {

                    return (
                        item.id
                    );
                }
            );

    removedIds.forEach(
        function (id) {

            const model =
                monacoModels.get(
                    id
                );

            if (model) {

                try {

                    model.dispose();

                } catch (error) {
                }

                monacoModels.delete(
                    id
                );
            }
        }
    );

    workspaceEntries =
        workspaceEntries.filter(
            function (item) {

                return (
                    item.path !==
                        entry.path &&
                    !item.path.startsWith(
                        entry.path +
                        "/"
                    )
                );
            }
        );

    refreshCodingFiles();

    openCodeTabIds =
        openCodeTabIds.filter(
            function (id) {

                return (
                    !!getEntryById(
                        id
                    )
                );
            }
        );

    if (
        !getEntryById(
            currentCodeFileId
        )
    ) {

        currentCodeFileId =
            openCodeTabIds.length
                ? openCodeTabIds[
                    openCodeTabIds.length -
                    1
                ]
                : null;

        if (
            currentCodeFileId
        ) {

            await openCodeFile(
                currentCodeFileId
            );

        } else {

            clearEditor();
        }
    }

    saveWorkspaceSnapshot();

    renderCodeFiles();

    renderTabs();

    renderProjects();
}

async function renameEntry(
    entry,
    newName
) {

    if (
        !entry ||
        entry.isRoot
    ) {
        return;
    }

    const cleanName =
        newName.trim();

    if (
        !cleanName ||
        cleanName.includes("/") ||
        cleanName.includes("\\")
    ) {

        window.alert(
            "Enter a name, not a path."
        );

        return;
    }

    if (
        cleanName ===
        entry.name
    ) {
        return;
    }

    if (
        nameExists(
            cleanName,
            entry.parentPath,
            entry.path
        )
    ) {

        window.alert(
            "A file or folder with that name already exists."
        );

        return;
    }

    const oldPath =
        entry.path;

    const newPath =
        joinPath(
            entry.parentPath,
            cleanName
        );

    const oldIdsToNewIds =
        new Map();

    workspaceEntries.forEach(
        function (item) {

            if (
                item.path ===
                    oldPath ||
                item.path.startsWith(
                    oldPath +
                    "/"
                )
            ) {

                const suffix =
                    item.path ===
                        oldPath
                        ? ""
                        : item.path.slice(
                            oldPath.length +
                            1
                        );

                const nextPath =
                    suffix
                        ? joinPath(
                            newPath,
                            suffix
                        )
                        : newPath;

                const oldId =
                    item.id;

                item.path =
                    nextPath;

                item.parentPath =
                    getParentPath(
                        nextPath
                    );

                item.name =
                    getBaseName(
                        nextPath
                    );

                item.id =
                    createEntryId(
                        item.type,
                        nextPath
                    );

                oldIdsToNewIds.set(
                    oldId,
                    item.id
                );
            }
        }
    );

    oldIdsToNewIds.forEach(
        function (
            newId,
            oldId
        ) {

            if (
                monacoModels.has(
                    oldId
                )
            ) {

                const oldModel =
                    monacoModels.get(
                        oldId
                    );

                const item =
                    getEntryById(
                        newId
                    );

                const value =
                    oldModel.getValue();

                oldModel.dispose();

                monacoModels.delete(
                    oldId
                );

                if (
                    window.monaco &&
                    item
                ) {

                    const model =
                        monaco.editor
                            .createModel(
                                value,
                                getMonacoLanguage(
                                    item.name
                                )
                            );

                    monacoModels.set(
                        newId,
                        model
                    );
                }
            }
        }
    );

    openCodeTabIds =
        openCodeTabIds.map(
            function (id) {

                return (
                    oldIdsToNewIds.get(
                        id
                    ) ||
                    id
                );
            }
        );

    currentCodeFileId =
        oldIdsToNewIds.get(
            currentCodeFileId
        ) ||
        currentCodeFileId;

    refreshCodingFiles();

    saveWorkspaceSnapshot();

    renderCodeFiles();

    renderTabs();

    renderProjects();

    if (
        currentCodeFileId
    ) {

        await openCodeFile(
            currentCodeFileId
        );
    }
}

async function confirmFileDialog() {

    const value =
        fileDialogInput
            .value
            .trim();

    if (!value) {

        fileDialogInput.focus();

        return;
    }

    if (
        fileDialogMode ===
        "new-file"
    ) {

        await createNewFile(
            value,
            selectedFolderPath
        );

    } else if (
        fileDialogMode ===
        "new-folder"
    ) {

        await createNewFolder(
            value,
            selectedFolderPath
        );

    } else if (
        fileDialogMode ===
        "rename"
    ) {

        await renameEntry(
            fileDialogTarget,
            value
        );
    }

    closeFileDialog();
}

function initializeMonaco() {

    if (
        monacoReadyPromise
    ) {
        return monacoReadyPromise;
    }

    monacoReadyPromise =
        new Promise(
            function (
                resolve,
                reject
            ) {

                if (
                    typeof require !==
                    "function"
                ) {

                    reject(
                        new Error(
                            "Monaco loader is unavailable."
                        )
                    );

                    return;
                }

                window.MonacoEnvironment = {

                    getWorkerUrl:
                        function () {

                            const code =
                                "self.MonacoEnvironment={baseUrl:'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/'};importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/base/worker/workerMain.js');";

                            return (
                                "data:text/javascript;charset=utf-8," +
                                encodeURIComponent(
                                    code
                                )
                            );
                        }
                };

                require.config(
                    {
                        paths: {
                            vs:
                                "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
                        }
                    }
                );

                require(
                    [
                        "vs/editor/editor.main"
                    ],
                    function () {

                        monaco.editor
                            .defineTheme(
                                "ilinaPurple",
                                {
                                    base:
                                        "vs-dark",

                                    inherit:
                                        true,

                                    rules:
                                        [],

                                    colors: {

                                        "editor.background":
                                            "#1B0E33",

                                        "editor.foreground":
                                            "#F3EAFF",

                                        "editorLineNumber.foreground":
                                            "#806C99",

                                        "editorLineNumber.activeForeground":
                                            "#D6B6FF",

                                        "editorCursor.foreground":
                                            "#D4A6FF",

                                        "editor.selectionBackground":
                                            "#663C8F88",

                                        "editor.lineHighlightBackground":
                                            "#2A1743"
                                    }
                                }
                            );

                        monacoEditorInstance =
                            monaco.editor.create(
                                monacoEditorElement,
                                {
                                    value:
                                        "",

                                    language:
                                        "plaintext",

                                    theme:
                                        "ilinaPurple",

                                    automaticLayout:
                                        true,

                                    fontSize:
                                        14,

                                    lineHeight:
                                        21,

                                    minimap: {
                                        enabled:
                                            true
                                    },

                                    scrollBeyondLastLine:
                                        false,

                                    wordWrap:
                                        "off"
                                }
                            );

                        monacoEditorInstance
                            .onDidChangeModelContent(
                                function () {

                                    const entry =
                                        getEntryById(
                                            currentCodeFileId
                                        );

                                    const model =
                                        monacoEditorInstance
                                            .getModel();

                                    if (
                                        !entry ||
                                        !model
                                    ) {
                                        return;
                                    }

                                    entry.content =
                                        model.getValue();

                                    entry.dirty =
                                        true;

                                    codeSaveStatus.textContent =
                                        "Unsaved";

                                    renderTabs();

                                    if (
                                        autoSaveEnabled
                                    ) {

                                        clearTimeout(
                                            autoSaveTimer
                                        );

                                        autoSaveTimer =
                                            setTimeout(
                                                function () {

                                                    saveCurrentCodeFile(
                                                        true
                                                    );
                                                },
                                                600
                                            );
                                    }
                                }
                            );

                        monacoEditorInstance
                            .onDidChangeCursorPosition(
                                function (event) {

                                    codeCursorPosition.textContent =
                                        "Ln " +
                                        event.position.lineNumber +
                                        ", Col " +
                                        event.position.column;
                                }
                            );

                        monacoEditorInstance
                            .addCommand(
                                monaco.KeyMod.CtrlCmd |
                                monaco.KeyCode.KeyS,
                                function () {

                                    saveCurrentCodeFile(
                                        false
                                    );
                                }
                            );

                        resolve(
                            monacoEditorInstance
                        );
                    },
                    reject
                );
            }
        );

    return monacoReadyPromise;
}

function enableFallbackEditor() {

    monacoEditorElement.style.display =
        "none";

    fallbackEditor.style.display =
        "block";

    fallbackEditor.style.width =
        "100%";

    fallbackEditor.style.height =
        "100%";

    fallbackEditor.style.background =
        "#1b0e33";

    fallbackEditor.style.color =
        "white";

    fallbackEditor.style.border =
        "none";

    fallbackEditor.style.outline =
        "none";

    fallbackEditor.style.padding =
        "14px";

    fallbackEditor.style.fontFamily =
        "Consolas, Monaco, monospace";

    fallbackEditor.style.fontSize =
        "14px";

    fallbackEditor.style.resize =
        "none";

    if (
        !fallbackEditorListenerAdded
    ) {

        fallbackEditorListenerAdded =
            true;

        fallbackEditor.addEventListener(
            "input",
            function () {

                const entry =
                    getEntryById(
                        currentCodeFileId
                    );

                if (!entry) return;

                entry.content =
                    fallbackEditor.value;

                entry.dirty =
                    true;

                codeSaveStatus.textContent =
                    "Unsaved";

                renderTabs();

                if (
                    autoSaveEnabled
                ) {

                    clearTimeout(
                        autoSaveTimer
                    );

                    autoSaveTimer =
                        setTimeout(
                            function () {

                                saveCurrentCodeFile(
                                    true
                                );
                            },
                            600
                        );
                }
            }
        );
    }
}

async function openCodeFile(id) {

    const entry =
        getEntryById(
            id
        );

    if (
        !entry ||
        entry.type !==
            "file"
    ) {
        return;
    }

    currentCodeFileId =
        entry.id;

    selectedFolderPath =
        entry.parentPath;

    if (
        !openCodeTabIds.includes(
            entry.id
        )
    ) {

        openCodeTabIds.push(
            entry.id
        );
    }

    try {

        await initializeMonaco();

        fallbackEditor.style.display =
            "none";

        monacoEditorElement.style.display =
            "block";

        let model =
            monacoModels.get(
                entry.id
            );

        if (!model) {

            model =
                monaco.editor
                    .createModel(
                        entry.content ||
                        "",
                        getMonacoLanguage(
                            entry.name
                        )
                    );

            monacoModels.set(
                entry.id,
                model
            );

        } else {

            monaco.editor
                .setModelLanguage(
                    model,
                    getMonacoLanguage(
                        entry.name
                    )
                );
        }

        monacoEditorInstance.setModel(
            model
        );

        monacoEditorInstance.focus();

    } catch (error) {

        enableFallbackEditor();

        fallbackEditor.value =
            entry.content ||
            "";

        fallbackEditor.focus();
    }

    codeLanguage.textContent =
        getFileLanguage(
            entry.name
        );

    codeSaveStatus.textContent =
        entry.dirty
            ? "Unsaved"
            : "Saved";

    renderTabs();

    renderCodeFiles();
}

function clearEditor() {

    currentCodeFileId =
        null;

    if (
        monacoEditorInstance
    ) {

        monacoEditorInstance.setModel(
            null
        );
    }

    fallbackEditor.value =
        "";

    codeLanguage.textContent =
        "Plain Text";

    codeSaveStatus.textContent =
        "No file open";

    codeCursorPosition.textContent =
        "Ln 1, Col 1";
}

function renderTabs() {

    editorTabs.innerHTML =
        "";

    openCodeTabIds =
        openCodeTabIds.filter(
            function (id) {

                return (
                    !!getEntryById(
                        id
                    )
                );
            }
        );

    if (
        !openCodeTabIds.length
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.id =
            "currentCodeTab";

        empty.textContent =
            "No file open";

        editorTabs.appendChild(
            empty
        );

        return;
    }

    openCodeTabIds.forEach(
        function (id) {

            const entry =
                getEntryById(
                    id
                );

            if (!entry) return;

            const tab =
                document.createElement(
                    "div"
                );

            tab.className =
                "editorTab";

            if (
                id ===
                currentCodeFileId
            ) {

                tab.classList.add(
                    "activeEditorTab"
                );
            }

            const icon =
                document.createElement(
                    "span"
                );

            icon.textContent =
                getFileIcon(
                    entry.name
                );

            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "editorTabName";

            name.textContent =
                entry.name +
                (
                    entry.dirty
                        ? " ●"
                        : ""
                );

            const close =
                document.createElement(
                    "span"
                );

            close.className =
                "editorTabClose";

            close.textContent =
                "×";

            tab.appendChild(
                icon
            );

            tab.appendChild(
                name
            );

            tab.appendChild(
                close
            );

            tab.addEventListener(
                "click",
                function () {

                    openCodeFile(
                        id
                    );
                }
            );

            close.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    closeCodeTab(
                        id
                    );
                }
            );

            editorTabs.appendChild(
                tab
            );
        }
    );
}

async function closeCodeTab(id) {

    const entry =
        getEntryById(
            id
        );

    if (
        entry &&
        entry.dirty &&
        !autoSaveEnabled
    ) {

        const save =
            window.confirm(
                entry.name +
                " has unsaved changes. Save before closing?"
            );

        if (save) {

            const previous =
                currentCodeFileId;

            currentCodeFileId =
                id;

            await saveCurrentCodeFile(
                true
            );

            currentCodeFileId =
                previous;
        }
    }

    openCodeTabIds =
        openCodeTabIds.filter(
            function (tabId) {

                return (
                    tabId !==
                    id
                );
            }
        );

    if (
        currentCodeFileId ===
        id
    ) {

        currentCodeFileId =
            openCodeTabIds.length
                ? openCodeTabIds[
                    openCodeTabIds.length -
                    1
                ]
                : null;

        if (
            currentCodeFileId
        ) {

            await openCodeFile(
                currentCodeFileId
            );

        } else {

            clearEditor();
        }
    }

    renderTabs();

    renderCodeFiles();
}

async function saveCurrentCodeFile(
    silent
) {

    const entry =
        getEntryById(
            currentCodeFileId
        );

    if (!entry) {

        if (!silent) {

            codeSaveStatus.textContent =
                "No file selected";
        }

        return;
    }

    if (
        monacoEditorInstance &&
        monacoEditorInstance.getModel() &&
        monacoModels.has(
            entry.id
        )
    ) {

        entry.content =
            monacoEditorInstance
                .getModel()
                .getValue();

    } else {

        entry.content =
            fallbackEditor.value;
    }

    entry.dirty =
        false;

    saveWorkspaceSnapshot();

    renderTabs();

    renderProjects();

    codeSaveStatus.textContent =
        silent
            ? "Saved"
            : "Saved ✓";
}

function openTerminal() {

    terminalPanel.style.display =
        "flex";

    if (
        !terminalOutput
            .textContent
            .trim()
    ) {

        appendTerminal(
            "Ilina Code Studio Terminal\nType help to see available commands.\n"
        );
    }

    terminalInput.focus();

    if (
        monacoEditorInstance
    ) {

        monacoEditorInstance.layout();
    }
}

function closeTerminal() {

    terminalPanel.style.display =
        "none";

    if (
        monacoEditorInstance
    ) {

        monacoEditorInstance.layout();
    }
}

function appendTerminal(text) {

    terminalOutput.textContent +=
        String(
            text
        );

    if (
        !String(
            text
        ).endsWith(
            "\n"
        )
    ) {

        terminalOutput.textContent +=
            "\n";
    }

    terminalOutput.scrollTop =
        terminalOutput.scrollHeight;
}

function updateTerminalPrompt() {

    terminalPrompt.textContent =
        workspaceName +
        ":/" +
        (
            terminalCwd
                ? terminalCwd
                : ""
        ) +
        " $";
}

function resolveTerminalPath(path) {

    const text =
        String(
            path || ""
        )
            .trim();

    if (
        !text ||
        text === "."
    ) {
        return terminalCwd;
    }

    if (
        text.startsWith(
            "/"
        )
    ) {

        let stripped =
            text.replace(
                /^\/+/,
                ""
            );

        if (
            stripped ===
            workspaceName
        ) {
            return "";
        }

        if (
            stripped.startsWith(
                workspaceName +
                "/"
            )
        ) {

            stripped =
                stripped.slice(
                    workspaceName.length +
                    1
                );
        }

        return normalizePath(
            stripped
        );
    }

    return normalizePath(
        joinPath(
            terminalCwd,
            text
        )
    );
}

async function ensurePyodide() {

    if (
        pyodideInstance
    ) {
        return pyodideInstance;
    }

    if (
        typeof loadPyodide !==
        "function"
    ) {

        throw new Error(
            "Python runtime did not load."
        );
    }

    appendTerminal(
        "Loading Python runtime..."
    );

    pyodideInstance =
        await loadPyodide();

    appendTerminal(
        "Python ready."
    );

    return pyodideInstance;
}

async function syncPythonWorkspace(
    pyodide
) {

    try {

        pyodide.FS.mkdirTree(
            "/workspace"
        );

    } catch (error) {
    }

    workspaceEntries
        .filter(
            function (entry) {

                return (
                    entry.type ===
                    "folder"
                );
            }
        )
        .forEach(
            function (folder) {

                try {

                    pyodide.FS.mkdirTree(
                        "/workspace/" +
                        folder.path
                    );

                } catch (error) {
                }
            }
        );

    codingFiles.forEach(
        function (file) {

            const parent =
                getParentPath(
                    file.path
                );

            if (parent) {

                try {

                    pyodide.FS.mkdirTree(
                        "/workspace/" +
                        parent
                    );

                } catch (error) {
                }
            }

            pyodide.FS.writeFile(
                "/workspace/" +
                file.path,
                file.content ||
                "",
                {
                    encoding:
                        "utf8"
                }
            );
        }
    );
}

async function runPythonFile(entry) {

    openTerminal();

    appendTerminal(
        "$ python " +
        entry.path
    );

    try {

        const pyodide =
            await ensurePyodide();

        await syncPythonWorkspace(
            pyodide
        );

        try {

            await pyodide
                .loadPackagesFromImports(
                    entry.content ||
                    ""
                );

        } catch (error) {
        }

        pyodide.setStdout(
            {
                batched:
                    appendTerminal
            }
        );

        pyodide.setStderr(
            {
                batched:
                    appendTerminal
            }
        );

        pyodide.FS.chdir(
            "/workspace" +
            (
                entry.parentPath
                    ? "/" +
                      entry.parentPath
                    : ""
            )
        );

        await pyodide
            .runPythonAsync(
                entry.content ||
                ""
            );

    } catch (error) {

        appendTerminal(
            String(
                error
            )
        );
    }
}

async function runJavaScript(entry) {

    openTerminal();

    appendTerminal(
        "$ node " +
        entry.path
    );

    const oldLog =
        console.log;

    const oldError =
        console.error;

    console.log =
        function () {

            appendTerminal(
                Array.from(
                    arguments
                )
                    .map(
                        String
                    )
                    .join(
                        " "
                    )
            );

            oldLog.apply(
                console,
                arguments
            );
        };

    console.error =
        function () {

            appendTerminal(
                "Error: " +
                Array.from(
                    arguments
                )
                    .map(
                        String
                    )
                    .join(
                        " "
                    )
            );

            oldError.apply(
                console,
                arguments
            );
        };

    try {

        new Function(
            entry.content ||
            ""
        )();

    } catch (error) {

        appendTerminal(
            error.name +
            ": " +
            error.message
        );

    } finally {

        console.log =
            oldLog;

        console.error =
            oldError;
    }
}

function findHtmlFile() {

    return (
        codingFiles.find(
            function (file) {

                return (
                    file.path
                        .toLowerCase() ===
                    "index.html"
                );
            }
        ) ||
        codingFiles.find(
            function (file) {

                return (
                    /\.html?$/.test(
                        file.name
                            .toLowerCase()
                    )
                );
            }
        ) ||
        null
    );
}

function buildWebPreview(
    htmlEntry
) {

    let html =
        htmlEntry.content ||
        "";

    const baseFolder =
        htmlEntry.parentPath;

    html =
        html.replace(
            /<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi,
            function (
                match,
                href
            ) {

                const clean =
                    href
                        .split("?")[0]
                        .split("#")[0];

                const file =
                    getEntryByPath(
                        joinPath(
                            baseFolder,
                            clean
                        )
                    );

                if (
                    file &&
                    file.name
                        .toLowerCase()
                        .endsWith(
                            ".css"
                        )
                ) {

                    return (
                        "<style>" +
                        (
                            file.content ||
                            ""
                        ) +
                        "</style>"
                    );
                }

                return match;
            }
        );

    html =
        html.replace(
            /<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi,
            function (
                match,
                src
            ) {

                const clean =
                    src
                        .split("?")[0]
                        .split("#")[0];

                const file =
                    getEntryByPath(
                        joinPath(
                            baseFolder,
                            clean
                        )
                    );

                if (
                    file &&
                    /\.(js|mjs|cjs)$/i.test(
                        file.name
                    )
                ) {

                    return (
                        "<script>" +
                        (
                            file.content ||
                            ""
                        ) +
                        "<\/script>"
                    );
                }

                return match;
            }
        );

    previewPanel.style.display =
        "flex";

    previewTitle.textContent =
        htmlEntry.name;

    codeTerminal.style.display =
        "none";

    codePreview.style.display =
        "block";

    codePreview.srcdoc =
        html;

    if (
        monacoEditorInstance
    ) {

        monacoEditorInstance.layout();
    }
}

async function runCodingProject() {

    const entry =
        getEntryById(
            currentCodeFileId
        );

    if (!entry) {

        window.alert(
            "Open a file first."
        );

        return;
    }

    if (
        monacoEditorInstance &&
        monacoEditorInstance.getModel() &&
        monacoModels.has(
            entry.id
        )
    ) {

        entry.content =
            monacoEditorInstance
                .getModel()
                .getValue();

    } else {

        entry.content =
            fallbackEditor.value;
    }

    const lower =
        entry.name
            .toLowerCase();

    if (
        lower.endsWith(
            ".py"
        )
    ) {

        await runPythonFile(
            entry
        );

    } else if (
        /\.html?$/.test(
            lower
        )
    ) {

        buildWebPreview(
            entry
        );

    } else if (
        lower.endsWith(
            ".css"
        )
    ) {

        const html =
            findHtmlFile();

        if (html) {

            buildWebPreview(
                html
            );

        } else {

            openTerminal();

            appendTerminal(
                "No HTML file was found to preview this CSS file."
            );
        }

    } else if (
        /\.(js|mjs|cjs)$/.test(
            lower
        )
    ) {

        const html =
            findHtmlFile();

        if (html) {

            buildWebPreview(
                html
            );

        } else {

            await runJavaScript(
                entry
            );
        }

    } else {

        openTerminal();

        appendTerminal(
            entry.name +
            " is not directly runnable in this browser IDE."
        );
    }
}

async function executeTerminalCommand(
    raw
) {

    const line =
        String(
            raw || ""
        )
            .trim();

    if (!line) return;

    appendTerminal(
        terminalPrompt.textContent +
        " " +
        line
    );

    const parts =
        line.split(
            /\s+/
        );

    const command =
        parts
            .shift()
            .toLowerCase();

    const argument =
        parts.join(
            " "
        );

    if (
        command ===
            "clear" ||
        command ===
            "cls"
    ) {

        terminalOutput.textContent =
            "";

        return;
    }

    if (
        command ===
        "help"
    ) {

        appendTerminal(
            "help                 Show commands"
        );

        appendTerminal(
            "pwd                  Show current folder"
        );

        appendTerminal(
            "ls [folder]          List files and folders"
        );

        appendTerminal(
            "cd <folder>          Change folder"
        );

        appendTerminal(
            "cat <file>           Print a text file"
        );

        appendTerminal(
            "python <file.py>     Run Python"
        );

        appendTerminal(
            "node <file.js>       Run JavaScript"
        );

        appendTerminal(
            "run                  Run the active file"
        );

        appendTerminal(
            "clear                Clear terminal"
        );

        return;
    }

    if (
        command ===
        "pwd"
    ) {

        appendTerminal(
            "/" +
            workspaceName +
            (
                terminalCwd
                    ? "/" +
                      terminalCwd
                    : ""
            )
        );

        return;
    }

    if (
        command ===
            "ls" ||
        command ===
            "dir"
    ) {

        const path =
            argument
                ? resolveTerminalPath(
                    argument
                )
                : terminalCwd;

        const folder =
            getFolderEntry(
                path
            );

        if (!folder) {

            appendTerminal(
                "Folder not found: " +
                argument
            );

            return;
        }

        const children =
            getDirectChildren(
                path
            );

        if (
            !children.length
        ) {

            appendTerminal(
                "(empty)"
            );
        }

        children.forEach(
            function (entry) {

                appendTerminal(
                    (
                        entry.type ===
                            "folder"
                            ? "📁 "
                            : getFileIcon(
                                entry.name
                            ) +
                              " "
                    ) +
                    entry.name
                );
            }
        );

        return;
    }

    if (
        command ===
        "cd"
    ) {

        if (
            !argument ||
            argument === "~"
        ) {

            terminalCwd =
                "";

        } else {

            const path =
                resolveTerminalPath(
                    argument
                );

            if (
                !getFolderEntry(
                    path
                )
            ) {

                appendTerminal(
                    "Folder not found: " +
                    argument
                );

                return;
            }

            terminalCwd =
                path;
        }

        updateTerminalPrompt();

        return;
    }

    if (
        command ===
            "cat" ||
        command ===
            "type"
    ) {

        const entry =
            getEntryByPath(
                resolveTerminalPath(
                    argument
                )
            );

        if (
            !entry ||
            entry.type !==
                "file"
        ) {

            appendTerminal(
                "File not found: " +
                argument
            );

        } else {

            appendTerminal(
                entry.content ||
                ""
            );
        }

        return;
    }

    if (
        command ===
            "python" ||
        command ===
            "python3"
    ) {

        const entry =
            getEntryByPath(
                resolveTerminalPath(
                    argument
                )
            );

        if (
            !entry ||
            !entry.name
                .toLowerCase()
                .endsWith(
                    ".py"
                )
        ) {

            appendTerminal(
                "Python file not found: " +
                argument
            );

        } else {

            await runPythonFile(
                entry
            );
        }

        return;
    }

    if (
        command ===
            "node" ||
        command ===
            "js"
    ) {

        const entry =
            getEntryByPath(
                resolveTerminalPath(
                    argument
                )
            );

        if (
            !entry ||
            !/\.(js|mjs|cjs)$/i.test(
                entry.name
            )
        ) {

            appendTerminal(
                "JavaScript file not found: " +
                argument
            );

        } else {

            await runJavaScript(
                entry
            );
        }

        return;
    }

    if (
        command ===
        "run"
    ) {

        await runCodingProject();

        return;
    }

    appendTerminal(
        "Command not found: " +
        command +
        ". Type help for available commands."
    );
}

function openCoding(icon) {

    selectIcon(
        icon
    );

    openWindow(
        codingScreen
    );

    renderCodeFiles();

    renderTabs();

    updateTerminalPrompt();

    if (
        currentCodeFileId
    ) {

        openCodeFile(
            currentCodeFileId
        );

        return;
    }

    const starterFile =
        codingFiles.find(
            function (file) {

                return (
                    file.name ===
                    "index.html"
                );
            }
        );

    if (starterFile) {

        openCodeFile(
            starterFile.id
        );

        return;
    }

    if (
        codingFiles.length >
        0
    ) {

        openCodeFile(
            codingFiles[0].id
        );
    }
}

window.openCoding =
    openCoding;

dragElement(
    codingScreen
);

makeResizable(
    codingScreen,
    650,
    420
);

addWindowTapHandling(
    codingScreen
);

$("#codingclose")
    .addEventListener(
        "click",
        function () {

            closeWindow(
                codingScreen
            );

            deselectIcon(
                codingIcon
            );

            hideContextMenus();
        }
    );

$("#openFolderButton")
    .addEventListener(
        "click",
        function () {

            folderFallbackInput.click();
        }
    );

folderFallbackInput
    .addEventListener(
        "change",
        function (event) {

            importFolderFiles(
                event.target.files
            );
        }
    );

$("#newCodeFileButton")
    .addEventListener(
        "click",
        function () {

            openFileDialog(
                "new-file"
            );
        }
    );

$("#newCodeFolderButton")
    .addEventListener(
        "click",
        function () {

            openFileDialog(
                "new-folder"
            );
        }
    );

$("#saveCodeFileButton")
    .addEventListener(
        "click",
        function () {

            saveCurrentCodeFile(
                false
            );
        }
    );

$("#runCodeButton")
    .addEventListener(
        "click",
        runCodingProject
    );

$("#toggleTerminalButton")
    .addEventListener(
        "click",
        function () {

            if (
                terminalPanel.style.display ===
                "flex"
            ) {

                closeTerminal();

            } else {

                openTerminal();
            }
        }
    );

$("#newTerminalButton")
    .addEventListener(
        "click",
        function () {

            terminalOutput.textContent =
                "";

            terminalCwd =
                "";

            updateTerminalPrompt();

            appendTerminal(
                "New terminal session."
            );

            terminalInput.focus();
        }
    );

$("#clearTerminalButton")
    .addEventListener(
        "click",
        function () {

            terminalOutput.textContent =
                "";
        }
    );

$("#closeTerminalButton")
    .addEventListener(
        "click",
        closeTerminal
    );

terminalInput
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                const command =
                    terminalInput.value;

                terminalInput.value =
                    "";

                executeTerminalCommand(
                    command
                );
            }
        }
    );

$("#closePreviewButton")
    .addEventListener(
        "click",
        function () {

            previewPanel.style.display =
                "none";

            codePreview.srcdoc =
                "";

            if (
                monacoEditorInstance
            ) {

                monacoEditorInstance.layout();
            }
        }
    );

fileDialogConfirm
    .addEventListener(
        "click",
        confirmFileDialog
    );

$("#fileDialogCancel")
    .addEventListener(
        "click",
        closeFileDialog
    );

fileDialogInput
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                confirmFileDialog();
            }

            if (
                event.key ===
                "Escape"
            ) {

                closeFileDialog();
            }
        }
    );

fileContextMenu
    .addEventListener(
        "click",
        async function (event) {

            const button =
                event.target.closest(
                    "button[data-action]"
                );

            if (
                !button ||
                !contextTarget
            ) {
                return;
            }

            const action =
                button.dataset.action;

            const target =
                contextTarget;

            hideContextMenus();

            if (
                action ===
                "cut"
            ) {

                internalClipboard = {

                    mode:
                        "cut",

                    sourcePath:
                        target.path
                };

                codeSaveStatus.textContent =
                    "Cut: " +
                    target.name;

                renderCodeFiles();

            } else if (
                action ===
                "copy"
            ) {

                internalClipboard = {

                    mode:
                        "copy",

                    sourcePath:
                        target.path
                };

                codeSaveStatus.textContent =
                    "Copied: " +
                    target.name;

                renderCodeFiles();

            } else if (
                action ===
                "copy-path"
            ) {

                copyText(
                    getDisplayPath(
                        target
                    )
                );

                codeSaveStatus.textContent =
                    "Path copied";

            } else if (
                action ===
                "copy-relative-path"
            ) {

                copyText(
                    target.path
                );

                codeSaveStatus.textContent =
                    "Relative path copied";

            } else if (
                action ===
                "rename"
            ) {

                openFileDialog(
                    "rename",
                    target
                );

            } else if (
                action ===
                "delete"
            ) {

                await deleteEntry(
                    target
                );
            }
        }
    );

folderContextMenu
    .addEventListener(
        "click",
        async function (event) {

            if (
                event.target.closest(
                    ".autoSaveMenuItem"
                )
            ) {
                return;
            }

            const button =
                event.target.closest(
                    "button[data-action]"
                );

            if (
                !button ||
                !contextTarget
            ) {
                return;
            }

            const action =
                button.dataset.action;

            const target =
                contextTarget;

            hideContextMenus();

            if (
                action ===
                "new-file"
            ) {

                selectedFolderPath =
                    target.path;

                openFileDialog(
                    "new-file"
                );

            } else if (
                action ===
                "new-folder"
            ) {

                selectedFolderPath =
                    target.path;

                openFileDialog(
                    "new-folder"
                );

            } else if (
                action ===
                "paste"
            ) {

                await pasteClipboard(
                    target.path
                );

            } else if (
                action ===
                "rename"
            ) {

                openFileDialog(
                    "rename",
                    target
                );

            } else if (
                action ===
                "delete"
            ) {

                await deleteEntry(
                    target
                );
            }
        }
    );

autoSaveCheckbox
    .addEventListener(
        "change",
        function () {

            autoSaveEnabled =
                autoSaveCheckbox.checked;

            codeSaveStatus.textContent =
                autoSaveEnabled
                    ? "Auto Save on"
                    : "Auto Save off";

            if (
                autoSaveEnabled &&
                currentCodeFileId
            ) {

                const entry =
                    getEntryById(
                        currentCodeFileId
                    );

                if (
                    entry &&
                    entry.dirty
                ) {

                    saveCurrentCodeFile(
                        true
                    );
                }
            }
        }
    );

projectHeading
    .addEventListener(
        "click",
        function () {

            selectedFolderPath =
                "";

            if (
                openFolderPaths.has(
                    ""
                )
            ) {

                openFolderPaths.delete(
                    ""
                );

            } else {

                openFolderPaths.add(
                    ""
                );
            }

            renderCodeFiles();
        }
    );

projectHeading
    .addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();

            selectedFolderPath =
                "";

            showFolderContextMenu(
                event.clientX,
                event.clientY,
                getFolderEntry("")
            );
        }
    );

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".ideContextMenu"
            )
        ) {

            hideContextMenus();
        }
    }
);

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            hideContextMenus();

            if (
                fileDialog.style.display ===
                "flex"
            ) {

                closeFileDialog();
            }
        }

        if (
            (
                event.ctrlKey ||
                event.metaKey
            ) &&
            event.key
                .toLowerCase() ===
                "s" &&
            codingScreen.style.display !==
                "none"
        ) {

            event.preventDefault();

            saveCurrentCodeFile(
                false
            );
        }
    }
);

loadWorkspaceSnapshot();

createStarterWorkspace();

refreshCodingFiles();

projectHeading.textContent =
    workspaceEntries.length
        ? "▼ " +
          workspaceName.toUpperCase()
        : "NO FOLDER OPEN";

renderCodeFiles();

renderTabs();

updateTerminalPrompt();

const projectsScreen =
    $("#projects");

const projectsIcon =
    $("#projectsIcon");

const projectFiles =
    $("#projectFiles");

const projectPath =
    $("#projectPath");

let projectView =
    "home";

dragElement(
    projectsScreen
);

makeResizable(
    projectsScreen
);

addWindowTapHandling(
    projectsScreen
);

function createProjectCard(
    icon,
    name,
    subtitle,
    clickHandler
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "explorer-card";

    const picture =
        document.createElement(
            "div"
        );

    picture.style.fontSize =
        "34px";

    picture.textContent =
        icon;

    const title =
        document.createElement(
            "div"
        );

    title.className =
        "explorer-card-name";

    title.textContent =
        name;

    card.appendChild(
        picture
    );

    card.appendChild(
        title
    );

    if (subtitle) {

        const info =
            document.createElement(
                "div"
            );

        info.className =
            "small-muted";

        info.textContent =
            subtitle;

        card.appendChild(
            info
        );
    }

    if (clickHandler) {

        card.addEventListener(
            "click",
            clickHandler
        );
    }

    return card;
}

function renderProjects() {

    if (!projectFiles) {
        return;
    }

    projectFiles.innerHTML =
        "";

    if (
        projectView ===
        "home"
    ) {

        projectPath.textContent =
            "IlinaOS > Projects";

        projectFiles.appendChild(
            createProjectCard(
                "📓",
                "SparkLog",
                notes.length +
                " notes",
                function () {

                    projectView =
                        "notes";

                    renderProjects();
                }
            )
        );

        projectFiles.appendChild(
            createProjectCard(
                "💻",
                "Coding",
                codingFiles.length +
                " files",
                function () {

                    projectView =
                        "coding";

                    renderProjects();
                }
            )
        );

        return;
    }

    if (
        projectView ===
        "notes"
    ) {

        projectPath.textContent =
            "IlinaOS > Projects > SparkLog";

        if (!notes.length) {

            projectFiles.innerHTML =
                '<div class="empty-message">No SparkLog notes yet.</div>';

            return;
        }

        notes.forEach(
            function (note) {

                projectFiles.appendChild(
                    createProjectCard(
                        "📝",
                        note.title,
                        new Date(
                            note.updatedAt
                        ).toLocaleDateString(),
                        function () {

                            openSparkLog(
                                sparkLogIcon
                            );

                            loadNote(
                                note.id
                            );
                        }
                    )
                );
            }
        );

        return;
    }

    projectPath.textContent =
        "IlinaOS > Projects > Coding";

    if (
        !codingFiles.length
    ) {

        projectFiles.innerHTML =
            '<div class="empty-message">No coding files yet.</div>';

        return;
    }

    codingFiles.forEach(
        function (file) {

            projectFiles.appendChild(
                createProjectCard(
                    getFileIcon(
                        file.name
                    ),
                    file.name,
                    getFileLanguage(
                        file.name
                    ),
                    function () {

                        openCoding(
                            codingIcon
                        );

                        openCodeFile(
                            file.id
                        );
                    }
                )
            );
        }
    );
}

function openProjects(icon) {

    selectIcon(
        icon
    );

    openWindow(
        projectsScreen
    );

    projectView =
        "home";

    renderProjects();
}

window.openProjects =
    openProjects;

$("#projectsclose")
    .addEventListener(
        "click",
        function () {

            closeWindow(
                projectsScreen
            );

            deselectIcon(
                projectsIcon
            );
        }
    );

$("#projectHomeButton")
    .addEventListener(
        "click",
        function () {

            projectView =
                "home";

            renderProjects();
        }
    );

$("#projectNotesButton")
    .addEventListener(
        "click",
        function () {

            projectView =
                "notes";

            renderProjects();
        }
    );

$("#projectCodingButton")
    .addEventListener(
        "click",
        function () {

            projectView =
                "coding";

            renderProjects();
        }
    );

renderProjects();

const todoScreen =
    $("#todo");

const todoIcon =
    $("#todoIcon");

const taskInput =
    $("#taskInput");

const taskList =
    $("#taskList");

const taskCount =
    $("#taskCount");

let todoFilter =
    "all";

let tasks =
    [];

try {

    tasks =
        JSON.parse(
            localStorage.getItem(
                "ilinaOS.todo.tasks"
            )
        ) || [];

} catch (error) {

    tasks =
        [];
}

function storeTasks() {

    localStorage.setItem(
        "ilinaOS.todo.tasks",
        JSON.stringify(
            tasks
        )
    );
}

function renderTasks() {

    taskList.innerHTML =
        "";

    const shown =
        tasks.filter(
            function (task) {

                if (
                    todoFilter ===
                    "pending"
                ) {

                    return (
                        !task.completed
                    );
                }

                if (
                    todoFilter ===
                    "completed"
                ) {

                    return (
                        task.completed
                    );
                }

                return true;
            }
        );

    taskCount.textContent =
        tasks.filter(
            function (task) {

                return (
                    !task.completed
                );
            }
        ).length;

    if (!shown.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "todoEmptyMessage";

        empty.textContent =
            todoFilter ===
                "all"
                ? "No tasks yet."
                : "No tasks in this view.";

        taskList.appendChild(
            empty
        );

        return;
    }

    shown.forEach(
        function (task) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "todoTask" +
                (
                    task.completed
                        ? " todoTaskCompleted"
                        : ""
                );

            const checkbox =
                document.createElement(
                    "input"
                );

            checkbox.type =
                "checkbox";

            checkbox.className =
                "todoCheckbox";

            checkbox.checked =
                task.completed;

            checkbox.addEventListener(
                "change",
                function () {

                    task.completed =
                        checkbox.checked;

                    storeTasks();

                    renderTasks();
                }
            );

            const text =
                document.createElement(
                    "div"
                );

            text.className =
                "todoTaskText";

            text.textContent =
                task.text;

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "todoDeleteButton";

            deleteButton.textContent =
                "Delete";

            deleteButton.addEventListener(
                "click",
                function () {

                    tasks =
                        tasks.filter(
                            function (item) {

                                return (
                                    item.id !==
                                    task.id
                                );
                            }
                        );

                    storeTasks();

                    renderTasks();
                }
            );

            row.appendChild(
                checkbox
            );

            row.appendChild(
                text
            );

            row.appendChild(
                deleteButton
            );

            taskList.appendChild(
                row
            );
        }
    );
}

function addTask() {

    const text =
        taskInput.value
            .trim();

    if (!text) return;

    tasks.unshift(
        {
            id:
                Date.now()
                    .toString(),

            text:
                text,

            completed:
                false
        }
    );

    taskInput.value =
        "";

    storeTasks();

    renderTasks();
}

function openTodo(icon) {

    selectIcon(
        icon
    );

    openWindow(
        todoScreen
    );

    renderTasks();
}

window.openTodo =
    openTodo;

dragElement(
    todoScreen
);

makeResizable(
    todoScreen,
    420,
    300
);

addWindowTapHandling(
    todoScreen
);

$("#todoclose")
    .addEventListener(
        "click",
        function () {

            closeWindow(
                todoScreen
            );

            deselectIcon(
                todoIcon
            );
        }
    );

$("#addTaskButton")
    .addEventListener(
        "click",
        addTask
    );

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            addTask();
        }
    }
);

$$(
    ".taskFilterButton"
).forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                todoFilter =
                    button.dataset.filter;

                $$(
                    ".taskFilterButton"
                ).forEach(
                    function (item) {

                        item.classList.remove(
                            "activeTaskFilter"
                        );
                    }
                );

                button.classList.add(
                    "activeTaskFilter"
                );

                renderTasks();
            }
        );
    }
);

$("#clearCompletedButton")
    .addEventListener(
        "click",
        function () {

            tasks =
                tasks.filter(
                    function (task) {

                        return (
                            !task.completed
                        );
                    }
                );

            storeTasks();

            renderTasks();
        }
    );

renderTasks();

function saveWindowSizeForRestore(
    windowElement
) {

    const rect =
        windowElement
            .getBoundingClientRect();

    const computed =
        window.getComputedStyle(
            windowElement
        );

    windowElement.dataset.restoreLeft =
        rect.left;

    windowElement.dataset.restoreTop =
        rect.top;

    windowElement.dataset.restoreWidth =
        rect.width;

    windowElement.dataset.restoreHeight =
        rect.height;

    windowElement.dataset.restorePosition =
        computed.position;

    windowElement.dataset.restoreRadius =
        computed.borderRadius;
}


function maximizeWindow(
    windowElement,
    greenButton
) {

    if (!windowElement) return;

    if (
        windowElement.dataset.maximized ===
        "true"
    ) {

        restoreWindow(
            windowElement,
            greenButton
        );

        return;
    }

    saveWindowSizeForRestore(
        windowElement
    );

    const topBar =
        document.querySelector(
            "#top"
        );

    const topHeight =
        topBar
            ? topBar
                .getBoundingClientRect()
                .height
            : 48;

    windowElement.style.position =
        "fixed";

    windowElement.style.left =
        "0px";

    windowElement.style.top =
        topHeight + "px";

    windowElement.style.width =
        "100vw";

    windowElement.style.height =
        "calc(100vh - " +
        topHeight +
        "px)";

    windowElement.style.transform =
        "none";

    windowElement.style.borderRadius =
        "0px";

    windowElement.dataset.maximized =
        "true";

    windowElement.classList.add(
        "windowMaximized"
    );

    if (greenButton) {

        greenButton.title =
            "Restore";
    }

    bringToFront(
        windowElement
    );

    if (
        typeof monacoEditorInstance !==
        "undefined" &&
        monacoEditorInstance &&
        windowElement.id ===
        "coding"
    ) {

        setTimeout(
            function () {

                monacoEditorInstance.layout();
            },
            50
        );
    }
}


function restoreWindow(
    windowElement,
    greenButton
) {

    if (!windowElement) return;

    if (
        !windowElement.dataset
            .restoreWidth
    ) {

        windowElement.dataset.maximized =
            "false";

        windowElement.classList.remove(
            "windowMaximized"
        );

        return;
    }

    windowElement.style.position =
        windowElement.dataset
            .restorePosition ||
        "absolute";

    windowElement.style.left =
        windowElement.dataset
            .restoreLeft +
        "px";

    windowElement.style.top =
        windowElement.dataset
            .restoreTop +
        "px";

    windowElement.style.width =
        windowElement.dataset
            .restoreWidth +
        "px";

    windowElement.style.height =
        windowElement.dataset
            .restoreHeight +
        "px";

    windowElement.style.transform =
        "none";

    windowElement.style.borderRadius =
        windowElement.dataset
            .restoreRadius ||
        "28px";

    windowElement.dataset.maximized =
        "false";

    windowElement.classList.remove(
        "windowMaximized"
    );

    if (greenButton) {

        greenButton.title =
            "Maximize";
    }

    bringToFront(
        windowElement
    );

    if (
        typeof monacoEditorInstance !==
        "undefined" &&
        monacoEditorInstance &&
        windowElement.id ===
        "coding"
    ) {

        setTimeout(
            function () {

                monacoEditorInstance.layout();
            },
            50
        );
    }
}


function minimizeWindow(
    windowElement
) {

    if (!windowElement) return;

    const icon =
        getAppIconForWindow(
            windowElement
        );

    windowElement.style.display =
        "none";

    windowElement.dataset.minimized =
        "true";

    if (icon) {

        icon.classList.add(
            "appMinimized"
        );

        if (
            typeof deselectIcon ===
            "function"
        ) {

            deselectIcon(
                icon
            );
        }
    }
}


function closeWindowFromControl(
    windowElement
) {

    if (!windowElement) return;

    const icon =
        getAppIconForWindow(
            windowElement
        );

    if (
        windowElement.dataset.maximized ===
        "true"
    ) {

        restoreWindow(
            windowElement,
            null
        );
    }

    windowElement.style.display =
        "none";

    windowElement.dataset.minimized =
        "false";

    if (icon) {

        icon.classList.remove(
            "appMinimized"
        );

        if (
            typeof deselectIcon ===
            "function"
        ) {

            deselectIcon(
                icon
            );
        }
    }
}


function setupWindowControls() {

    document
        .querySelectorAll(
            ".closebutton"
        )
        .forEach(
            function (controlArea) {

                const windowElement =
                    controlArea.closest(
                        ".window"
                    );

                if (!windowElement) {
                    return;
                }

                controlArea.innerHTML =
                    "";

                controlArea.classList.add(
                    "windowControls"
                );

                const redButton =
                    document.createElement(
                        "span"
                    );

                redButton.className =
                    "windowControl windowControlRed";

                redButton.title =
                    "Close";


                const yellowButton =
                    document.createElement(
                        "span"
                    );

                yellowButton.className =
                    "windowControl windowControlYellow";

                yellowButton.title =
                    "Minimize";


                const greenButton =
                    document.createElement(
                        "span"
                    );

                greenButton.className =
                    "windowControl windowControlGreen";

                greenButton.title =
                    "Maximize";


                redButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        closeWindowFromControl(
                            windowElement
                        );
                    }
                );


                yellowButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        minimizeWindow(
                            windowElement
                        );
                    }
                );


                greenButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();

                        maximizeWindow(
                            windowElement,
                            greenButton
                        );
                    }
                );


                controlArea.appendChild(
                    redButton
                );

                controlArea.appendChild(
                    yellowButton
                );

                controlArea.appendChild(
                    greenButton
                );
            }
        );
}


setupWindowControls();