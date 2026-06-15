# CommitCraft 🛠️✨

**CommitCraft** is an AI-powered full-stack web application designed to help developers transform messy change logs, scratchpad thoughts, or AI assistant outputs into pristine, production-ready Git commit messages and comprehensive Pull Request descriptions.

Built with **React (Vite) + Node (Express) + SQLite + Tailwind CSS v4**, CommitCraft uses standard server-side Google Gemini 3.5 models to classify code logs and manufacture top-tier developer deliverables in seconds.

---

## 🎨 Creative Highlights

- **Conventional Commit Engine**: Select between standard headers or Conventional Commit rules (e.g., `feat(auth): add JWT middleware`).
- **Flexible Body Explanations**: Request Short (1-2 sentences), Medium (3-5 sentences), or Detailed (fully explained nested bullet points) descriptions.
- **Multilingual Support**: Supports writing outputs in **English, French, Spanish, German, or Arabic** with correct grammar and context translations.
- **Pull Request Automation**: Fabricates complete Markdown pull request descriptions complete with specialized `Summary`, `Changes Made`, `Testing Notes`, and `Impact` segments.
- **Durable Local SQL Persistence**: Retains previous logs and generated code snippets securely inside a local transactional **SQLite** database.
- **Secure Architecture by Design**: Calls Gemini API entirely server-side, preventing your sensitive variables from leaking into client-side code packages or browser extensions.

---

## 🚀 Getting Started

### 1. Configure the API Secret Key
To enable Gemini AI generation, define your system key in your secrets menu:
```env
# .env.example
GEMINI_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Run in Local Development Mode
```bash
npm run dev
```
The application spins up Express proxies and mounts Hot Vite middleware on [http://localhost:3000](http://localhost:3000).

---

## 📁 Repository Map

```text
├── server.ts             # Express full-stack API endpoint server & sqlite schema rules
├── package.json          # Dependencies, scripts and package declarations
├── tsconfig.json         # TypeScript configuration
├── metadata.json         # Container app metadata
├── src/
│   ├── App.tsx           # Global state orchestrator and tab navigation routing
│   ├── main.tsx          # Client React entrypoint node
│   ├── types.ts          # Declarative TS typed structures
│   ├── index.css         # Custom font declarations, resets & tailwind imports
│   └── components/
│       ├── Header.tsx    # Logo headers and Gemini status tracker
│       ├── Footer.tsx    # Compact copyright details
│       ├── Markdown.tsx  # Direct safe regex-based markdown layout parser
│       ├── Generator.tsx # Main text logging controls, toggles, loaders & copy nodes
│       ├── HistoryList.tsx # SQLite registry searches and log expansions
│       ├── SettingsView.tsx # Saved variables preferences configuration
│       └── AboutView.tsx # Contributors registers and licensing details
```

---

## 📜 Licensing

Licensed under standard MIT Terms. See the [LICENSE](LICENSE) file for more information.
