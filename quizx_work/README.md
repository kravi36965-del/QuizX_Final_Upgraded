# QuizX — Live Multi-Device Quiz Platform

QuizX is a JEE-style aptitude and logic quiz platform built with Node.js, Express and Socket.IO.

## What is included
- Create a quiz room with quiz name, participant limit and duration.
- Six-digit room code for participants.
- Participants join from different phones/laptops/browsers.
- Host starts the quiz; **host does not enter the exam screen**.
- Host gets a live monitor with participant count, submitted count, pending count and countdown.
- Host can end the quiz manually; otherwise it auto-ends at zero.
- Participants get a JEE-style 45-question exam interface.
- Save & Next, Save & Mark for Review, Clear Response, Mark for Review & Next.
- Question palette and submission summary.
- Server-side scoring.
- Report card with score, accuracy, topic performance and improvement guidance.
- Host history saved in `data/quiz-history.json`.
- Host Access Key can be copied and used on another browser/computer.
- 145-question bank with deterministic smart selection: different room codes produce different 45-question sets/order.

## Run in VS Code
1. Install Node.js 18+.
2. Open this folder in VS Code terminal.
3. Run:

```bash
npm install
npm start
```

4. Open `http://localhost:3000`.

For phones on the same Wi-Fi, find the computer's local IP and open `http://YOUR-IP:3000` from the phone. Windows Firewall may need to allow Node.js.

## GitHub upload
Create a new GitHub repository named `QuizX`, then run:

```bash
git init
git add .
git commit -m "Initial QuizX release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/QuizX.git
git push -u origin main
```

Do not upload `.env` or API keys.

## Public deployment
You need a Node.js hosting provider and a domain. Set the start command to `npm start` and expose the service port through `PORT`.

Important: this version stores history in a JSON file. That is suitable for a small single-server deployment. For a large public service, replace the JSON store with PostgreSQL/Supabase and use a shared Socket.IO adapter (Redis) when running multiple server instances.

## Question selection
QuizX currently uses a local question bank and a seeded selection engine. It does not require an AI API key to work. Each room code seeds the selection so different room codes get different question combinations/order.

An external AI generator can be added later using an environment variable, but never put an API key in browser JavaScript.
