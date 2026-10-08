# Authentication screen comparison

Source: `design/auth-screen-ref.png` (1122 x 1402).
Implementation: `design/qa/auth-final.png` (393 x 880, deviceScaleFactor 1).
State: signed-out welcome, light appearance. Expo SDK 57 / React Native Web.
The user approved mobile web and Playwright because no native simulator or browser connector was available.

## Normalization

Reference phone interior crop: (303,132)-(820,1290), 517 x 1158, resized to 393 x 880.
Comparison excludes the surrounding promotional artwork. OS status bar, notch, bezel and home indicator belong to the device and are not drawn into the app.
Full comparison: `design/qa/comparison-final.png`.
Focused logo/type/button/legal comparison: `design/qa/detail-final.png`.

## Comparison history

1. `comparison-1.png`: typography, headline wrapping and button positions were close. P2: camera had an unwanted glossy rim; photo was more saturated than reference. P2: blue ambient background light was missing.
2. `comparison-2.png`: lowered photo opacity, added the supplied glow asset, and adjusted legal footer spacing. Camera refinement still pending.
3. `comparison-final.png`: regenerated a flatter camera tile and larger white lens ring. Original actionable layout/color issues are resolved.

## Required fidelity surfaces

- Typography: bundled Inter regular/semibold/bold; same copy, hierarchy and headline line breaks. The reference's precise original typeface is unknown; letterforms and weight are a close approximation.
- Spacing: 393-point composition, 24-point button margins, 60-point buttons, 12-point button gap. Responsive natural flow scrolls on short displays. Safe-area bottom padding protects native controls.
- Colors: near-white canvas, near-black type and Apple button, muted blue-gray supporting text, blue legal links. Photo softened after comparison.
- Images: locally bundled recreated photo and camera, official Google PNG and FontAwesome Apple mark. The photo/mark are similar but are not the exact original source assets. No rasterized UI, phone chrome or text is used.
- Copy: all welcome-screen copy matches the design. Google and Apple buttons invoke Clerk SSO, activate returned sessions, and show recoverable failures. Incomplete authentication offers Finish sign-in securely: Clerk browser sign-in on web and hosted auth on native. Published legal documents are not connected; their links explain this.

## Remaining findings

### Expo Go follow-up (October 5)

User supplied `C:/Users/ED/Desktop/IMG_2897.png` (1242 x 2208). Its buttons lacked backgrounds and horizontal layout while the surrounding NativeWind styles loaded. Replaced all three Pressable style callbacks with object/array styles and explicit press-state handlers to avoid the native CSS interop callback path. Anchored the hero image to its bottom at its intrinsic aspect ratio so short viewports retain the fade. Added 414 x 736 web coverage and assertions for both button backgrounds and row layouts. Lint, typecheck, web checks and iOS bundle export pass. Web evidence: `design/qa/auth-native-fix-web.png` and `design/qa/auth-414x736-top.png`. **Updated Expo Go screenshot still required to verify the native fix; web success does not close that issue.**

- P2 for the user's **identical** requirement: reconstructed photo details, camera lens/flash geometry and exact font differ from the flattened reference. The standalone supplied `auth-demo-img.png` also differs from the reference. Exact fidelity requires the original photo, camera artwork and typeface, or explicit approval to accept the recreated versions. Further layout adjustments cannot remove these source-asset differences.
- Native runtime screenshots were not available. Android bundle export is a build check, not a native visual test.

## Verification

- Google and Apple: controlled browser checks intercept Clerk signIn.create, assert oauth_google/oauth_apple and the /sso-callback redirect, then verify failure messaging and button recovery. This does not verify live provider login or production provider configuration. Hook checks separately cover completed session activation, incomplete web/native completion dispatch, and cancellation.
- Terms and Privacy: notices open and dismiss; no fabricated legal terms or successful login.
- 320 x 568, 393 x 700, 768 x 1024: Apple button and policy link reachable; no document horizontal overflow.
- Browser page errors and console errors: none.
- `npx expo lint`, `npx tsc --noEmit`, `npx expo install --check`, Android export.
- Repeatable capture/interaction check: start Metro on 8082, then `npm run check:auth`. Install the bundled browser with `npx playwright install chromium`. Optional `AUTH_PREVIEW_URL` and `CAPTURE_NAME` environment variables; capture and verification scripts use bundled Chromium.

## Implementation checklist

- [x] Native Expo Router screen, NativeWind styles, bundled fonts and assets.
- [x] Three screenshot comparisons with visual refinements.
- [x] Responsive and interaction checks.
- [ ] Original source assets/typeface or acceptance of approximations for exact visual sign-off.
- [ ] Clerk provider/session integration and published legal destinations (separate functional work).

final result: blocked

Blocker applies to pixel-identical visual sign-off; the implemented screen is running and reviewable.

# Home screen comparison — 2026-10-07

## Scope and evidence

Built the reference home feed in `src/components/home/`, with routes in `src/app/(tabs)/`. Signed-in users land on Home; `/preview/home` is development-only. Existing authentication is preserved. Messages and Explore are explicitly unfinished placeholders; signed-in Profile retains the existing account screen.

Source: `design/home-screen-ref.png`, 1122 x 1402. The phone content crop is (250,104)-(870,1335), normalized to 393 x 780. Device chrome, OS status bar and home indicator are excluded. This preserves the reference's app-content proportions without drawing a fake device into the application.

Evidence: `design/qa/home/comparison-final.png` shows reference and implementation together. `final.png` is the implementation capture. `interaction-results.json` records browser assertions. Additional screenshots cover 320x568, 414x736, 393x852 and 768x1024.

## Iterations

1. Initial comparison: matched header, card dimensions, two post compositions, captions, counts and bottom navigation. Found header baseline, action spacing and clipped tab labels.
2. Adjusted header height and vertical alignment, title size and action spacing. Screenshot revealed React Navigation's label flex shrink was still clipping text.
3. Set explicit label minimum height and disabled icon/label shrinking. Re-captured and visually checked final screen. Added a label-height assertion to prevent recurrence.

## Review

- Layout: card/photo geometry, spacing, corner radii, header and tab placement closely follow the normalized reference. The feed scrolls while header and tabs remain fixed.
- Typography/copy: local Inter fonts, matching names, locations, timestamps, captions and counts. Original source typeface is unavailable; wordmark is an approximation.
- Colors: near-white surfaces, muted blue-gray supporting text, blue primary controls and red likes/badge.
- Assets: original local recreated photography and avatars, shared camera mark. These are separate content assets; no screenshot UI is rendered as the screen.
- Interactions: like/unlike, save/unsave, photo carousel, local comments, author sheet, post menu, hide, preview composer and tab navigation. Report/video actions explain their unavailable backend/file. No network posting or real playback is claimed.
- Responsiveness: no horizontal document overflow at four tested dimensions; navigation remains visible. Native safe areas and native tab navigation are configured separately from web.

## Remaining fidelity findings

- P2, exact-match blocker: recreated photos differ from source in composition, saturation and fine detail. Reference original photo/avatar/brand assets are required for pixel-identical artwork. Current screen is a close recreation, not an identical reproduction.
- P3: icon family, emoji rendering and wordmark letterforms differ slightly from the reference. Native tabs intentionally use platform controls, whose shapes/metrics depend on OS.
- Native visual verification remains pending: screenshot comparisons were performed in the user-approved mobile web preview. Successful native bundling does not establish Expo Go visual parity.

## Validation

- `npx expo lint`: pass.
- `npx tsc --noEmit`: pass.
- `npx expo export --platform ios --platform android --output-dir .expo/home-validation`: pass, both native bundles.
- `node scripts/verify-home.cjs`: passed like/save/carousel/comment/composer/video notice, four tabs, responsive overflow and signed-out route protection; zero browser page errors.
- Screenshot reproduction: run Expo web on port 8082, then `node scripts/capture-home.cjs` (set `CAPTURE_NAME=final` for final filename).

Status: implementation and functional checks complete; exact-image acceptance remains blocked by original artwork and native screenshot verification. Feed records and changes are session-local fixtures, not a connected social backend.

## Home header revision — 2026-10-07

Reference: user attachment `Screenshot 2026-10-07 204800.png`. Implemented compact logo/wordmark toolbar, search and pale-blue circular add control, plus horizontally scrolling stories with blue rings and usernames. Removed the previous tagline. Existing feed remains below it.

Evidence: `design/qa/home/stories-header.png` and side-by-side `design/qa/home/stories-comparison.png`. Compared toolbar proportions, avatar sizes, ring spacing and text placement. Existing local portraits are reused, so faces differ from the reference. Search filters preview people; story buttons open photo previews; Your story adds a session-only sample story. No backend story publication is implied.

Lint and TypeScript passed after this revision. Browser checks cover search, opening stories, adding a preview story and a 320-point viewport. Native visual verification remains pending.

# Profile screen comparison — 2026-10-07

Source: `design/profile-screen-ref.png`, 1122x1402. Reference content crop (258,120)-(862,1294), normalized to 393x764. Status bar, device bezel and home indicator excluded. Rendered route `/preview/profile`, light appearance, Sarah reference fixture, deviceScaleFactor 1.

Evidence: `design/qa/profile/comparison-1.png`, `comparison-2.png`, `comparison-final.png`; standalone `final.png`; responsive screenshots at 320x568, 414x896 and 768x1024. Browser capture uses the previously approved Playwright/mobile-web workflow. Native tab appearance cannot be established from browser screenshots.

## Comparison loop

1. Initial screenshot identified grid/action region approximately 20 points too low, avatar too distant, mismatched grid filter icons and incomplete imagery. Reduced identity/stat/filter vertical spacing, enlarged avatar crop, selected closer icon glyphs.
2. Compared the improved layout with seven photos loaded. Header, identity, stats, buttons and grid start align closely with the reference. Completed the remaining twilight and terrace photos; shortened stat dividers to match the source.
3. Captured the complete nine-image composition and compared it side by side. Layout fixes are resolved. Photos remain recreated, with different fine detail and color treatment; icon and font shapes are approximations.

## Behavior and integration

The actual Profile tab now renders the new profile screen. Signed-in identity comes from Clerk; the real profile begins with zero posts and an empty grid instead of claiming Sarah's photos or counts belong to the account. The development preview contains Sarah's reference data. Existing sign-out is available under Profile settings.

Working local interactions: profile edit/save, posts/reels/saved/tagged filters, image detail/save, notifications/mark-read, discover people/follow, story preview, settings. Profile edits, saves and demo follows are session-only. Stories and videos are cover previews; backend publication and playback are not represented as complete.

The existing four-tab native navigation is retained because of the user's preceding native-tabs requirement. The source mockup has five tabs with a Create action. This intentional navigation difference is excluded from a claim of matching the profile content; the entire image is not identical.

## Validation

- `scripts/verify-profile.cjs`: passed all ten interaction/layout/protection checks; zero browser page errors.
- `npx expo lint` and `npx tsc --noEmit`: passed after removing BOM warnings.
- Native bundle export: `.expo/profile-validation` for iOS and Android.
- Tested 320-point phone layout: text wraps, photos retain three columns, navigation remains visible, no horizontal document overflow.

## Remaining findings

- P2 exact-image blocker: generated travel photos and avatar crop differ from the original artwork. Exact source photos would be needed for pixel-identical content.
- P3: minor icon shapes, emoji and font letterforms differ; blue button uses a flat brand fill.
- Native device visual comparison is pending; browser evidence does not prove Expo Go parity.

Final result: blocked for pixel-identical acceptance; implementation, local interaction verification and responsive web comparison are complete. The report does not claim an identical reproduction.

# Explore screen comparison — 2026-10-08

Reference: `design/explore-screen-ref.png`, 1086x1448. Phone app-content crop (240,100)-(844,1366) normalized to 393x824, excluding bezel/status bar/home indicator. Implementation: `/preview/explore`, light default All/For You state, deviceScaleFactor 1. Native tabs retained; user-approved mobile web/Playwright used for screenshot QA.

Evidence: `design/qa/explore/comparison-1.png`, `comparison-final.png`, `final.png`, `interaction-results.json`, and responsive screenshots at 320x568, 414x896, 768x1024.

## Iterations

1. Matched header/search/mode controls, five suggestions, three creator cards, topics and three-column photo grid. First combined screenshot identified overly distant portraits, truncated topic row and unfinished creator cover artwork.
2. Enlarged Sarah/Olivia avatar crops, reduced category tracking/font size and topic padding. Added individually generated Emma/Daniel portraits and Alpine/Santorini covers. Reused existing scene assets for the grid. Recaptured after refresh indicator settled.
3. Interaction verification found missing selected-state ARIA on web and ambiguous creator-menu labels caused by icon text. Added explicit selected/pressed state and accessible action labels. All interaction checks then passed.

Layout, ordering, copy, card dimensions and grid placement closely follow the source. Original photos differ in composition/color and are not pixel-identical. Creator card captions use a solid translucent dark backing instead of the source's softer fade. Native tab appearance remains OS-controlled.

## Functionality and validation

- Replaced both actual and preview Explore placeholders with the new screen.
- Search filters people, categories, post titles and locations; All/People/Posts/Tags change result types. Tags navigate to filtered posts; topic chips filter the grid.
- Follow/unfollow, See All lists, creator previews, hide/report menu, image previews/save, notifications/mark-read, and no-results/reset states are interactive.
- Discovery content is local demo data. Follows, saved items, hidden creators and read states are session-only. No backend requests or real reports are implied.
- `node scripts/verify-explore.cjs`: fourteen checks passed; zero browser page errors. Narrow layouts have no document overflow; horizontal suggestion/topic rows scroll.
- `npx expo lint`, `npx tsc --noEmit`: passed.
- iOS and Android native bundle export: passed (`.expo/explore-validation`). Native device visual verification is still pending.

Final result: blocked for pixel-identical acceptance because source photos differ; implementation, local interactions and responsive web comparison complete. Minor icon/type differences remain. No claim of identical artwork or native screenshot parity.

# Chat screen comparison — 2026-10-08

Source `design/chat-screen-ref.png`; app-content crop (267,120)-(853,1323) normalized to 393x807. Evidence in `design/qa/chat/`: comparison-1, comparison-2, comparison-final, final screenshot, interaction-results.json and narrow viewport screenshots. Device chrome excluded.

Built a Messages entry that opens the conversation as a protected stack screen, retaining native tabs in the Messages list. Chat has incoming/outgoing bubbles, timestamps, three shared photos, voice-message preview, location card, contact details and a fixed keyboard-aware composer. Newly sent text/photos are explicitly local preview messages and persist while navigating within the session; no fabricated recipient replies or delivery receipts are added.

Comparison iterations narrowed incoming bubbles, corrected the final outgoing bubble width, reduced composer height, adjusted photo/bubble spacing and refined the voice glyph. Final layout is close; original photos, avatar, map, font rendering and waveform differ. The map is an illustration rather than a verified location. Audio and calls present truthful unavailable notices.

Validation: chat interaction script passed twelve checks, including local sending/autoscroll, attachments, returning to Messages, protected routing and two responsive sizes. Lint/TypeScript passed. iOS and Android exports passed (`.expo/chat-validation`). Native keyboard/device visual checks remain pending.

Final result: blocked for pixel-identical artwork acceptance; functional local chat and mobile-web comparison complete.

# Comments screen comparison — 2026-10-08

Source `design/comment-screen-ref.png`, 1086x1448. Phone content crop (240,105)-(847,1390), normalized to 393x832, excluding OS chrome. Reference state: comments modal open on Sarah's post. The development-only `/comments-preview` route reproduces this background; actual Home post comment buttons open the same sheet over the feed.

Evidence: `design/qa/comments/comparison-1.png`, `comparison-final.png`, `final.png`, `interaction-results.json`; responsive screenshots at 320x568 and 414x896. These comparisons use the approved Playwright mobile-web workflow.

Iterations:
1. Initial combined comparison found the background post too tall, sheet slightly high and comment rows a few points too tall.
2. Added compact post geometry only for the comparison background; moved the sheet boundary to match the reference and tightened action rows. Reused existing avatars/photos. Recaptured and inspected the combined final image.
3. Functional verification found the new reply could remain outside the virtualized render window. Increased the initial comment batch and scrolls to the end when new comments change content size. Verified the posted reply is visible.

Working controls: dismiss/backdrop, like/unlike, reply/cancel, emoji insertion, posting with empty-submit disabled, own-comment delete with confirmation/cancel, and parent-post count updates. Twelve local comments populate the reference fixture; newly posted comments show as You. Data is session-only. Like state is consistent between the two like controls; this intentionally differs from the reference's contradictory filled bottom heart and outline side heart.

Validation: ten comment interaction checks passed, zero browser page errors. Lint and TypeScript passed; native export validation in `.expo/comments-validation`. Native device visual/keyboard verification remains pending.

Remaining differences: recreated imagery/avatars, emoji and font rendering, minor icon shapes, and no paper-plane action in the background post. The app-owned sheet layout closely matches the source; this is not a pixel-identical reproduction.

Final result: blocked for exact-image acceptance due to differing source artwork; implementation and responsive interaction checks complete.


## Review corrections (October 8, 2026)

All eight review findings were verified against current code and corrected. No finding was skipped as stale.

- Authentication capture now checks the real Clerk SSO action at a controlled network boundary; provider success is not claimed. Incomplete web authentication exposes a Clerk sign-in redirect; native completion retains hosted auth.
- All capture/verification launches now use Playwright bundled Chromium. Setup: `npx playwright install chromium`.
- Home comments and profile-editor verification use current accessible names. Both scripts were rerun successfully before retaining their passed results.
- Local comments are scoped by authenticated user and post, with a separate signed-out preview scope. Home and comments preview derive their counts from retained records, so refresh/remount cannot reset only the displayed delta.
- Explore and Profile use the same user-scoped saved-ID store; Profile Saved includes Explore photos and removals propagate back.

Validation: `npm run lint`, `npm run typecheck`, `node scripts/verify-review-state.cjs`, `node scripts/capture-auth.cjs`, and the home, profile, explore, comments and chat verification scripts passed. Browser checks used bundled Chromium and reported zero page errors. The Explore check saves a post, finds and removes it in Profile Saved, then verifies the removal in Explore. Hook regression checks cover account isolation, deletion isolation, retained deltas, shared saves, web/native completion, session activation and cancellation. Real provider login and native device behavior were not exercised by these review checks.

CodeRabbit CLI review was not run: `coderabbit` is not installed in this environment.
