# Wanna docs

Product docs for the Wanna app (client: this repo, server: `wanna-nest`). Written in English.

## Specs

Each spec gets a number and its own folder:

```
docs/specs/NNN-short-name/
  spec.md      what we build and why: problem, hypothesis, scenarios, metrics, decisions
  log.md       progress log: what changed, where, decisions made along the way
  findings.md  what testing showed: numbers and interview notes, per test round
```

Numbers are never reused. A spec that is dropped stays in place with the status "dropped" and a line on why.

| # | Spec | Status |
|---|---|---|
| 001 | [Shopping trip](specs/001-shopping-trip/spec.md) | draft v0.2, server done |

## Analytics

Proposal, not decided yet: keep our own event log in the server database instead of a third-party analytics service.

- Most of what the metrics need already happens on the server: sessions start and end, items are added, marked out of stock, replied to. Logging it there is one append-only `Event` table (`type`, `uid`, `listId`, `sessionId`, `props` as JSON, `createdAt`) written next to the existing logic.
- The few client-only events (screen opened, push tapped) go to the server over the same socket.
- With a handful of test families, dashboards and funnels from a service add little; what we need is the raw sequence of events to query with SQL and look at per family.
- No extra SDK in the app, no third-party data sharing to explain to testers.
- A service like PostHog can be added later if we need session replays or a wider audience; the event names carry over.
