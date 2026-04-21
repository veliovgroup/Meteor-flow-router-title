## `ostrio:flow-router-title`

Client-only [Atmosphere](https://atmospherejs.com/ostrio/flow-router-title) package for [Meteor](https://www.meteor.com/): keeps `document.title` in sync with [ostrio:flow-router-extra](https://atmospherejs.com/ostrio/flow-router-extra) routes, groups, globals, and not-found handling.

### Role in stack

- **Peer (app must add):** `ostrio:flow-router-extra@3.13.0+` — import `FlowRouter` from `meteor/ostrio:flow-router-extra`.
- **This package:** `FlowRouterTitle` — no direct dependency on `flow-router-extra` in `package.js`; tests pin `ostrio:flow-router-extra@3.13.0`.
- **Often paired with:** [ostrio:flow-router-meta](https://github.com/veliovgroup/Meteor-flow-router-meta) (meta implies title and can re-export `FlowRouterTitle` from a single import path).

### Build / surface

| Item | Detail |
|------|--------|
| Entry | `api.mainModule('flow-router-title.js', 'client')` — **client only** |
| Deps | `ecmascript`, `reactive-var`, `tracker` |
| Types | `index.d.ts` via `api.addAssets`; weak `zodern:types`, `typescript` (same pattern as `ostrio:flow-router-extra`) |
| Tests | Tinytest, `api.addFiles('tests/index.js', 'client')` |

Do not import this package from server bundles.

### Initialization order

1. Define `FlowRouter.route` / `FlowRouter.group` / `FlowRouter.globals` (including catch-all `FlowRouter.route('*', …)` if used for 404).
2. **`new FlowRouterTitle(FlowRouter)`** after routes are registered (typical: end of client router module).
3. Call `FlowRouter.initialize()` when the app is ready (same as plain Flow Router).

### API (behavioral)

**Export:** `FlowRouterTitle` class from `meteor/ostrio:flow-router-title`.

**Constructor:** `new FlowRouterTitle(router)` — `router` is the app’s `FlowRouter` instance.

Registers:

- `router.triggers.enter` — computes title for current navigation.
- `router.triggers.exit` — stops internal `Tracker.autorun` computations from previous route.
- Wraps `router._notfoundRoute` so not-found flows still apply `title` from `FlowRouter.notFound` / legacy not-found options when applicable.

**Instance method:** `set(string): boolean` — sets `document.title` (via internal `ReactiveVar` + `setTimeout(…, 0)`). Returns `true` for strings, `false` otherwise (no throw).

**Route / group / globals options** (read by this package through route/group objects Flow Router already stores):

| Option | Type | Notes |
|--------|------|--------|
| `title` | `string` or `(params, queryParams, data) => string` | Route-level wins over group; functions rerun in `Tracker.autorun` when used |
| `titlePrefix` | `string` or function | On **groups**; nested groups concatenate parent prefixes first |
| `FlowRouter.globals` | array of objects | First object with a `title` key seeds **default** title when route has no `title` |

**Priority (high → low):** explicit route `title` (with group prefix rules) → group `title` / prefixes → default from `globals` → initial `document.title` in HTML.

**Reactive titles:** use a **function** for `title` (or `titlePrefix` where supported). `titlePrefix` as function does not alone establish an autorun for unrelated reactive reads — prefer reactive work inside route `title()` when needed.

**404 / notFound:** Supports catch-all route and legacy `FlowRouter.notFound` shape; see README “404 / notFound compatibility”.

### Code touchpoints (maintainers)

- `flow-router-title.js` — `FlowRouterTitle` class, `applyGroupTitle`, `getParentPrefix`, `_reactivate` (Tracker), not-found wrapper.
- `package.js` — versions, assets, weak typing deps.
- `index.d.ts` — `declare module 'meteor/ostrio:flow-router-title'` for `zodern:types`.

### TypeScript (apps)

- Add **`zodern:types`** so Meteor merges package `.d.ts` assets.
- Use `import type { Router } from 'meteor/ostrio:flow-router-extra'` only if typing wrappers; constructor expects that router type.
- `FlowRouterTitle#set` is `set(title: string): boolean`.

### Tests

```bash
meteor test-packages ./ --port 8888
# optional: MONGO_URL="mongodb://127.0.0.1:27017/flow-router-title-tests" meteor test-packages ./ --port 8888
```

Tests live under `tests/`; `tests/index.js` constructs `FlowRouterTitle` after `require` of scenario modules, then `FlowRouter.initialize()`.

### Docs

- User-facing: `README.md` (also `Package.describe({ documentation: 'README.md' })`).
- This file: agent/IDE context for changes, reviews, and integration with Flow Router ecosystem.
