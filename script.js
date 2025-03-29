const methods = [{name: "Beautify json", func: text => JSON.stringify(JSON.parse(text), null, 1)},
                 {name: "Convert from Base64", func: text => atob(text)},
                 {name: "Convert to Base64", func: text => btoa(text)},
                 {name: "Convert to list", func: text => text.trim().replace(/\s+/g, "\n")},
                 {name: "Convert to lower case", func: text => text.toLowerCase()},
                 {name: "Convert to single line", func: text => text.replace(/\n+/g, " ").trim()},
                 {name: "Convert to upper case", func: text => text.toUpperCase()},
                 {name: "Remove duplicate lines", func: text => Array.from(new Set(text.split("\n"))).join("\n")},
                 {name: "Remove empty lines", func: text => text.split("\n").filter(line => /[^\s]/.test(line)).join("\n")},
                 {name: "Remove redundant spaces", func: text => text.trim().replace(/[\t ]+/g, " ")},
                 {name: "Remove spaces", func: text => text.replace(/[\t ]+/g, "")},
                 {name: "Replace", func: (text, repl) => repl},
                 {name: "Reverse list", func: text => text.split("\n").reverse().join("\n")},
                 {name: "Sort list", func: text => text.split("\n").sort(new Intl.Collator(undefined, {numeric: true, sensitivity: "base"}).compare).join("\n")},
                 {name: "Uglify json", func: text => JSON.stringify(JSON.parse(text), null, 0)}
                ];

const o = {methods : []};

function pushMethod() {
    const name = document.getElementById("methodNames").value;
    if(!methods.find(method => method.name === name)) return;
    const regex = document.getElementById("regex").value;
    const global = document.getElementById("global").checked;
    const caseIns = document.getElementById("caseIns").checked;
    const repl = name === "Replace" ? document.getElementById("repl").value : null;
    o.methods.push({name: name, regex: regex, global: global, caseIns: caseIns, repl: repl});
    document.getElementById("methods").value = JSON.stringify(o, null, 1);
}

function popMethod() {
    o.methods.pop();
    document.getElementById("methods").value = JSON.stringify(o, null, 1);
}

function clearMethods() {
    o.methods = [];
    document.getElementById("methods").value = JSON.stringify(o, null, 1);
}

function setInputHandler(check) {
    const input = document.getElementById("input");
    if(check.checked) input.addEventListener("input", process);
    else input.removeEventListener("input", process);
}

function getRegex(regex, global, caseIns) {
    if(global && caseIns) return new RegExp(regex, "gi");
    if(global && !caseIns) return new RegExp(regex, "g");
    if(!global && caseIns) return new RegExp(regex, "i");
    return new RegExp(regex);
}

async function process() {
    let text = document.getElementById("input").value;
    for(const entry of o.methods) {
        const method = methods.find(method => method.name === entry.name);
        if(!method) continue;
        const regex = getRegex(entry.regex, entry.global, entry.caseIns);
        text = text.replace(regex, match => method.func(match, entry.repl));
    }
    const output = document.getElementById("output");
    output.value = text;
    if(document.getElementById("copy").checked) await navigator.clipboard.writeText(output.value);
}

function initGui() {
    const methodNames = document.getElementById("methodNames");
    for(const method of methods) {
        const option = document.createElement("option");
        option.textContent = method.name;
        option.value = option.textContent;
        methodNames.appendChild(option);
    }
    document.getElementById("setHandler").addEventListener("change", ev => setInputHandler(ev.target));
    document.querySelector("input[type='button'][value='Push method']").addEventListener("click", pushMethod);
    document.querySelector("input[type='button'][value='Pop method']").addEventListener("click", popMethod);
    document.querySelector("input[type='button'][value='Clear methods']").addEventListener("click", clearMethods);
    document.querySelector("input[type='button'][value='Process']").addEventListener("click", process);
}

initGui();