# 001 · Shopping trip

Status: draft v0.2 · 2026-11-02 · owner: Andrey Lechev

Related: [progress log](log.md) · [findings](findings.md)

## Problem

The shopping list is shared, but the shopping itself is an event in time and place that the app knows nothing about. Because of that:

1. The family doesn't know someone is in the store right now and misses the moment to add "do we have milk?".
2. Statuses lie: items stay in the cart until the next time the app is opened, because nobody presses "check out" — with bags in your hands the app is the last thing on your mind.
3. When an item is out of stock, the shopper doesn't know what to replace it with, and a chat or a phone call begins.

## Hypothesis

If the app knows about the "shopping trip" — the session starts by itself with the shopper's first action, announces itself to the family and ends correctly by itself — then:

- more items will be added during the trip;
- statuses will match reality without a manual "check out";
- "what should I get instead" questions will be resolved inside the app.

## User (v1)

A family with one shared "Home" list and one store. Multiple lists and stores come later.

## Scenarios

### 1. Trip starts

- The session starts when a member puts the first item into the cart (or marks it bought in the no-cart mode).
- The other members get a push: "Masha is shopping — list "Home"".
- Everyone sees the session status in the app: who is shopping and the progress, "3 of 12 picked".

### 2. During the trip

- Family members add items → the shopper immediately gets a push: "Andrey added: milk".
- The family sees the progress in real time: a Live Activity on iOS, an updating notification on Android (see "Live progress").
- Frequent changes are batched into a summary so we don't spam (an N-minute window, N to be tuned in testing).

### 3. Out of stock

- The shopper marks an item "out of stock" (a separate action on the item, not a deletion), optionally with a short note: "only 3.2%".
- The item's author gets a push with quick replies: "Any is fine" / "Skip it" / custom text.
- The reply reaches the shopper as a push and is shown on the item.
- If there's no reply by the end of the session, the item goes back to the list marked "wasn't there".

### 4. Trip ends

The session ends on whichever comes first:

| Trigger | How it works | v1? |
|---|---|---|
| Timeout | N minutes without the list on the shopper's screen (start with 30 min). Closed by the server, the app doesn't need to run | yes |
| Left the store | A geofence around the point where the session started (see "Leaving the store") | experiment |
| "Done" button | Exists, but we don't rely on it | yes |

What happens to the items when the session ends:
- in the cart → "bought" (put in the cart = bought);
- "out of stock" without a reply → back to the list marked "wasn't there".

There is no separate notification about the end of the session.

### 5. Home screen

List cards. Inside the cards or on top of them, a "needed now" grouping by deadlines. During a session the list card shows its status.

### 6. Working with the list

One tap target per item instead of a checkbox plus a cart icon: two similar states ("in cart" and "bought") were too much to keep in mind.

**Still wanna**

| Gesture | Action |
|---|---|
| Tap | Toggles "picked" (in the cart): a check mark, the item stays in place, dimmed — rows must not jump under the finger in the store |
| Swipe left | Delete, with "Undo" for a few seconds — the list is shared |
| Swipe right | Toggles "out of stock"; swiping again means "found it after all" |
| Long press | Menu: Edit, Out of stock, Delete |

- When something is picked, a "Done (N)" button appears: the trip ends and the cart is bought. Without it the trip ends by the timeout.
- An out-of-stock item shows "Out of stock · 14:32" under the name (a date for older days). A tap on that line adds a note ("only 3.2%"); the author's reply shows below.
- Every swipe action is also an accessibility action, so it works with VoiceOver/TalkBack.

**Already got**

| Gesture | Action |
|---|---|
| Tap | Nothing |
| Swipe left | Delete |
| Swipe right | Buy again: a copy goes back to Still wanna |
| Long press | Menu: Edit, Back to the list (picked by mistake), Buy again, Delete |

Shopping lists only; project lists keep their current behaviour until they're decided on.

### 7. Joining a list

A family member joins the list by its share link. The link works when it's tapped in a messenger, but not always: the app's domain may not be verified yet, the link may come as text, or the other phone is right here. So the app has its own way in.

- A **"Join"** button next to "New shopping list", styled like the "Done" cart button. Always visible, so it's found on an empty first screen too.
- It opens a **Join a shared list** screen:
  - a camera viewfinder that scans the QR code from another phone and joins right away;
  - a field for the link with a "Paste" button; the full link, `wanna://` link or the bare code all work, the code also with spaces or nothing instead of dashes.
- The sender gets **Show QR code** in the share menu: the QR of the same link, big enough to scan from a phone held next to it, and the code under it in groups of three letters, to read out or type when the camera does not help.
- Joining by QR or link follows the same path as the shared link: sign in first if needed, then the list opens.

Rejected: pasting the link into the "New shopping list" field. Hidden, and mixes two different actions in one field.

## Experiment: with and without the cart

Both models are built behind a list-level flag, switched in the list settings:

- **With cart:** tap → "in cart", on session end → "bought".
- **Without cart:** tap → "bought" right away; can be undone while the session is running.

There are few testers, so an A/B split between groups won't work. Each family lives 1–2 weeks with one model, then the same with the other, followed by a short interview.

## Metrics

- Share of items added by other members during someone else's session.
- Share of items staying in the cart longer than 12 hours (target ≈ 0).
- How sessions end: timeout / geofence / button.
- Time to reply to "out of stock" and the share of questions resolved without a call (from interviews).
- Cart vs. no-cart: which one families pick after the test and why.

How the data is collected: see [findings](findings.md#data-collection).

## Out of scope for v1

- Stores as an entity, multiple stores, location-based hints.
- Several lists in one session.
- Voice assistants and MCP.
- The "every N minutes" summary as a separate notification — first we check whether live progress is enough.

## Technical notes (developer)

### Gaps found before v1 (now closed on the server, see [log](log.md))

- The server didn't send any push: the Expo push token was stored in `User.expo_push_token`, but nothing sent it.
- Items had no author (`ListItem` didn't store who added it) — needed for "out of stock" and "Andrey added" notifications.
- There were no sessions.

### Data model

- `ShoppingSession`: `sessionId`, `listId`, `startedAt`, `endedAt`, `endReason` (`timeout` | `geofence` | `manual`), optional `latitude/longitude`.
- `SessionShopper`: `sessionId`, `uid`, `joinedAt`, `lastSeenAt` — a session can have several shoppers (see decision 2).
- `ListItem`: + `addedById`, + `unavailable` (+ `unavailableNote`, `unavailableReply`), + `sessionId` when picked.
- `List`: + `cartMode` (`cart` | `direct`) for the experiment.
- Notification settings live per member (`UserList.notifyOn*`), not per list.

### Leaving the store

No store database is needed: when the session starts we remember the current location and set a geofence with a ~150 m radius; leaving it ends the session.

- **iOS:** region monitoring works in the background and even relaunches a closed app (`expo-location` + `expo-task-manager`). It needs the "Always" permission, which iOS grants only after "While Using" — a separate UX question. Triggers are delayed by minutes, accuracy is hundreds of meters.
- **Android:** Geofencing API + background location permission. Google Play requires a justification for background location and the review may reject it — a risk.
- Without the permission only the timeout works.

### Live progress

- **iOS Live Activity:** on the shopper's phone the app starts it itself. For it to appear on the family's phones we need a remote start via push (iOS 17.2+) and updates via APNs push-to-update. Most likely the server will have to talk to APNs directly, bypassing Expo Push — to be checked. The activity itself is a native Swift/SwiftUI target inside the Expo project.
- **Android:** an updating notification with progress (same id), on newer versions the live/progress notification format.

### Estimate (rough)

| Block | Estimate |
|---|---|
| Server push + `addedBy` | 2–3 days |
| Sessions + timeout + cart flag | 3–4 days |
| "Out of stock" with quick replies (actionable push) | 3–4 days |
| Home screen: cards + "needed now" | 3–5 days |
| Leave-the-store geofence (iOS, then Android) | 3–5 days |
| iOS Live Activity + Android progress | 1–2 weeks |

## Decisions

1. **Timeout is 30 minutes** since the list was last on the shopper's screen. While the screen is open, the app sends a heartbeat to the server and the timeout is extended.
2. **Several shoppers.** Two people in different stores with one list — two sessions. Two people in the same store — one session with two shoppers. Telling "same store or different" apart is only possible with location, so in v1 every shopper gets their own session, but the data model already allows several shoppers per session.
3. **"Out of stock"** is a swipe right on the item, plus a menu entry for discoverability (see "Working with the list"). The note is optional and added by tapping the label, so the swipe stays instant.
4. **Live Activity** — after regular pushes, but within v1.

## Open questions

1. How to merge shoppers into one session once we have location: radius, time, an explicit "I'm with Masha"?
2. **Long press: menu or edit?** v1 opens a menu (the iOS convention, and it makes the swipe actions discoverable). Andrey prefers long press = edit, if there is another good way to show the actions. Test both again with people.
3. **Android menu.** Android has no system long-press context menu (Gmail and Keep use long press for selection). v1 shows our own menu; the native Material menu comes with the redesign.

## Ideas

- A default list for a new user who didn't come by a shared link, so the first screen isn't empty.
- Drop project lists and maybe the bottom tabs, to focus the app on shopping (decided to come back to it, nothing removed yet).
