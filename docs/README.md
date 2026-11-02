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

Decided 2026-11-02: our own event log in the server database (`AnalyticsEvent` in `wanna-nest`), no third-party service.

- Server events are written next to the logic: `list.created|joined|left|cart_mode_changed`, `item.added|picked|bought|unpicked|unbought|unavailable|unavailable_replied|deleted`, `session.started|ended`, `push.sent`, `user.registered`.
- Each row: `type`, `uid`, `listId`, `sessionId`, small JSON `props`, `createdAt`. No foreign keys, so the log outlives deleted data.
- App events come over the socket as `analytics:track {type, listId?, sessionId?, props?}` and are stored as `client.<type>`.
- Size limits: no high-frequency events (heartbeats and broadcasts are not logged); client events are limited to 30 a minute per user, a `[a-z0-9_.]` type up to 40 chars and 1 KB of props; rows older than `ANALYTICS_RETENTION_DAYS` (365) are purged daily. Rough size: ~200 bytes per event, a family of active users makes ~100 events a day — a few MB a year.
- Conclusions go into the spec `findings.md` before the raw rows expire.
- A service like PostHog can still be added later; the event names carry over.
