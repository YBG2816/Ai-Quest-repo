import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const INFRA_LAYERS = [
  {
    id: "foundation",
    label: "Foundation Layer",
    emoji: "🏗️",
    color: "#ff6b35",
    desc: "The bedrock. Massive compute infrastructure owned by cloud giants. Without this, nothing runs.",
    nodes: [
      { name: "Google Cloud", emoji: "☁️", role: "Runs AI models at global scale. Powers Gemini & millions of apps.", tag: "Infrastructure" },
      { name: "Amazon AWS", emoji: "🟠", role: "World's largest cloud. Hosts most of the internet's AI workloads.", tag: "Infrastructure" },
      { name: "Microsoft Azure", emoji: "🔷", role: "Powers OpenAI's GPT models. Deep enterprise AI integration.", tag: "Infrastructure" },
      { name: "NVIDIA GPUs", emoji: "🟢", role: "The physical chips that train and run AI models. The oil of the AI era.", tag: "Hardware" },
    ],
  },
  {
    id: "models",
    label: "AI Model Layer",
    emoji: "🧠",
    color: "#7c6cfc",
    desc: "The brains. Companies that research, train, and host large AI models. These are the engines.",
    nodes: [
      { name: "Anthropic", emoji: "🤖", role: "Builds Claude. Focused on safe, helpful AI. Uses Constitutional AI training.", tag: "Safety-first AI" },
      { name: "OpenAI", emoji: "⚡", role: "Builds GPT & DALL·E. Pioneered large language models for the public.", tag: "Generative AI" },
      { name: "Google DeepMind", emoji: "🌀", role: "Research powerhouse. Builds Gemini. Invented transformers (the tech behind all LLMs).", tag: "Research AI" },
      { name: "Meta AI", emoji: "🦙", role: "Builds Llama (open source). Makes AI free for anyone to download and run.", tag: "Open Source AI" },
      { name: "Mistral", emoji: "💨", role: "European open-weight models. Lightweight, fast, runs on smaller hardware.", tag: "Efficient AI" },
    ],
  },
  {
    id: "api",
    label: "API / Gateway Layer",
    emoji: "🔌",
    color: "#00f5c4",
    desc: "The bridge. APIs let your app talk to AI models without touching the underlying infrastructure. This is where YOU connect.",
    nodes: [
      { name: "Anthropic API", emoji: "🤖", role: "Send a message → get a Claude response. That's it. Charges per token used.", tag: "Text & Reasoning" },
      { name: "OpenAI API", emoji: "⚡", role: "Access GPT-4, DALL·E, Whisper & more. Most widely used AI API in the world.", tag: "Multi-modal" },
      { name: "Hugging Face", emoji: "🤗", role: "Hub for thousands of open models. Free to use many. Great for experimentation.", tag: "Open Models" },
      { name: "Replicate", emoji: "🔁", role: "Run any open-source model with one API call. No server setup needed.", tag: "Any Model" },
      { name: "Vertex AI", emoji: "☁️", role: "Google's unified AI API layer. Access Gemini + many other models in one place.", tag: "Google Suite" },
    ],
  },
  {
    id: "orchestration",
    label: "Orchestration Layer",
    emoji: "🎛️",
    color: "#ffc93c",
    desc: "The conductor. Tools that chain AI calls together, add memory, search the web, use tools, and build complex workflows.",
    nodes: [
      { name: "LangChain", emoji: "🔗", role: "Chain prompts, memory, tools & APIs together. Like lego bricks for AI workflows.", tag: "Workflow Builder" },
      { name: "LlamaIndex", emoji: "🦙", role: "Connect AI to YOUR data. Upload docs, PDFs, databases — AI can now answer from them.", tag: "Data + AI" },
      { name: "n8n / Make", emoji: "⚙️", role: "No-code automation. Trigger AI flows from emails, forms, Slack — no coding needed.", tag: "No-Code" },
      { name: "Flowise", emoji: "🌊", role: "Visual drag-and-drop AI flow builder. See your pipeline as a diagram.", tag: "Visual Builder" },
    ],
  },
  {
    id: "interface",
    label: "Interface Layer",
    emoji: "🖥️",
    color: "#ff5e6c",
    desc: "What people actually see and touch. The apps, chatbots, and tools built ON TOP of everything below.",
    nodes: [
      { name: "Claude.ai", emoji: "🤖", role: "Anthropic's consumer app. Built on the Anthropic API. The face of Claude.", tag: "Chat Interface" },
      { name: "ChatGPT", emoji: "💬", role: "OpenAI's app. The most-used AI interface on earth. Built on GPT models.", tag: "Chat Interface" },
      { name: "Your App 🚀", emoji: "✨", role: "YOU call an API, add your logic, build your UI. This is where your idea lives.", tag: "Built by You" },
      { name: "Webflow / Bubble", emoji: "🎨", role: "No-code builders. Connect AI APIs visually. Ship products without writing code.", tag: "No-Code App" },
      { name: "VS Code / Cursor", emoji: "💻", role: "AI-enhanced code editors. Copilot, Claude, GPT assist you as you write code.", tag: "Dev Tools" },
    ],
  },
];

const FLOW_STEPS = [
  {
    id: 1,
    emoji: "💡",
    title: "You have an idea",
    desc: "\"I want to build an app that summarises news articles for me.\"",
    detail: "Every product starts here. A problem worth solving. You don't need to build the AI — you just need to use it.",
    color: "#ffc93c",
  },
  {
    id: 2,
    emoji: "🔑",
    title: "Get an API key",
    desc: "Sign up at anthropic.com, openai.com, or any AI provider. Get your secret key.",
    detail: "An API key is like a password that lets your app talk to the AI. Keep it secret — never share it publicly.",
    color: "#7c6cfc",
  },
  {
    id: 3,
    emoji: "📡",
    title: "Make your first API call",
    desc: "Your app sends a message (prompt) to the AI over the internet.",
    detail: "You send: a system prompt (personality/instructions) + the user's message. The AI sends back a response. That's the whole loop.",
    color: "#00f5c4",
  },
  {
    id: 4,
    emoji: "🧩",
    title: "Add your logic",
    desc: "Format the response. Save to a database. Trigger actions. Make it yours.",
    detail: "AI gives you raw intelligence. YOU decide what to do with it — show it in a UI, email it, store it, chain another AI call.",
    color: "#ff6b35",
  },
  {
    id: 5,
    emoji: "🎨",
    title: "Build the interface",
    desc: "Wrap it in a UI people can actually use. Web, mobile, Slack bot — your call.",
    detail: "Use React, Webflow, Bubble, or any tool. The AI is invisible infrastructure. Users just see YOUR product.",
    color: "#ff5e6c",
  },
  {
    id: 6,
    emoji: "🚀",
    title: "Ship & iterate",
    desc: "Deploy it. Get feedback. Improve your prompts and logic. Repeat.",
    detail: "Prompt engineering is a real skill — how you word your instructions massively changes output quality. Iterate fast.",
    color: "#00c2ff",
  },
];

const STACK_EXAMPLES = [
  {
    name: "AI Chatbot",
    emoji: "💬",
    color: "#7c6cfc",
    stack: [
      { layer: "UI", tool: "React / Next.js", role: "Chat window the user sees" },
      { layer: "API", tool: "Anthropic API", role: "Claude answers questions" },
      { layer: "Memory", tool: "Upstash Redis", role: "Remembers conversation history" },
      { layer: "Deploy", tool: "Vercel", role: "Hosts the app, free tier available" },
    ],
  },
  {
    name: "Document Q&A",
    emoji: "📄",
    color: "#00f5c4",
    stack: [
      { layer: "UI", tool: "Bubble (no-code)", role: "Upload PDF, ask questions" },
      { layer: "Process", tool: "LlamaIndex", role: "Breaks doc into searchable chunks" },
      { layer: "AI", tool: "OpenAI API", role: "Answers from the doc content" },
      { layer: "Storage", tool: "Pinecone", role: "Vector DB stores doc knowledge" },
    ],
  },
  {
    name: "Automated Newsletter",
    emoji: "📰",
    color: "#ffc93c",
    stack: [
      { layer: "Trigger", tool: "n8n (no-code)", role: "Runs every morning at 7am" },
      { layer: "Data", tool: "RSS Feeds / APIs", role: "Grabs latest news" },
      { layer: "AI", tool: "Anthropic API", role: "Summarises & formats content" },
      { layer: "Send", tool: "Mailchimp API", role: "Emails subscribers automatically" },
    ],
  },
  {
    name: "AI Image Generator",
    emoji: "🎨",
    color: "#ff6b35",
    stack: [
      { layer: "UI", tool: "Webflow", role: "Form where user enters a prompt" },
      { layer: "AI", tool: "OpenAI DALL·E 3", role: "Generates the image from text" },
      { layer: "Storage", tool: "Cloudinary", role: "Stores and serves images" },
      { layer: "Auth", tool: "Clerk", role: "User accounts & billing limits" },
    ],
  },
];

// ─────────────────────────────────────────────
// GAME LEVELS (from v1)
// ─────────────────────────────────────────────
const LEVELS = [
  { id: 1, title: "What is AI?", type: "quiz", icon: "🤖", xp: 100, question: "What does AI stand for?", options: ["Automated Interface", "Artificial Intelligence", "Advanced Internet", "Automatic Input"], correct: 1, explanation: "AI stands for Artificial Intelligence — machines designed to simulate human-like thinking and problem solving." },
  { id: 2, title: "AI in Daily Life", type: "match", icon: "🌍", xp: 150, prompt: "Match each AI tool to its real-world use:", pairs: [{ item: "ChatGPT", match: "Writing & answering questions" }, { item: "Google Maps", match: "Route prediction & traffic" }, { item: "Spotify", match: "Music recommendations" }, { item: "Face ID", match: "Face recognition security" }] },
  { id: 3, title: "Spot the AI", type: "quiz", icon: "🔍", xp: 100, question: "Which of these is NOT an example of AI being used?", options: ["Netflix recommending shows", "A calculator adding numbers", "Siri answering a question", "Gmail filtering spam"], correct: 1, explanation: "A basic calculator follows fixed rules — it doesn't learn or adapt. That's not AI. The others all use machine learning!" },
  { id: 4, title: "Ethics & AI", type: "scenario", icon: "⚖️", xp: 200, scenario: "A company uses AI to screen job applications. The AI was trained mostly on data from male candidates and starts rejecting female applicants unfairly.", question: "What is the main problem here?", options: ["The AI is working too slowly", "The AI has a bias from biased training data", "The company needs a better computer", "AI should never be used in hiring"], correct: 1, explanation: "This is called AI bias. When training data is unbalanced or unfair, the AI learns and repeats those unfair patterns." },
  { id: 5, title: "How AI Learns", type: "match", icon: "🧠", xp: 150, prompt: "Drag each term to its correct definition:", pairs: [{ item: "Training Data", match: "Examples used to teach the AI" }, { item: "Model", match: "The AI after it has learned" }, { item: "Prediction", match: "The AI's output or answer" }, { item: "Overfitting", match: "AI memorizes instead of generalizing" }] },
  { id: 6, title: "Using AI Wisely", type: "scenario", icon: "💡", xp: 200, scenario: "You're writing an essay and ask an AI chatbot for help. It gives you a confident answer that sounds great — but you suspect it might not be accurate.", question: "What's the best thing to do?", options: ["Trust the AI — it's always right", "Verify the facts using reliable sources", "Ignore the AI and start over", "Ask the AI the same question again"], correct: 1, explanation: "AI can 'hallucinate' — generate confident-sounding but false information. Always verify important facts from trusted sources!" },
];

const BADGES = [
  { id: "first_win", label: "First Step", icon: "🌱", desc: "Complete your first level" },
  { id: "half_way", label: "Halfway Hero", icon: "⚡", desc: "Complete 3 levels" },
  { id: "ai_master", label: "AI Master", icon: "🏆", desc: "Complete all levels" },
  { id: "perfect", label: "Perfectionist", icon: "💎", desc: "Get 3 correct in a row" },
];

// ─────────────────────────────────────────────
// QUIZ / MATCH / SCENARIO COMPONENTS
// ─────────────────────────────────────────────
function QuizLevel({ level, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const handle = (i) => { if (revealed) return; setSelected(i); setRevealed(true); setTimeout(() => onComplete(i === level.correct), 1800); };
  return (
    <div className="level-body">
      <p className="question-text">{level.question}</p>
      <div className="options-grid">
        {level.options.map((opt, i) => {
          let cls = "option-btn";
          if (revealed) { if (i === level.correct) cls += " correct"; else if (i === selected) cls += " wrong"; }
          return <button key={i} className={cls} onClick={() => handle(i)}><span className="opt-letter">{String.fromCharCode(65 + i)}</span>{opt}</button>;
        })}
      </div>
      {revealed && <div className={`explanation ${selected === level.correct ? "exp-good" : "exp-bad"}`}><span>{selected === level.correct ? "✅ Correct!" : "❌ Not quite."}</span><p>{level.explanation}</p></div>}
    </div>
  );
}

function MatchLevel({ level, onComplete }) {
  const items = level.pairs.map(p => p.item);
  const [shuffledMatches] = useState(() => [...level.pairs.map(p => p.match)].sort(() => Math.random() - 0.5));
  const [connections, setConnections] = useState({});
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const selectItem = (item) => { if (done || connections[item]) return; setSelected({ type: "item", val: item }); };
  const selectMatch = (match) => {
    if (done) return;
    if (selected?.type === "item") {
      const newConn = { ...connections, [selected.val]: match };
      setConnections(newConn); setSelected(null);
      if (Object.keys(newConn).length === level.pairs.length) {
        const allCorrect = level.pairs.every(p => newConn[p.item] === p.match);
        setDone(true); setTimeout(() => onComplete(allCorrect), 1500);
      }
    } else setSelected({ type: "match", val: match });
  };
  const isCorrect = (item) => connections[item] === level.pairs.find(p => p.item === item)?.match;
  return (
    <div className="level-body">
      <p className="question-text">{level.prompt}</p>
      <div className="match-container">
        <div className="match-col">{items.map(item => <button key={item} className={`match-btn item-btn ${selected?.val === item ? "sel" : ""} ${connections[item] ? (isCorrect(item) ? "correct" : "wrong") : ""}`} onClick={() => selectItem(item)}>{item}</button>)}</div>
        <div className="match-arrows">{items.map(item => <div key={item} className="arrow-row">{connections[item] ? <span className={isCorrect(item) ? "arr-correct" : "arr-wrong"}>{isCorrect(item) ? "✓" : "✗"}</span> : <span className="arr-empty">→</span>}</div>)}</div>
        <div className="match-col">{shuffledMatches.map(m => <button key={m} className={`match-btn match-def-btn ${selected?.val === m ? "sel" : ""} ${Object.values(connections).includes(m) ? "used" : ""}`} onClick={() => selectMatch(m)}>{m}</button>)}</div>
      </div>
      {done && <div className="explanation exp-good"><span>✅ Matched!</span></div>}
    </div>
  );
}

function ScenarioLevel({ level, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const handle = (i) => { if (revealed) return; setSelected(i); setRevealed(true); setTimeout(() => onComplete(i === level.correct), 1800); };
  return (
    <div className="level-body">
      <div className="scenario-box"><span className="scenario-label">📖 Scenario</span><p>{level.scenario}</p></div>
      <p className="question-text">{level.question}</p>
      <div className="options-grid">
        {level.options.map((opt, i) => {
          let cls = "option-btn";
          if (revealed) { if (i === level.correct) cls += " correct"; else if (i === selected) cls += " wrong"; }
          return <button key={i} className={cls} onClick={() => handle(i)}><span className="opt-letter">{String.fromCharCode(65 + i)}</span>{opt}</button>;
        })}
      </div>
      {revealed && <div className={`explanation ${selected === level.correct ? "exp-good" : "exp-bad"}`}><span>{selected === level.correct ? "✅ Great thinking!" : "❌ Not quite."}</span><p>{level.explanation}</p></div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// INFRASTRUCTURE EXPLORER
// ─────────────────────────────────────────────
function InfraExplorer() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  return (
    <div className="infra-explorer">
      <div className="infra-intro">
        <p className="infra-subtitle">Click any layer to explore. This is the real skeleton of the AI world.</p>
      </div>

      {/* Stack diagram */}
      <div className="stack-diagram">
        {[...INFRA_LAYERS].reverse().map((layer, ri) => {
          const i = INFRA_LAYERS.length - 1 - ri;
          const isActive = activeLayer?.id === layer.id;
          return (
            <div key={layer.id}>
              <button
                className={`layer-row ${isActive ? "layer-active" : ""}`}
                style={{ "--lc": layer.color, animationDelay: `${i * 0.08}s` }}
                onClick={() => { setActiveLayer(isActive ? null : layer); setActiveNode(null); }}
              >
                <span className="layer-emoji">{layer.emoji}</span>
                <div className="layer-info">
                  <span className="layer-name">{layer.label}</span>
                  <span className="layer-count">{layer.nodes.length} players</span>
                </div>
                <span className="layer-chevron">{isActive ? "▲" : "▼"}</span>
              </button>

              {isActive && (
                <div className="layer-expanded">
                  <p className="layer-desc">{layer.desc}</p>
                  <div className="nodes-grid">
                    {layer.nodes.map(node => (
                      <button
                        key={node.name}
                        className={`node-card ${activeNode?.name === node.name ? "node-active" : ""}`}
                        style={{ "--lc": layer.color }}
                        onClick={() => setActiveNode(activeNode?.name === node.name ? null : node)}
                      >
                        <span className="node-emoji">{node.emoji}</span>
                        <span className="node-name">{node.name}</span>
                        <span className="node-tag" style={{ color: layer.color }}>{node.tag}</span>
                      </button>
                    ))}
                  </div>
                  {activeNode && (
                    <div className="node-detail" style={{ borderColor: layer.color }}>
                      <span className="nd-emoji">{activeNode.emoji}</span>
                      <div>
                        <strong>{activeNode.name}</strong>
                        <p>{activeNode.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* How they connect */}
      <div className="connect-hint">
        <span>🔁</span>
        <p>Each layer <strong>builds on the one below it</strong>. Your app sits at the top — powered by everything beneath without you needing to touch it.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// API FLOW VISUALISER
// ─────────────────────────────────────────────
function FlowVisualiser() {
  const [activeStep, setActiveStep] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  return (
    <div className="flow-vis">
      <p className="infra-subtitle">This is the exact journey from your idea to a working AI product. Tap each step.</p>

      <div className="flow-steps">
        {FLOW_STEPS.map((step, i) => (
          <div key={step.id} className="flow-step-wrap" style={{ animationDelay: `${i * 0.1}s` }}>
            <button
              className={`flow-step-btn ${activeStep?.id === step.id ? "fstep-active" : ""}`}
              style={{ "--sc": step.color }}
              onClick={() => setActiveStep(activeStep?.id === step.id ? null : step)}
            >
              <div className="fstep-num" style={{ background: step.color }}>{step.id}</div>
              <span className="fstep-emoji">{step.emoji}</span>
              <div className="fstep-text">
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
              </div>
            </button>
            {activeStep?.id === step.id && (
              <div className="fstep-detail" style={{ borderColor: step.color }}>
                💡 {step.detail}
              </div>
            )}
            {i < FLOW_STEPS.length - 1 && <div className="flow-connector">↓</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TECH STACK EXAMPLES
// ─────────────────────────────────────────────
function StackExamples() {
  const [active, setActive] = useState(0);
  const ex = STACK_EXAMPLES[active];

  return (
    <div className="stack-examples">
      <p className="infra-subtitle">Real products, real stacks. See exactly what tools wire together to make each one.</p>

      <div className="stack-tabs">
        {STACK_EXAMPLES.map((s, i) => (
          <button key={i} className={`stack-tab ${active === i ? "stab-active" : ""}`} style={{ "--sc": s.color }} onClick={() => setActive(i)}>
            <span>{s.emoji}</span> {s.name}
          </button>
        ))}
      </div>

      <div className="stack-display" style={{ "--sc": ex.color }}>
        <div className="stack-header">
          <span>{ex.emoji}</span>
          <strong>{ex.name}</strong>
        </div>
        <div className="stack-layers-list">
          {ex.stack.map((s, i) => (
            <div key={i} className="stack-layer-item" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="sli-layer">{s.layer}</div>
              <div className="sli-tool" style={{ color: ex.color }}>{s.tool}</div>
              <div className="sli-role">{s.role}</div>
            </div>
          ))}
        </div>
        <div className="stack-cta">
          <span>✨</span>
          <p>You could build this. Every tool listed has a free tier to start with.</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
const NAV_TABS = [
  { id: "game", label: "🎮 Learn AI", short: "Learn" },
  { id: "infra", label: "🏗️ Infrastructure", short: "Infra" },
  { id: "flow", label: "🔌 How to Connect", short: "Flow" },
  { id: "stacks", label: "🧩 Tech Stacks", short: "Stacks" },
];

export default function App() {
  const [tab, setTab] = useState("game");

  // Game state
  const [gameScreen, setGameScreen] = useState("home");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [levelKey, setLevelKey] = useState(0);

  const level = LEVELS[currentIdx];

  const checkBadges = (newCompleted, newStreak) => {
    const toAdd = [];
    if (newCompleted.length >= 1 && !earnedBadges.includes("first_win")) toAdd.push("first_win");
    if (newCompleted.length >= 3 && !earnedBadges.includes("half_way")) toAdd.push("half_way");
    if (newCompleted.length >= LEVELS.length && !earnedBadges.includes("ai_master")) toAdd.push("ai_master");
    if (newStreak >= 3 && !earnedBadges.includes("perfect")) toAdd.push("perfect");
    if (toAdd.length) setEarnedBadges(prev => [...prev, ...toAdd]);
  };

  const handleLevelComplete = (correct) => {
    const newStreak = correct ? streak + 1 : 0;
    const gainedXp = correct ? level.xp : Math.floor(level.xp * 0.2);
    const newCompleted = [...completed, currentIdx];
    setStreak(newStreak); setXp(x => x + gainedXp); setCompleted(newCompleted);
    checkBadges(newCompleted, newStreak);
    setTimeout(() => {
      if (currentIdx + 1 >= LEVELS.length) { setGameScreen("complete"); }
      else { setCurrentIdx(i => i + 1); setLevelKey(k => k + 1); }
    }, 2200);
  };

  const restart = () => {
    setGameScreen("home"); setCurrentIdx(0); setXp(0); setStreak(0);
    setEarnedBadges([]); setCompleted([]); setLevelKey(0);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #080c18; --card: #0f1625; --card2: #161e30;
          --accent: #00f5c4; --accent2: #7c6cfc; --danger: #ff5e6c;
          --text: #e4ebfa; --muted: #6b7fa3; --border: rgba(255,255,255,0.06);
          --glow: 0 0 28px rgba(0,245,196,0.15);
        }
        body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }

        .app-shell {
          min-height: 100vh;
          display: flex; flex-direction: column;
          background:
            radial-gradient(ellipse 70% 40% at 85% 5%, rgba(124,108,252,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 10% 95%, rgba(0,245,196,0.07) 0%, transparent 60%),
            var(--bg);
        }

        /* NAV */
        .app-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(8,12,24,0.85); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 4px;
          padding: 10px 16px; overflow-x: auto;
        }
        .nav-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: .95rem; color: var(--accent); white-space: nowrap; margin-right: 12px; }
        .nav-tab { background: none; border: none; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: .82rem; font-weight: 500; padding: 7px 12px; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: all .15s; }
        .nav-tab:hover { color: var(--text); background: var(--card2); }
        .nav-tab.ntab-active { color: var(--accent); background: rgba(0,245,196,0.1); font-weight: 600; }

        /* CONTENT */
        .tab-content { flex: 1; max-width: 720px; width: 100%; margin: 0 auto; padding: 24px 16px 48px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; margin-bottom: 6px; }
        .infra-subtitle { color: var(--muted); font-size: .92rem; line-height: 1.6; margin-bottom: 24px; }

        /* ── GAME ── */
        .home { text-align: center; animation: fadeUp .5s ease both; padding: 20px 0; }
        .home-icon { font-size: 60px; display: block; margin-bottom: 12px; }
        .home h1 { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem,5vw,2.6rem); font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .home p { color: var(--muted); margin: 12px 0 28px; font-size: 1rem; line-height: 1.6; }
        .stats-row { display: flex; gap: 10px; justify-content: center; margin-bottom: 28px; flex-wrap: wrap; }
        .stat-pill { background: var(--card2); border: 1px solid var(--border); border-radius: 40px; padding: 7px 16px; font-size: .82rem; color: var(--muted); display: flex; align-items: center; gap: 6px; }
        .stat-pill b { color: var(--text); }
        .start-btn { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #080c18; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; border: none; border-radius: 12px; padding: 14px 44px; cursor: pointer; box-shadow: var(--glow); transition: transform .15s; }
        .start-btn:hover { transform: translateY(-2px) scale(1.02); }

        .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 10px; }
        .xp-chip { background: var(--card2); border: 1px solid var(--border); border-radius: 40px; padding: 5px 14px; font-size: .82rem; font-weight: 600; color: var(--accent); }
        .streak-chip { background: var(--card2); border: 1px solid var(--border); border-radius: 40px; padding: 5px 12px; font-size: .82rem; color: #ffc93c; }
        .progress-track { background: var(--card2); border-radius: 40px; height: 7px; width: 100%; margin-bottom: 20px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 40px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width .5s ease; }
        .level-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; }
        .level-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
        .level-icon { font-size: 1.8rem; background: var(--card2); border-radius: 10px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .level-meta { flex: 1; }
        .level-meta h2 { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700; }
        .level-meta p { font-size: .78rem; color: var(--muted); margin-top: 2px; }
        .level-type-tag { font-size: .7rem; font-weight: 600; padding: 3px 9px; border-radius: 20px; text-transform: uppercase; letter-spacing: .05em; }
        .tag-quiz { background: rgba(0,245,196,0.12); color: var(--accent); }
        .tag-match { background: rgba(124,108,252,0.15); color: #a89dff; }
        .tag-scenario { background: rgba(255,196,60,0.12); color: #ffc93c; }
        .level-body { padding: 20px; }
        .question-text { font-size: 1rem; font-weight: 600; line-height: 1.5; margin-bottom: 18px; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        @media(max-width:480px){ .options-grid { grid-template-columns: 1fr; } }
        .option-btn { background: var(--card2); border: 1.5px solid var(--border); border-radius: 10px; padding: 12px 14px; text-align: left; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: .88rem; cursor: pointer; display: flex; align-items: flex-start; gap: 9px; transition: all .15s; line-height: 1.4; }
        .option-btn:hover:not(.correct):not(.wrong) { border-color: var(--accent2); background: rgba(124,108,252,0.08); transform: translateY(-1px); }
        .option-btn.correct { border-color: var(--accent); background: rgba(0,245,196,0.1); }
        .option-btn.wrong { border-color: var(--danger); background: rgba(255,94,108,0.1); }
        .opt-letter { font-weight: 700; font-size: .76rem; background: rgba(255,255,255,0.08); border-radius: 5px; padding: 2px 6px; flex-shrink: 0; margin-top: 1px; }
        .explanation { margin-top: 16px; border-radius: 10px; padding: 12px 14px; font-size: .88rem; line-height: 1.5; }
        .exp-good { background: rgba(0,245,196,0.07); border: 1px solid rgba(0,245,196,0.2); }
        .exp-bad { background: rgba(255,94,108,0.07); border: 1px solid rgba(255,94,108,0.2); }
        .explanation span { font-weight: 700; display: block; margin-bottom: 5px; }
        .scenario-box { background: var(--card2); border-left: 3px solid #ffc93c; border-radius: 9px; padding: 12px 14px; margin-bottom: 18px; font-size: .9rem; line-height: 1.6; }
        .scenario-label { font-size: .72rem; font-weight: 700; color: #ffc93c; display: block; margin-bottom: 5px; letter-spacing: .05em; text-transform: uppercase; }
        .match-container { display: grid; grid-template-columns: 1fr 36px 1fr; gap: 7px; align-items: start; }
        .match-col { display: flex; flex-direction: column; gap: 7px; }
        .match-btn { border-radius: 9px; padding: 9px 10px; font-family: 'DM Sans', sans-serif; font-size: .82rem; cursor: pointer; border: 1.5px solid var(--border); transition: all .15s; text-align: center; line-height: 1.4; }
        .item-btn { background: var(--card2); color: var(--text); }
        .item-btn.sel { border-color: var(--accent); background: rgba(0,245,196,0.09); }
        .match-def-btn { background: rgba(124,108,252,0.07); color: var(--text); }
        .match-def-btn.used { opacity: .4; pointer-events: none; }
        .match-btn.correct { border-color: var(--accent); background: rgba(0,245,196,0.1); }
        .match-btn.wrong { border-color: var(--danger); background: rgba(255,94,108,0.1); }
        .match-arrows { display: flex; flex-direction: column; gap: 7px; align-items: center; }
        .arrow-row { height: 36px; display: flex; align-items: center; font-size: .95rem; }
        .arr-empty { color: var(--muted); }
        .arr-correct { color: var(--accent); font-weight: 700; }
        .arr-wrong { color: var(--danger); font-weight: 700; }
        .badges-row { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 16px; }
        .badge { background: var(--card2); border: 1px solid var(--border); border-radius: 10px; padding: 7px 12px; font-size: .78rem; display: flex; align-items: center; gap: 6px; }
        .badge.earned { border-color: rgba(0,245,196,0.35); background: rgba(0,245,196,0.06); }
        .badge-icon { font-size: 1rem; filter: grayscale(1) opacity(.35); }
        .badge.earned .badge-icon { filter: none; }
        .complete { text-align: center; animation: fadeUp .5s ease both; padding: 20px 0; }
        .complete h1 { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 12px 0 8px; }
        .complete p { color: var(--muted); margin-bottom: 24px; line-height: 1.6; }
        .xp-display { font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800; color: var(--accent); margin-bottom: 18px; }
        .restart-btn { background: var(--card2); border: 1.5px solid var(--border); color: var(--text); font-family: 'Syne', sans-serif; font-weight: 700; font-size: .95rem; border-radius: 10px; padding: 12px 32px; cursor: pointer; transition: all .15s; }
        .restart-btn:hover { border-color: var(--accent); transform: translateY(-2px); }

        /* ── INFRA EXPLORER ── */
        .infra-explorer { animation: fadeUp .4s ease both; }
        .stack-diagram { display: flex; flex-direction: column; gap: 6px; }
        .layer-row {
          width: 100%; background: var(--card); border: 1.5px solid var(--border);
          border-radius: 14px; padding: 14px 18px;
          display: flex; align-items: center; gap: 14px;
          cursor: pointer; text-align: left; color: var(--text);
          font-family: 'DM Sans', sans-serif; transition: all .2s;
          animation: fadeUp .4s ease both;
        }
        .layer-row:hover { border-color: var(--lc, var(--accent)); background: var(--card2); }
        .layer-row.layer-active { border-color: var(--lc, var(--accent)); background: var(--card2); box-shadow: 0 0 0 1px var(--lc, var(--accent)) inset; }
        .layer-emoji { font-size: 1.5rem; width: 40px; text-align: center; flex-shrink: 0; }
        .layer-info { flex: 1; }
        .layer-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .95rem; display: block; }
        .layer-count { font-size: .78rem; color: var(--muted); }
        .layer-chevron { color: var(--muted); font-size: .8rem; }
        .layer-expanded { background: var(--card2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-top: 4px; animation: fadeDown .25s ease both; }
        .layer-desc { font-size: .88rem; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
        .nodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
        .node-card {
          background: var(--card); border: 1.5px solid var(--border); border-radius: 10px;
          padding: 10px 12px; cursor: pointer; text-align: left; color: var(--text);
          font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 4px;
          transition: all .15s;
        }
        .node-card:hover { border-color: var(--lc); }
        .node-card.node-active { border-color: var(--lc); background: rgba(255,255,255,0.04); }
        .node-emoji { font-size: 1.2rem; }
        .node-name { font-weight: 600; font-size: .85rem; }
        .node-tag { font-size: .72rem; font-weight: 600; }
        .node-detail { background: var(--card); border-left: 3px solid; border-radius: 10px; padding: 12px 14px; margin-top: 12px; display: flex; align-items: flex-start; gap: 12px; animation: fadeDown .2s ease both; }
        .nd-emoji { font-size: 1.4rem; flex-shrink: 0; }
        .node-detail strong { display: block; font-size: .9rem; margin-bottom: 4px; }
        .node-detail p { font-size: .84rem; color: var(--muted); line-height: 1.5; }
        .connect-hint { background: var(--card2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; margin-top: 16px; display: flex; align-items: flex-start; gap: 12px; font-size: .86rem; line-height: 1.6; color: var(--muted); }
        .connect-hint span { font-size: 1.2rem; flex-shrink: 0; }
        .connect-hint strong { color: var(--text); }

        /* ── FLOW VIS ── */
        .flow-vis { animation: fadeUp .4s ease both; }
        .flow-steps { display: flex; flex-direction: column; }
        .flow-step-wrap { display: flex; flex-direction: column; animation: fadeUp .4s ease both; }
        .flow-step-btn {
          background: var(--card); border: 1.5px solid var(--border); border-radius: 14px;
          padding: 14px 16px; cursor: pointer; text-align: left; color: var(--text);
          font-family: 'DM Sans', sans-serif; display: flex; align-items: flex-start; gap: 12px;
          transition: all .15s;
        }
        .flow-step-btn:hover { border-color: var(--sc); }
        .flow-step-btn.fstep-active { border-color: var(--sc); background: var(--card2); }
        .fstep-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .72rem; font-weight: 800; color: #080c18; flex-shrink: 0; margin-top: 2px; }
        .fstep-emoji { font-size: 1.4rem; flex-shrink: 0; }
        .fstep-text strong { font-size: .92rem; font-weight: 600; display: block; margin-bottom: 2px; }
        .fstep-text p { font-size: .82rem; color: var(--muted); line-height: 1.4; }
        .fstep-detail { background: var(--card2); border-left: 3px solid; border-radius: 0 0 12px 12px; padding: 12px 16px; font-size: .86rem; color: var(--muted); line-height: 1.6; animation: fadeDown .2s ease both; }
        .flow-connector { text-align: center; color: var(--muted); padding: 4px 0; font-size: 1rem; }

        /* ── STACK EXAMPLES ── */
        .stack-examples { animation: fadeUp .4s ease both; }
        .stack-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .stack-tab {
          background: var(--card); border: 1.5px solid var(--border); border-radius: 10px;
          padding: 8px 14px; cursor: pointer; color: var(--muted);
          font-family: 'DM Sans', sans-serif; font-size: .84rem; font-weight: 500;
          display: flex; align-items: center; gap: 6px; transition: all .15s;
        }
        .stack-tab:hover { border-color: var(--sc); color: var(--text); }
        .stack-tab.stab-active { border-color: var(--sc); color: var(--text); background: var(--card2); }
        .stack-display { background: var(--card); border: 1.5px solid var(--sc); border-radius: 16px; overflow: hidden; }
        .stack-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 700; }
        .stack-header span { font-size: 1.4rem; }
        .stack-layers-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
        .stack-layer-item { display: grid; grid-template-columns: 70px 1fr 1fr; gap: 12px; align-items: center; background: var(--card2); border-radius: 10px; padding: 10px 14px; animation: fadeUp .3s ease both; }
        .sli-layer { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
        .sli-tool { font-weight: 600; font-size: .88rem; }
        .sli-role { font-size: .82rem; color: var(--muted); line-height: 1.4; }
        @media(max-width:480px){ .stack-layer-item { grid-template-columns: 1fr; gap: 4px; } }
        .stack-cta { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 10px; font-size: .86rem; color: var(--muted); }
        .stack-cta span { font-size: 1.1rem; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="app-shell">
        {/* NAV */}
        <nav className="app-nav">
          <span className="nav-brand">🤖 AI Quest</span>
          {NAV_TABS.map(t => (
            <button key={t.id} className={`nav-tab ${tab === t.id ? "ntab-active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="tab-content">

          {/* ── GAME TAB ── */}
          {tab === "game" && (
            <>
              {gameScreen === "home" && (
                <div className="home">
                  <span className="home-icon">🤖</span>
                  <h1>AI Learning Quest</h1>
                  <p>Master artificial intelligence — what it is, how it works, and how to use it responsibly.</p>
                  <div className="stats-row">
                    <div className="stat-pill">📚 <b>{LEVELS.length} Levels</b></div>
                    <div className="stat-pill">⚡ <b>{LEVELS.reduce((a, l) => a + l.xp, 0)} XP</b> to earn</div>
                    <div className="stat-pill">🏅 <b>{BADGES.length} Badges</b></div>
                  </div>
                  <button className="start-btn" onClick={() => setGameScreen("game")}>Start Learning →</button>
                </div>
              )}
              {gameScreen === "game" && (
                <div style={{ animation: "fadeUp .4s ease both" }}>
                  <div className="topbar">
                    <div className="xp-chip">⚡ {xp} XP</div>
                    <div style={{ color: "var(--muted)", fontSize: ".82rem" }}>Level {currentIdx + 1} / {LEVELS.length}</div>
                    {streak >= 2 && <div className="streak-chip">🔥 {streak} streak</div>}
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${(currentIdx / LEVELS.length) * 100}%` }} /></div>
                  <div className="level-card">
                    <div className="level-header">
                      <div className="level-icon">{level.icon}</div>
                      <div className="level-meta"><h2>{level.title}</h2><p>+{level.xp} XP on completion</p></div>
                      <span className={`level-type-tag tag-${level.type}`}>{level.type}</span>
                    </div>
                    {level.type === "quiz" && <QuizLevel key={levelKey} level={level} onComplete={handleLevelComplete} />}
                    {level.type === "match" && <MatchLevel key={levelKey} level={level} onComplete={handleLevelComplete} />}
                    {level.type === "scenario" && <ScenarioLevel key={levelKey} level={level} onComplete={handleLevelComplete} />}
                  </div>
                  {earnedBadges.length > 0 && (
                    <div className="badges-row">
                      {BADGES.map(b => <div key={b.id} className={`badge ${earnedBadges.includes(b.id) ? "earned" : ""}`}><span className="badge-icon">{b.icon}</span><span>{b.label}</span></div>)}
                    </div>
                  )}
                </div>
              )}
              {gameScreen === "complete" && (
                <div className="complete">
                  <div style={{ fontSize: 64 }}>🎉</div>
                  <h1>Quest Complete!</h1>
                  <p>You've mastered AI fundamentals. Now explore the other tabs to see how it all gets built.</p>
                  <div className="xp-display">{xp} XP</div>
                  <div className="badges-row" style={{ justifyContent: "center", marginBottom: 24 }}>
                    {BADGES.map(b => <div key={b.id} className={`badge ${earnedBadges.includes(b.id) ? "earned" : ""}`}><span className="badge-icon">{b.icon}</span><span>{b.label}</span></div>)}
                  </div>
                  <button className="restart-btn" onClick={restart}>Play Again</button>
                </div>
              )}
            </>
          )}

          {/* ── INFRA TAB ── */}
          {tab === "infra" && (
            <div>
              <h2 className="section-title">🏗️ The AI Infrastructure Stack</h2>
              <InfraExplorer />
            </div>
          )}

          {/* ── FLOW TAB ── */}
          {tab === "flow" && (
            <div>
              <h2 className="section-title">🔌 How to Connect & Build</h2>
              <FlowVisualiser />
            </div>
          )}

          {/* ── STACKS TAB ── */}
          {tab === "stacks" && (
            <div>
              <h2 className="section-title">🧩 Real Tech Stacks</h2>
              <StackExamples />
            </div>
          )}

        </div>
      </div>
    </>
  );
}
