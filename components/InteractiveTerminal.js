"use client";

import { useEffect, useRef, useState } from "react";

// Commands visitors can run. Values are strings; "date" and "echo" are
// special-cased in run().
const COMMANDS = {
  help: "available commands: whoami, ls, skills, projects, contact, date, echo, clear",
  whoami: "Abhishek — software developer (low-level systems · AI · full-stack · web3)",
  ls: "about.txt   skills/   projects/   contact.txt",
  skills: "low-level: C, C++, Git | ai: Python, ML | fullstack: JS, TS, React, Node | web3: Solidity",
  projects: "01-ai-from-scratch · 02-systems-playground · 03-web3-explorer — see the Projects section",
  contact: "github: github.com/abhskyd | x: x.com/abhshekydv",
};

export default function InteractiveTerminal() {
  const [entries, setEntries] = useState([
    { type: "out", text: "welcome — type 'help' to see available commands" },
  ]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    if (cmd === "clear") {
      setEntries([]);
      return;
    }
    const out = [];
    out.push({ type: "cmd", text: cmd });
    if (cmd === "date") {
      out.push({ type: "out", text: new Date().toString() });
    } else if (cmd.startsWith("echo ")) {
      out.push({ type: "out", text: cmd.slice(5) });
    } else {
      const c = COMMANDS[cmd.toLowerCase()];
      out.push({
        type: "out",
        text: c ?? `command not found: ${cmd} — try 'help'`,
      });
    }
    setEntries((prev) => [...prev, ...out]);
  }

  // Auto-scroll to the latest line
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries]);

  function onKeyDown(e) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    }
  }

  return (
    <div className="term term-interactive" onClick={() => inputRef.current?.focus()}>
      <div className="term-bar">
        <span className="dot dot-red" />
        <span className="dot dot-amber" />
        <span className="dot dot-green" />
        <span className="term-title">visitor@portfolio: ~</span>
      </div>
      <div className="term-body" ref={bodyRef} style={{ maxHeight: "320px", overflowY: "auto" }}>
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
            <div key={i} className="line line-out">{e.text}</div>
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
