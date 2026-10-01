import HeroTerminal from "@/components/HeroTerminal";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import ScrollReveal from "@/components/ScrollReveal";

// TODO: replace these placeholder projects with your real ones
const PROJECTS = [
  {
    id: "01",
    path: "projects/01-ai-from-scratch",
    name: "AI from scratch",
    desc: "Machine learning fundamentals from first principles — no black boxes.",
    tech: ["Python", "NumPy", "LLMs"],
    link: "https://github.com/abhskyd",
  },
  {
    id: "02",
    path: "projects/02-systems-playground",
    name: "Systems playground",
    desc: "Low-level experiments in C — memory layout, pointers, processes, and system calls.",
    tech: ["C", "Make", "gdb"],
    link: "https://github.com/abhskyd",
  },
  {
    id: "03",
    path: "projects/03-web3-explorer",
    name: "Web3 explorer",
    desc: "Smart contracts and dApp experiments on the decentralized path.",
    tech: ["Solidity", "JavaScript", "Hardhat"],
    link: "https://github.com/abhskyd",
  },
];

function TermBar({ title }) {
  return (
    <div className="term-bar">
      <span className="dot dot-red" />
      <span className="dot dot-amber" />
      <span className="dot dot-green" />
      <span className="term-title">{title}</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <ScrollReveal />

      <nav className="nav">
        <a className="nav-logo" href="#hero">~/abhishek</a>
        <ul className="nav-links">
          <li><a href="#about">about</a></li>
          <li><a href="#skills">skills</a></li>
          <li><a href="#projects">projects</a></li>
          <li><a href="#contact">contact</a></li>
          <li><a href="#terminal">terminal</a></li>
        </ul>
      </nav>

      <header id="hero" className="hero">
        <HeroTerminal />
        <div className="hero-cta">
          <a className="btn btn-primary" href="#projects">./view_projects.sh</a>
          <a className="btn btn-ghost" href="https://github.com/abhskyd" target="_blank" rel="noopener" aria-label="Abhishek on GitHub">github &#8599;</a>
          <a className="btn btn-ghost" href="https://x.com/abhshekydv" target="_blank" rel="noopener" aria-label="Abhishek on X">x &#8599;</a>
        </div>
      </header>

      <section id="about">
        <div className="sec-head"><span className="sec-cmd">$ cat about.txt</span></div>
        <div className="term" data-reveal>
          <TermBar title="about.txt" />
          <div className="term-body">
            <p>
              I'm a software developer driven by curiosity about how software works at
              every level — from bare-metal C up to full-stack applications and
              decentralized systems.
            </p>
            <p>
              I work in the open: learning by building, contributing to open source,
              and shipping projects end to end.
            </p>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="sec-head"><span className="sec-cmd">$ tree skills/</span></div>
        <div className="term" data-reveal>
          <TermBar title="skills — directory tree" />
          <div className="term-body">
            <pre className="tree">
{`skills/
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
    └── dApps`}
            </pre>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="sec-head"><span className="sec-cmd">$ ls projects/</span></div>
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <article className="project" data-reveal key={p.id}>
              <div className="project-path">{p.path}</div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="project-foot">
                <div className="langs">
                  {p.tech.map((t) => <span key={t}>{t} </span>)}
                </div>
                <a className="project-link" href={p.link} target="_blank" rel="noopener">view &#8599;</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="sec-head"><span className="sec-cmd">$ contact --list</span></div>
        <div className="term" data-reveal>
          <TermBar title="contact — available channels" />
          <div className="term-body">
            <div className="contact-line">
              <span className="key">github</span>
              <span className="val"><a href="https://github.com/abhskyd" target="_blank" rel="noopener">github.com/abhskyd &#8599;</a></span>
            </div>
            <div className="contact-line">
              <span className="key">x</span>
              <span className="val"><a href="https://x.com/abhshekydv" target="_blank" rel="noopener">x.com/abhshekydv &#8599;</a></span>
            </div>
            <div className="contact-line">
              <span className="key">site</span>
              <span className="val">abhskyd.github.io</span>
            </div>
          </div>
        </div>
      </section>

      <section id="terminal">
        <div className="sec-head"><span className="sec-cmd">$ ./interactive.sh</span></div>
        <p className="sec-desc">
          A tiny shell — type <code>help</code>, use ↑/↓ for history, TAB to autocomplete.{' '}
          Try <code>theme matrix</code> or <code>cd projects</code>.
        </p>
        <InteractiveTerminal />
      </section>

      <footer>© 2026 Abhishek · built with Next.js</footer>
    </>
  );
}
