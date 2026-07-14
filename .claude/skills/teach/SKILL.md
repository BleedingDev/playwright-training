---
name: teach
description: Explain and interrogate one SídloFlow Playwright test without creating files. Use when the user invokes /teach with a test path, test name, or current change and wants to understand what the test protects, why it fails, false positives, or flakiness.
---

# Teach one workshop test

Accept a test path, a test title, or the current change. If the target is ambiguous, ask the user to choose one test.

1. Read the selected test, `playwright.config.ts`, `PRODUCT_CONTRACT.md`, and only the application code directly exercised by the test.
2. Explain concisely:
   - the protected user intent;
   - setup and authenticated state;
   - user actions;
   - observable assertions;
   - the mocked or real boundary;
   - why the test should fail;
   - how it could falsely pass;
   - what could make it flaky.
3. Ask exactly three control questions, one at a time.
4. Wait for the user's answer before asking the next question.
5. Correct misunderstandings directly and explain the evidence in the test or product contract.
6. After the third answer, summarize only the concepts the user initially missed.

Never write or modify files. Never create lessons, learning records, reference material, resources lists, or a persistent teaching workspace.

