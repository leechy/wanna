# 002 · One screen, any size

Status: draft v0.2 · 2026-11-04 · owner: Andrey Lechev

Related: [001 · Shopping trip](../001-shopping-trip/spec.md)

## Problem

Before 001 is tried by real people, the app has to stop getting in their way:

1. Three tabs (Wishes, Shopping, Projects), and two of them do nothing useful for a shopping trip. People will poke at them and tell us about them instead of about the trip.
2. The app is locked to portrait. On a landscape phone, a tablet or an open foldable it is a stretched phone screen with a lot of empty space.
3. Popups take the whole screen everywhere. On a wide screen a one-line "Rename" stretched over a tablet looks broken; on a foldable it lands on the hinge.

## Goal

One home screen with the lists, no tab bar. On a wide screen the home screen and the open list are side by side. Popups are sized for what they hold and never sit on a fold.

## Screens

### Narrow (phone in portrait, folded foldable)

```
┌──────────────┐        ┌──────────────┐
│ Wanna Wanna ⚙│  tap   │ ‹  Home      │
│              │ ─────► │              │
│ Next up      │        │ ☐ Milk       │
│  Home   3/12 │ ◄───── │ ☐ Bread      │
│  Party       │  back  │ ...          │
│ Completed    │        │              │
│ [+ New list] │        │              │
└──────────────┘        └──────────────┘
```

Same as the Shopping tab today, minus the tab bar.

### Wide (≥ 720dp: big phone in landscape, tablet, open foldable, web)

```
┌────────────────┬──────────────────────────────┐
│ Wanna Wanna  ⚙ │  Home                     ⋯  │
│                │                              │
│ Next up        │  ☐ Milk                      │
│ ▌Home    3/12  │  ☐ Bread                     │
│  Party         │  [?] Only rye        7:37 AM │
│ Completed      │  ...                         │
│ [+ New list]   │                              │
└────────────────┴──────────────────────────────┘
   home = navigation      the selected list
```

- Left: the home screen as navigation, the app name with ⚙ settings next to it on top, the selected list highlighted. Fixed width 300; the list gets the rest (420 at the 720 threshold). On a foldable the line between the panes is the hinge, in the middle.
- Narrower than 720 (most phones in landscape): one pane, as on the narrow screen, just wider.
- The home screen keeps its sections for now: Next up, Invitations, Completed.
- Right: the selected list without a back button.
- Which list is on the right:
  - opened from a link or a notification → that list;
  - otherwise the last list the user worked with (remembered on the device);
  - first launch → the default list (see below); later this place can hold something more interesting;
  - nothing to show (the list was deleted, no lists at all) → "Pick a list or create a new one" with the New list button.

### Switching between narrow and wide

Rotating the phone or opening the foldable must not lose anything:
- the open list stays open (narrow → wide: it moves to the right pane; wide → narrow: it is the screen on top of home);
- the scroll position and a half-typed text stay;
- an open popup stays open and is re-centred.

## Popups

Two kinds, by what they belong to.

| Kind | Examples | Narrow | Wide |
|---|---|---|---|
| Of a list | item, list settings, rename, reply to Out of stock, contacts, QR of the list | as today | a card centred over the **right pane**, only the right pane is dimmed |
| Of the app | new list, join a list, settings, sign-in | as today | a card centred over the **whole window**, all of it dimmed; on a foldable in book posture — over the right half |

- Card width: up to 540, height by content up to 90% of the pane, scrolls inside.
- A tap on the dimmed area closes the card, the same as the system back gesture.
- Because the list's popups live in the right pane and the pane edge is the hinge, they can't land on the fold.

### Taps on the left pane while a list popup is open

The left pane stays alive (it isn't dimmed).

- Tap on another list → the popup closes and the other list opens.
- If something was typed in the popup, it is kept as a draft of that list and that action, and comes back when the same action is opened again on the same list. An empty popup just closes. Like an unsent message in a chat app: the chat remembers the draft, not the open window.
- The Out of stock note typed inline in an item follows the same rule.

Not doing: remembering open popups per list and reopening them on return. Popups here are one short action; finding one open half an hour later surprises more than it helps.

## Default list

There is none today: creating a tutorial list at sign-up is commented out in `state/actions-user.ts`, so a new user starts with an empty home screen.

- At sign-up create one shopping list for the user (name to be decided, e.g. "Shopping").
- Not when the user signs up through a shared link: they already get that list, a second empty one only confuses.

## Removed

- The tab bar and the Wishes, Projects tabs, and the "Wanna Wanna" overview tab (`app/(tabs)/index.tsx`) with "To buy / To do".
- Their screens and modals: `app/(tabs)/wishes/*`, `app/(tabs)/projects/*`.
- Wish and project lists already on the server stay there untouched; the app just doesn't show them. They can come back as list types later.

## Routes

```
app/
  _layout.tsx            root stack: sign-in, shared, invitation, settings, join, contacts, qr
  index.tsx              → /shopping
  shopping/
    _layout.tsx          narrow: one stack;  wide: HomeScreen on the left + the stack on the right
    index.tsx            narrow: HomeScreen;  wide: opens the last list, or "Pick a list"
    [list].tsx           the list
    list-modal.tsx       popups of the list, a card over the right pane when wide
    item-modal.tsx
components/HomeScreen.tsx   the home screen, used by both
```

- The paths stay `/shopping` and `/shopping/<id>`, so nothing that was already sent breaks.
- Opening a list goes through `openList()`: on a wide screen it closes the popups of the previous list and keeps the stack "home → this list".
- Popups on a wide screen: `containedTransparentModal` + `PopupFrame` (our card), on a narrow one the system modal as before. The header of a card is drawn by `ModalHeader`, not the system.
- Width from `useWindowDimensions`, 720dp (`hooks/useLayout.ts`).
- `app.json` `orientation: "portrait"` → `"default"`.

### Not yet

- Contacts and the QR code of a list are in the root stack, so on a wide screen their card is over the whole window, not over the list. Moving them under `shopping/` changes their paths.
- The reply prompt (`TextPrompt`) and the menus are system modals, over the whole window.
- The fold: no `expo-foldables` yet, an open foldable gets the same 300 + the rest split, and a card over the whole window can sit on the hinge.

## Check every screen

Narrow portrait, narrow landscape (the wide layout), tablet, foldable open and folded, web:
sign-in, home, list (with Out of stock and the keyboard open), every popup, settings, join + QR scanner, invitation, shared link.

## Decided

1. Settings: ⚙ next to the app name in the home header.
2. Wide from 720dp; panes 300 + the rest; on a foldable the split is on the hinge.
3. On the right: the list from a link or notification, else the last one used, else the default list.
4. Home keeps Next up, Invitations, Completed for now.

## Later

- Rethink how the home screen and the list itself group things (Next up / Invitations / Completed, and the sections inside a list) — the current split doesn't feel right.
- Something more interesting than the default list for the very first launch.
