# 001 · Shopping trip — findings

What testing tells us: numbers from the data and what families say in interviews. Fill in per test round.

## Data collection

Own event log in the server database, see [docs index](../../README.md#analytics).

| Metric | Source |
|---|---|
| Items added by others during someone's session | `item.added` with `duringOthersSession` |
| Items in the cart longer than 12 h | `item.picked` without `item.bought` / `session.ended` within 12 h |
| How sessions end (timeout / geofence / button) | `session.ended` `reason` |
| Time to reply to "out of stock" | `item.unavailable` → `item.unavailable_replied` by `listItemId` |
| Questions resolved without a call | interviews |
| Cart vs. no-cart preference | interviews |

## Test rounds

_No rounds yet._

<!--
### Round 1 — YYYY-MM-DD … YYYY-MM-DD
Families: …
Cart mode: cart → direct
Numbers: …
Interview notes: …
Conclusions: …
-->
