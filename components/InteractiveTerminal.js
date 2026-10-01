"use client";

import { useEffect, useRef, useState } from "react";

// ---------- Terminal themes ----------
const THEMES = [
  { name: "green", desc: "default — green on deep black" },
  { name: "matrix", desc: "digital rain vibes" },
  { name: "amber", desc: "retro phosphor" },
  { name: "dracula", desc: "purple night" },
  { name: "light", desc: "daylight paper" },
];

const COMMAND_NAMES = [
  "help", "whoami", "about", "ls", "cat", "tree", "projects", "open", "cd",
  "contact", "socials", "gui", "themes", "theme", "history", "banner",
  "echo", "date", "pwd", "clear", "hello",
];

const BANNER = ` █████╗ ██████╗ ██╗  ██╗██╗███████╗██╗  ██╗███████╗██╗  ██╗
██╔══██╗██╔══██╗██║  ██║██║██╔════╝██║  ██║██╔════╝██║ ██╔╝
███████║██████╔╝███████║██║███████╗███████║█████╗  █████╔╝
██╔══██║██╔══██╗██╔══██║██║╚════██║██╔══██║██╔══╝  ██╔═██╗
██║  ██║██████╔╝██║  ██║██║███████║██║  ██║███████╗██║  ██╗
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`;

// TODO: keep in sync with the projects in app/page.js
const PROJECTS = [
  {
    id: "01",
    name: "AI from scratch",
    desc: "Machine learning fundamentals from first principles — no black boxes.",
    link: "https://github.com/abhskyd",
  },
  {
    id: "02",
    name: "Systems playground",
    desc: "Low-level experiments in C — memory layout, pointers, processes, and system calls.",
    link: "https://github.com/abhskyd",
  },
  {
    id: "03",
    name: "Web3 explorer",
    desc: "Smart contracts and dApp experiments on the decentralized path.",
    link: "https://github.com/abhskyd",
  },
];

const TREE = `skills/
├── low-level/
│   ├── C
│   ├── C++
│   ├── Git
│   └── systems internals
├── ai/
│   ├── Python
│   ├── ML fundamentals
│   └── LLMs
├── fullstack/
│   ├── JavaScript
│   ├── TypeScript
│   ├── React
│   └── Node.js
└── web3/
    ├── Solidity
    ├── smart contracts
    └── dApps`;

const BIO = [
  "I'm a software developer driven by curiosity about how software works at",
  "every level — from bare-metal C up to full-stack applications and",
  "decentralized systems. I work in the open: learning by building,",
  "contributing to open source, and shipping projects end to end.",
];

// Render output text, turning URLs into clickable links
function renderWithLinks(text) {
  const parts = String(text).split(/(https?:\/\/[^\s|]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} className="out-link" href={part} target="_blank" rel="noopener noreferrer">
        {part.replace(/^https?:\/\//, "")}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const SECTION_MAP = {
  about: "#about", skills: "#skills", projects: "#projects",
  contact: "#contact", terminal: "#terminal", home: "#hero", "~": "#hero",
};

export default function InteractiveTerminal() {
  const [entries, setEntries] = useState([
    { type: "out", text: "welcome to my portfolio — type 'help' to explore" },
    { type: "out", text: "shortcuts: ↑/↓ history · TAB autocomplete · / focus · ESC blur", className: "dim" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [theme, setThemeState] = useState("green");
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const sectionRef = useRef(null);
  const histRef = useRef([]);

  // Restore + apply persisted theme
  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved && THEMES.some((t) => t.name === saved)) setThemeState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Mirror history into a ref so the `history` command never sees stale state
  useEffect(() => {
    histRef.current = cmdHistory;
  }, [cmdHistory]);

  // Auto-scroll to the latest line
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries]);

  // "/" focuses the terminal from anywhere; ESC blurs it
  useEffect(() => {
    function onKey(e) {
      const active = document.activeElement?.tagName;
      if (e.key === "/" && active !== "INPUT" && active !== "TEXTAREA") {
        e.preventDefault();
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        inputRef.current?.focus();
      } else if (e.key === "Escape" && active === "INPUT") {
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function run(raw) {
    const cmdline = raw.trim();
    if (!cmdline) return;
    setCmdHistory((h) => [...h, cmdline]);
    setHistIdx(-1);

    if (cmdline.toLowerCase() === "clear") {
      setEntries([]);
      return;
    }

    const lines = [{ type: "cmd", text: cmdline }];
    const [name, ...args] = cmdline.split(/\s+/);
    const cmd = name.toLowerCase();
    const push = (text, className) => lines.push({ type: "out", text, className });
    const err = (text) => push(text, "err");

    switch (cmd) {
      case "help": {
        push("available commands:", "dim");
        [
          ["help", "list available commands"],
          ["whoami", "who am i"],
          ["about", "short bio"],
          ["ls", "list files"],
          ["cat <file>", "read a file — about.txt, skills, projects, contact.txt"],
          ["tree skills/", "skills as a directory tree"],
          ["projects", "list projects"],
          ["open <id>", "open a project on GitHub (01–03)"],
          ["cd <section>", "jump to a section — about, skills, projects, contact"],
          ["contact", "ways to reach me"],
          ["socials", "social links"],
          ["gui", "back to the normal site (scroll top)"],
          ["themes", "list terminal themes"],
          ["theme <name>", "switch theme"],
          ["history", "command history"],
          ["banner", "big ascii hello"],
          ["echo <text>", "say it back"],
          ["date", "current date"],
          ["pwd", "where are we"],
          ["clear", "clear the screen"],
        ].forEach(([n, d]) => push(`  ${n.padEnd(14)}${d}`));
        push("shortcuts: ↑/↓ history · TAB autocomplete · / focus · ESC blur", "dim");
        break;
      }
      case "whoami":
        push("Abhishek — software developer (low-level systems · AI · full-stack · web3)");
        break;
      case "about":
        BIO.forEach((line) => push(line));
        break;
      case "ls":
        push("about.txt   skills/   projects/   contact.txt");
        break;
      case "cat": {
        const file = (args[0] ?? "").replace(/\/$/, "").toLowerCase();
        if (file === "about.txt") BIO.forEach((line) => push(line));
        else if (file === "skills") push("low-level: C, C++, Git | ai: Python, ML | fullstack: JS, TS, React, Node | web3: Solidity");
        else if (file === "projects") PROJECTS.forEach((p) => push(`${p.id}  ${p.name} — ${p.desc}`));
        else if (file === "contact.txt") {
          push("github: https://github.com/abhskyd");
          push("x:      https://x.com/abhshekydv");
        } else err(`cat: ${args[0] ?? ""}: no such file or directory — try 'ls'`);
        break;
      }
      case "tree":
        push(TREE);
        break;
      case "projects":
        PROJECTS.forEach((p) => {
          push(`${p.id}  ${p.name}`);
          push(`     ${p.desc}`, "dim");
          push(`     ${p.link}  (or: open ${p.id})`, "dim");
        });
        break;
      case "open": {
        const q = (args[0] ?? "").toLowerCase();
        const p = PROJECTS.find((x) => x.id === q || x.name.toLowerCase().includes(q));
        if (!p) {
          err(`no project '${args[0] ?? ""}' — try 'projects'`);
        } else {
          window.open(p.link, "_blank", "noopener");
          push(`opening ${p.name}…`);
        }
        break;
      }
      case "cd": {
        const target = SECTION_MAP[(args[0] ?? "").toLowerCase()];
        if (!target) {
          err(`cd: ${args[0] ?? ""}: no such section — try: about, skills, projects, contact`);
        } else {
          document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
          push(`→ ${args[0].toLowerCase()}`, "dim");
        }
        break;
      }
      case "contact":
      case "socials":
        push("github: https://github.com/abhskyd");
        push("x:      https://x.com/abhshekydv");
        break;
      case "gui":
        document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" });
        push("back to the gui — enjoy the view", "dim");
        break;
      case "themes":
        THEMES.forEach((t) => push(`  ${t.name.padEnd(10)}${t.desc}`));
        push("usage: theme <name>", "dim");
        break;
      case "theme": {
        const t = THEMES.find((x) => x.name === (args[0] ?? "").toLowerCase());
        if (!t) {
          err(`no theme '${args[0] ?? ""}' — try 'themes'`);
        } else {
          setThemeState(t.name);
          window.localStorage.setItem("portfolio-theme", t.name);
          push(`theme set to '${t.name}'`);
        }
        break;
      }
      case "history":
        if (histRef.current.length) {
          histRef.current.forEach((h, i) => push(`  ${String(i + 1).padStart(3)}  ${h}`, "dim"));
        } else {
          push("no history yet", "dim");
        }
        break;
      case "banner":
        push(BANNER);
        break;
      case "echo":
        push(args.join(" "));
        break;
      case "date":
        push(new Date().toString());
        break;
      case "pwd":
        push("/home/abhishek/portfolio");
        break;
      case "hello":
      case "hi":
        push("hello, visitor! type 'help' to explore");
        break;
      default:
        if (cmd.startsWith("sudo")) {
          err("permission denied — nice try though");
        } else {
          err(`command not found: ${name} — try 'help'`);
        }
    }

    setEntries((prev) => [...prev, ...lines]);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      // Walk backwards through history
      e.preventDefault();
      if (!cmdHistory.length) return;
      const idx = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx]);
    } else if (e.key === "ArrowDown") {
      // Walk forwards; past the end returns to a fresh prompt
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= cmdHistory.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(cmdHistory[idx]);
      }
    } else if (e.key === "Tab" || (e.ctrlKey && e.key.toLowerCase() === "i")) {
      // Autocomplete to the first matching command
      e.preventDefault();
      const value = input.trim().toLowerCase();
      if (!value) return;
      const match = COMMAND_NAMES.find((c) => c.startsWith(value));
      if (match) setInput(match + " ");
    }
  }

  return (
    <div className="term term-interactive" ref={sectionRef} onClick={() => inputRef.current?.focus()}>
      <div className="term-bar">
        <span className="dot dot-red" />
        <span className="dot dot-amber" />
        <span className="dot dot-green" />
        <span className="term-title">visitor@portfolio: ~</span>
      </div>
      <div className="term-body" ref={bodyRef} style={{ maxHeight: "340px", overflowY: "auto" }}>
        {entries.map((e, i) =>
          e.type === "cmd" ? (
            <div key={i} className="line">
              <span className="p-user">visitor@portfolio</span>
              <span className="p-sep">:</span>
              <span className="p-path">~</span>
              <span className="p-dollar">$ </span>
              <span>{e.text}</span>
            </div>
          ) : (
            <div key={i} className={`line line-out ${e.className ?? ""}`}>
              {renderWithLinks(e.text)}
            </div>
          )
        )}
        <div className="line">
          <span className="p-user">visitor@portfolio</span>
          <span className="p-sep">:</span>
          <span className="p-path">~</span>
          <span className="p-dollar">$ </span>
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Type a command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
