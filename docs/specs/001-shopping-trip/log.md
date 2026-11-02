# 001 · Shopping trip — progress log

Newest entries on top. Each entry: what changed, where (repo + commit), and any decision or surprise worth remembering.

## 2026-11-02 — Server ready for the trip

**wanna-nest** `0944b84` — closed authorization holes: list access wasn't checked when `listId` was missing, and list updates were broadcast to every connected client.

**wanna-nest** `c4dfabf` — reworked the data model and sync:

- Fresh schema and a single init migration (no live users, old data dropped). The production database must be wiped before the next deploy.
- Sessions start on the first cart / bought / out-of-stock action and end on "Done" or after 30 minutes without heartbeats; the cart becomes bought.
- Expo push notifications, filtered by each member's settings: "X is shopping", "X added: …" (only to active shoppers), "X can't find …" (to the item's author), replies back to shoppers, "X joined the list".
- Joining by share link is idempotent; leaving is a soft delete.
- WebSocket messages are validated; errors come back as one `error` event.
- 15 integration tests on SQLite, 13/13 socket smoke checks with three users. Delivery through Expo Push itself is not verified yet — needs real device tokens.

**wanna** — fixed the universal-links domain (`app.wanna-wanna.com`), Firebase Hosting now serves `.well-known`. The domains themselves are not registered yet.

Not done yet: the client doesn't speak the new protocol (`/shared/:shareId` route, `list:join`, push token via `user:update`, `session:heartbeat`, session and out-of-stock UI).
