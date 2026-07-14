---
name: domain-modeling
description: Sharpen SídloFlow domain terminology and maintain its ubiquitous-language glossary. Use during /grill-with-docs when terms, boundaries, or durable architectural decisions are being resolved.
---

# Domain modeling

Actively challenge vague or conflicting domain language while a design is being discussed.

## Workflow

1. Read `CONTEXT.md` if it exists and compare the user's language with it.
2. Propose one precise canonical term when language is overloaded.
3. Test the definition with concrete customer, operator, and integration scenarios.
4. Check the code when a factual claim can be verified there.
5. Update `CONTEXT.md` immediately when a term is resolved, using [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).
6. Keep `CONTEXT.md` implementation-free: it is a glossary, not a spec or scratchpad.
7. Offer an ADR only when the choice is hard to reverse, surprising without context, and the result of a real trade-off. Use [ADR-FORMAT.md](./ADR-FORMAT.md).

Create files lazily. Do not create `docs/adr/` unless a qualifying decision actually occurs.

