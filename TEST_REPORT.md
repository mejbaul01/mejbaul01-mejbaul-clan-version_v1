# Mejba test report

## Status and evidence

**Automated suite: PASS in the supplied evidence from this run. Release sign-off: pending.** This documentation-only correction records the execution output and root splash, menu, level map and game screenshots supplied for this Linux builder sandbox; it does not claim a new rerun or a gameplay defect fix.

| Evidence from this run | Observed result | What it establishes |
| --- | --- | --- |
| Full suite: match_engine, player_progress, game_flow, save_boundary | **42 tests, 1.970 s, `OK`, exit code 0; 0 failures, 0 errors** | Current automated checks passed in this Linux builder environment after earlier failing harness revisions were corrected |
| Isolated save callback plus settings event check | Exit code 0 | Restored ratings/best/coins/preferences, contiguous unlock to stage 2, and sound-toggle mutation through the sandbox helper |
| Separate portable subset: match_engine, player_progress, save_boundary | **28 tests, 0.476 s, `OK`, exit code 0; 0 failures, 0 errors** | Portable subset passed separately in the Linux builder sandbox; not a Windows clean-install check |
| Root splash, menu, level map and game screenshots captured after the last documentation write | All rendered without an error overlay; menu/map/game used state payloads | Render-only evidence. The game used injected sample board state, not an interactive session or completed stage. Menu/map/game show portions of screens in a scrollable shell; no manual scrolling or complete layout/device validation |

Earlier harness runs failed: the supplied outputs include 37 tests with 8 failures/14 errors, 40-test revisions with 8 failures, and a 42-test revision with 1 failure before the final corrected pass. They are not passing evidence. The final pass does not retroactively validate those revisions or prove full gameplay correctness.

The successful full-suite (1.970 s) and separate portable-subset (0.476 s) runners disabled logging. Ordinary corrupt-save tests emit diagnostic exception logs and tracebacks even when decoded values safely recover to defaults. A code guardrail prevented removing the expected tracebacks; this logging limitation remains. Recovery assertions do not rely on logging behavior. Interpret the final unittest summary and exit code, not diagnostic logs alone.

| Record field | Available evidence |
| --- | --- |
| Environment | Linux builder sandbox; supplied traces use Python 3.13; requirements pin Reflex 0.9.12, installed version not separately captured |
| Runner | unittest loaded all four modules for the full suite and three modules for the separate portable subset; logging disabled for both successful runs; exit code 0 for each |
| Summary | Full suite: 42 tests / 0 failures / 0 errors / 1.970 s; separate portable subset: 28 tests / 0 failures / 0 errors / 0.476 s; no skip count separately recorded |
| Evidence location | Execution output and root splash/menu/level map/game screenshots supplied in this task; screenshots captured after the last documentation write |
| Date / tester identity / source revision | Not supplied; no values invented |
| Conclusion | Full-suite and portable-subset passes plus four render-only screenshots; manual gameplay/device sign-off pending |

No interactive browser gameplay, physical touch device, Windows clean install or Android artifact was tested.

## Reproduce automated checks

Install Python 3.13 and dependencies as described in README. The **portable pure-unit subset** explicitly excludes game_flow and selects 28 existing tests:

- Windows: `.\.venv\Scripts\python.exe -m unittest scripts.test_match_engine scripts.test_player_progress scripts.test_save_boundary -v`
- macOS/Linux: `.venv/bin/python -m unittest scripts.test_match_engine scripts.test_player_progress scripts.test_save_boundary -v`

No additional test helper or code assembly is needed for that subset. The separate supplied Linux builder run passed this subset: 28 tests in 0.476 s, 0 failures/errors, `OK` and exit code 0, with logging disabled. These commands remain reproduction instructions, not evidence of a Windows clean-install run; their output and timing may differ.

**Full game-flow suite is builder-environment-only unless a compatible equivalent helper is installed.** `scripts/test_game_flow.py` imports `test_utils.run_event` supplied by this builder sandbox. It is not included in the repository or `requirements.txt` and is not automatically available on Windows. Blanket discovery outside the builder can therefore fail on import. Beginners should use the subset above rather than write a helper.

With the helper already available, run `python -m unittest scripts.test_match_engine scripts.test_player_progress scripts.test_game_flow scripts.test_save_boundary -v` using the environment's Python. This selects 42 tests. Ordinary output may contain expected corrupt-save diagnostics; the recorded 1.970 s run used a runner with logging disabled, so this command need not have identical output or timing.

Retain output, exit code, date, source revision, OS, Python and installed Reflex version for future runs. Require `OK` and exit code zero. `FAILED`, import errors and test errors are failures, including harness compatibility failures. After changes, retain failures and rerun the applicable suite; do not substitute earlier evidence.

## Automated coverage inventory (current tests)

| Area | Actual checks |
| --- | --- |
| `scripts/test_match_engine.py` — 9 tests | 100 seeded boards: 64 valid gems, no initial matches, legal move available; adjacency/edges; overlapping/disjoint runs and empty exclusion; immutable invalid-swap reversal; gravity survivor order/refill; seeded legal moves/repeated cascades and capped score multiplier; dead-board shuffle/count preservation/fallback; 20 ordered positive configs and defensive copies |
| `scripts/test_player_progress.py` — 5 tests | Fresh/corrupt save decoding, field validation, contiguous unlocks; local new-attempt initialization resets booster limits, pause and recorded-result flag and produces a settled playable board. It does not verify external coin persistence |
| `scripts/test_save_boundary.py` — 14 tests | Pure codec checks: all 20 ratings/bests roundtrip; strict integer types, endpoints and clamping; omitted invalid rating/score values; default coins/preferences and wrong containers; fresh independent defaults; corrupt/wrong-top-level JSON and unsupported versions; deep JSON safe defaults/messages; contiguous unlocks capped at 20; advertised unlock/completion metadata and best scores do not unlock stages |
| `scripts/test_game_flow.py`: EngineFlowTests — 5 tests | 20 configs/seeded boards; seeded move-budget simulations until target or exhausted moves; near-target last-move score arithmetic; invalid-swap engine reversal across 20 seeds; deterministic cascades/capped multiplier |
| `scripts/test_game_flow.py`: GameFlowTests — 9 tests | Local level setup/computed thresholds, difficulty and progress; selection/deselection/reselection; paused/busy/inactive/finished input guards; invalid indices/nonadjacent swipe guards; pause/restart request/cancel mutations and busy guard; stale/already-recorded result guards; playing-result lock release; all 20 map lock/selection boundaries |

The separate isolated callback/settings check is outside the 42-test count. It exercises save receipt and a local preference mutation, not real localStorage writes, audio or browser persistence.

### What these tests do not prove

The engine simulations use the implementation's matching/scoring/gravity/refill helpers. Move-budget simulations assert termination at target or zero moves, **not** a win for every stage or fair balance. Near-target last-move fixtures calculate outcome arithmetic; they do not execute the real resolution handler.

Local event tests use the sandbox helper for mutations and early-return guards. They do **not** run full real swap-resolution/background-task/reward flows, browser dispatch, real scheduling/locking, animation timing or multi-client isolation. Stale/already-recorded result guards are not reward-award, replay-coin or unlock integration verification. Paid booster spending, actual win/loss recording, confirmed reset/restart, resume/replacement flow and next/final-stage transitions still need integration/manual verification.

The current save-boundary module tests decoding only: it does not construct navigation states, execute callbacks, test oversized/non-string browser responses, unavailable storage, late-load guards or JavaScript localStorage. The isolated callback check adds only its stated assertions. Neither Python checks nor the four render-only screenshots establish actual persistence, touch/audio, accessibility, device compatibility or complete gameplay. No Godot/native Android artifact or Play submission was produced or tested.

## Manual browser/device matrix — pending beyond render-only screenshots

Root splash, menu, level map and game screenshots were captured after the last documentation write and rendered without error overlays. Menu/map/game used state payloads; the game used injected sample board state, not an interactive session or completed stage. Those three screenshots show only portions of screens in a scrollable shell, so they do not establish unclipped content or reachability. No manual scroll, click, swipe or real-device validation was performed; the broader checks below remain unperformed.

For every performed row record browser/version, device/OS, viewport, date, steps, expected/actual result and evidence. Browser emulation is separate from real-device verification.

| Test | Expected result / steps | Status |
| --- | --- | --- |
| Windows install and start | Follow README on a clean Python 3.13 setup; compile app, load welcome/menu/map; no console errors | Not performed |
| Desktop browsers | Edge, Chrome, Firefox: mouse click pair/drag, invalid reversal, keyboard Tab/Enter/Space, visible focus, no duplicate swipe click | Not performed |
| Android real browser | Real phone portrait: taps/swipes, edges, scrolling, controls, no unintended page scroll from board | Not performed |
| iOS real browser | Safari on real phone: same controls plus sound unlock/visibility behavior | Not performed |
| Layout | Small portrait, larger desktop, short viewport and landscape: shell content remains reachable; logo intact; no clipped goal/board/boosters | Not performed |
| Gameplay | Legal move spends one move; full cascade settles before next input; invalid swap free; free no-move recovery leaves playable board | Not performed |
| Win/loss and journey | Complete levels from zero; last-move win, below-target loss, rewards/bests/unlocks, stage-20 finish/replay; assess difficulty across all stages | Not performed |
| Boosters | Hint/shuffle costs and attempt limits, insufficient funds, no score/move gain, no refund after restart | Not performed |
| Pause/restart/navigation | Pause/resume, restart cancel/confirm, home/map/settings roundtrip, replacement confirm, busy-input suppression | Not performed |
| Persistence | Earn/spend then inspect save message; refresh/reopen preserves progress/preferences but not board; new profile starts fresh | Not performed |
| Save faults/reset | Disposable browser profile: corrupt stored save, blocked/full storage, private mode, reset cancel/confirm; graceful recovery and accurate status | Not performed |
| Multiple tabs | Document last-writer overwrite risk; no promised synchronization | Not performed |
| Sound | User gesture starts audio; effects/music toggles; pause, home, hidden tab stop music; no microphone request | Not performed |
| Network/session interruption | Disconnect/reconnect while swapping or idle; record recovery/lost-attempt behavior honestly, no offline claim | Not performed |
| Accessibility | Keyboard-only flow, screen reader labels/status, focus, contrast, reduced motion, zoom/text scale | Not performed |
| Privacy review | Inspect actual browser requests/storage; confirm font request and service processing, operator-specific logging/retention | Not performed |

## Release decision

Not approved for publication based on this report alone. The 42-test full-suite pass (1.970 s), separate 28-test portable-subset pass (0.476 s), isolated callback/settings check and four render-only screenshots are recorded, but do not replace interactive/browser/device verification. Complete target manual checks, retain reproducible environment/revision evidence and review publication/privacy drafts. This workspace cannot produce a Godot project, Android debug APK, signed AAB or submit to Google Play; no Android SDK or signing credentials exist here. Current Play policy requirements have not been verified in this phase.
