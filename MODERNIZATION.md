## Modernizing a 4-Year-Old AWS Sample with Kiro

This repository was originally published as an AWS sample and last updated approximately 4 years ago. While the architecture remained sound, the code and instructions had fallen behind the current state of AWS services and the Node.js ecosystem.

We used [Kiro](https://kiro.dev/) to review, update, and validate the entire repository — code and documentation — in less than 30 minutes.

### What Was Outdated

**Lambda runtime**
The functions specified **Node.js 12.x**, which reached end-of-life in 2023 and is no longer available in AWS Lambda.

**AWS SDK v2**
Both Lambda functions used `aws-sdk` (v2), which entered maintenance mode in September 2024 and reached end-of-support in September 2025. It is also no longer bundled in Lambda runtimes from Node.js 18 onward.

**Deprecated Node.js APIs**
The code used `new Buffer.from()`, deprecated since Node.js 6, and mixed `async` handlers with the `callback` pattern, which is unreliable in modern Lambda runtimes.

**Manual cryptographic signing**
The signing logic was hand-rolled using `crypto.createSign`, with manual base64 character substitution and a manual Promise wrapper around a callback-style Secrets Manager call.

**CloudFront Origin Access Identity (OAI)**
Step 2 referenced OAI, which AWS deprecated in 2022 in favor of Origin Access Control (OAC). The console UI steps were also outdated and no longer matched the current CloudFront interface.

**Expired test data**
Both test event JSON files had hardcoded dates in 2020 and 2021 — all in the past — meaning any user following the sample would immediately get an expired URL error.

---

### What Kiro Did

**Upgraded the Lambda runtime to Node.js 24.x**
The current LTS runtime, with full ES module support.

**Migrated from AWS SDK v2 to SDK v3**
Replaced `require('aws-sdk')` with modular ESM imports from `@aws-sdk/client-secrets-manager`. The SDK v3 is pre-bundled in the Lambda runtime, so no deployment package or npm install is required — users can paste the code directly into the Lambda console.

**Rewrote the Lambda functions with modern patterns**
- `require` → `import` (ESM, required for `.mjs` in Node.js 24)
- `exports.handler` → `export const handler`
- Removed the manual Promise wrapper — replaced with a clean `await`
- Removed the `callback` pattern — handler now returns the response directly
- Added ISO 8601 date validation with a clear error message on bad input
- Added PEM key normalization to handle common Secrets Manager paste formatting issues

**Kept signing logic inline — no extra dependencies**
Rather than adding an external package, the signing uses Node.js's built-in `crypto` module. This keeps the Lambda function self-contained and paste-friendly.

**Updated CloudFront instructions to use OAC**
Replaced all OAI references with Origin Access Control (OAC), and updated the console UI steps to match the current CloudFront distribution creation flow.

**Updated all documentation**
Every README was reviewed and updated: runtime versions, console UI steps, environment variable instructions, IAM role navigation, and a warning about PEM key formatting in Secrets Manager.

**Fixed test data and sanitized placeholder values**
Test event dates updated to 2027. Placeholder account IDs standardized to `123456789012`. HTML files corrected (`<header>` → `<head>`, added `<!DOCTYPE html>`).

---

### The Result

The same architecture. Cleaner, shorter code. No external dependencies. Working signed URLs on the first deploy.

> This modernization was completed using [Kiro](https://kiro.dev/), an AI-powered development environment.
