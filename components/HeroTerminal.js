"use client";

import { useEffect, useState } from "react";

const SEQUENCE = [
  { cmd: "whoami", out: "Abhishek — Software Developer" },
  { cmd: "cat focus.txt", out: "low-level systems · AI · full-stack · web3" },
  { cmd: "./status.sh", out: "open to collaboration — find me on GitHub / X" },
];

export default function HeroTerminal() {
  const [history, setHistory] = useState([]); // completed {cmd, out}
  const [typed, setTyped] = useState(""); // current command, typed char by char
  const [outputShown, setOutputShown] = useState(false);
  const [staticMode, setStaticMode] = useState(false);

  // Reduced motion: show the full sequence instantly, no typing loop
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHistory(SEQUENCE);
      setStaticMode(true);
    }
  }, []);

  useEffect(() => {
    if (staticMode) return;
    // Sequence runs once, then holds — no looping
    if (history.length >= SEQUENCE.length) return;
    const current = SEQUENCE[history.length];

    if (!outputShown) {
      // Type the command character by character
      if (typed.length < current.cmd.length) {
        const t = setTimeout(
          () => setTyped(current.cmd.slice(0, typed.length + 1)),
          55 + Math.random() * 45
        );
        return () => clearTimeout(t);
      }
      // Command finished — show its output after a short beat
      const t = setTimeout(() => setOutputShown(true), 350);
      return () => clearTimeout(t);
    }

    // Output shown — pause, then move to the next command
    const t = setTimeout(() => {
      setHistory((h) => [...h, current]);
      setTyped("");
      setOutputShown(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [history, typed, outputShown, staticMode]);

  const current = SEQUENCE[history.length % SEQUENCE.length];

  return (
    <div className="term">
      <div className="term-bar">
        <span className="dot dot-red" />
        <span className="dot dot-amber" />
        <span className="dot dot-green" />
        <span className="term-title">abhishek@portfolio: ~</span>
      </div>
      <div className="term-body">
        {history.map((h, i) => (
          <div key={i}>
            <div className="line">
              <span className="p-user">abhishek@portfolio</span>
              <span className="p-sep">:</span>
              <span className="p-path">~</span>
              <span className="p-dollar">$ </span>
              <span>{h.cmd}</span>
            </div>
            <div className="line line-out">{h.out}</div>
          </div>
        ))}
        <div className="line">
          <span className="p-user">abhishek@portfolio</span>
          <span className="p-sep">:</span>
          <span className="p-path">~</span>
          <span className="p-dollar">$ </span>
          <span>{typed}</span>
          <span className="cursor" />
        </div>
        {outputShown && <div className="line line-out">{current.out}</div>}
      </div>
    </div>
  );
}
