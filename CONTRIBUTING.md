# Contributing to CommitCraft

Thank you for your interest in contributing to **CommitCraft**! We are committed to fostering a vibrant, open-source community of developers dedicated to improving Git experiences.

Please review the guidelines below to help ensure a smooth contribution process.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the project maintainers.

## How Can I Contribute?

### 1. Reporting Bugs
- Search existing issues to avoid duplicates.
- Provide a clear, descriptive title.
- Detail the exact steps required to reproduce the behavior, along with screenshots, logs, or error text if available.

### 2. Suggesting Features
- Outline the functional value of your suggested feature.
- Explain the user stories or scenarios where this would be applied.

### 3. Submitting Pull Requests (PRs)
- Fork the repository and create your branch from `main`.
- Follow the project's folder structure:
  - Backend and database logic in `server.ts`
  - React interactive components in `src/components/`
  - Global CSS structure in `src/index.css`
- Ensure no API keys or personal credentials are hardcoded. Use environment variables defined in `.env.example` instead.
- Run type checks and validation before committing!

---

## Local Development Workflow

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Boot Dev Server**:
   ```bash
   npm run dev
   ```

3. **Production Build Compilation**:
   ```bash
   npm run build
   ```

## Commit Style Guidelines

All commits to the repository are encouraged to follow our own generated Conventional Commit standards (e.g. `feat(auth): support OAuth flow` or `fix(db): correct SQLite connections`). This ensures the repository's log is uniform and readable!
