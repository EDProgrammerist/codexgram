# Codexgram: Product Specification and Implementation Plan

Last updated: October 5, 2026 (Asia/Manila).

Status: Interview complete; implementation not started. This file preserves the agreed product decisions and a phased checklist for later implementation. Creating this document does not authorize configuring paid services or publishing a release.

## 1. Goal and success criteria

Build a simple Instagram-style mobile social app for up to 50 invited adult friends/testers. Users should be able to share a photo or short video, discover and follow people, interact with posts, and exchange messages with mutual followers.

- Launch Android first through a private, installable preview build.
- Keep the interface modern, clean, minimal, and mobile-first.
- Target $25/month in recurring service costs. This is a target, not a guaranteed billing cap.
- Keep the release date flexible: finish the agreed scope and essential checks before inviting users.
- Pilot is free, with no advertising, billing, subscriptions, or commercial tracking.
- Likely v2 additions are iOS and push notifications. Preserve cross-platform structure without implementing those releases now.

The pilot succeeds when invited users can reliably complete onboarding, posting, following, liking, commenting, and mutual-follow messaging on real Android devices, with authorization and deletion behavior verified.

## 2. Existing project and non-negotiables

Recorded project baseline:

| Item | Current value |
| --- | --- |
| Project | Codexgram |
| Expo | 57.0.26 installed; package range ~57.0.26 |
| React Native | 0.86.3 |
| React | 19.2.3 |
| Expo Router | 57.0.24 installed; package range ~57.0.24 |
| TypeScript | ~6.0.3 |
| Package manager | npm; package-lock.json exists and bun.lock was absent |
| Current UI | Starter root stack and placeholder index screen |
| External setup | User reported no configured services |

Required stack:

- Expo/React Native with Expo Router for all navigation.
- Native tabs: Home, Messages, Explore, Profile.
- NativeWind for styling. Version 4.2.7 is the documented SDK 57-compatible candidate checked during the interview; recheck before installation.
- Clerk for authentication; Google and Apple sign-in are both release requirements.
- Convex for backend logic, database, real-time data, and media storage.
- EAS for cloud builds and private Android distribution.

Follow AGENTS.md throughout implementation:

- Read the actual Expo major version and matching versioned documentation before touching Expo, EAS, or React Native APIs.
- Use the Expo documentation index to find current guidance rather than relying on remembered APIs.
- Install dependencies with `npx expo install <package>`. If the project later adopts Bun, use `bunx` as directed by AGENTS.md.
- Keep route files in `src/app/`; keep components, hooks, utilities, and other non-route code outside it.
- Configure generated native behavior through app config and plugins. Do not hand-create or edit generated native directories.
- Use development builds when required by native dependencies.
- Run lint and typecheck before declaring implementation work complete.
- Preserve existing user edits. The workspace already contained modified and deleted starter files when this document was prepared.

## 3. Agreed product behavior

### Access and authentication

- Use Google or Apple through Clerk; no password-based sign-in is requested.
- Restrict membership through an email allowlist.
- Check access on the backend, not only through navigation guards.
- If the authenticated email is not approved, show an access-pending screen rather than application content.
- Apple users may authenticate with a private relay email. Display that authenticated address on the pending screen so the user can contact the owner outside the app; the owner manually approves it.
- Apple configuration remains a release dependency even though Android launches first.
- Apple developer-account enrollment or setup costs are outside the $25 monthly hosting target.
- Returning approved users with completed profiles enter Home; incomplete profiles return to onboarding.

### First session and profiles

1. Open the app and sign in.
2. Pass the allowlist check, or see the access-pending screen.
3. Choose a unique username and a required display name.
4. Optionally add an avatar and bio.
5. Enter Home. If it is empty, show a clear route to Explore to find people.

Users can view and edit their profiles. Profiles should expose the user's posts and follow/unfollow actions where appropriate. Email addresses and admin-only membership information must not become public profile fields.

### Four main tabs

| Tab | Behavior |
| --- | --- |
| Home | Own and followed users' visible posts, newest first; plus button in the header for creating a post |
| Messages | Existing one-to-one conversations, unread counts, and live text messaging |
| Explore | All accessible pilot posts, newest first, plus user search |
| Profile | Own profile, own posts, editing, settings, sign-out, and account deletion |

Secondary screens include another user's profile, post detail/comments, post creation, conversation, profile editing, settings, and administration. They are not additional main tabs.

### Posts and media

- One image or one video per post; optional caption.
- Select media from the device library. No in-app camera or editor.
- Image limit: 10 MB.
- Video limits: 25 MB and 30 seconds.
- Videos start only when tapped; no feed autoplay.
- No video transcoding service in v1.
- Creation flow: Home header plus button → library selection → validation and preview → optional caption → upload/publish → visible post.
- Show upload progress or a clear pending state, success, and actionable failure/retry feedback.
- A failed upload must not publish a broken post. Unused uploaded files require cleanup.
- Posts are visible to signed-in, approved users, subject to blocking and moderation.
- Authors can delete their own posts. Deletion also removes associated interaction records and stored media through reliable cleanup.

Accepted media-access limitation: Convex direct file URLs can be opened by anyone who obtains the URL. Blocking and membership checks restrict in-app visibility, but do not revoke previously copied media links. Deleting the underlying file revokes that stored resource; already downloaded copies cannot be recalled.

### Following, likes, and comments

- Follow/unfollow other users; no private-account approval requests.
- One like per user per post, with unlike support.
- Flat text comments; no nested replies or comment likes.
- Users can delete their own comments.
- No editing published captions or comments in v1.
- All actions must enforce current access, blocking, ownership, and target existence on the server.

### Messaging

- One conversation per pair of users.
- Live text messages and per-user unread counts.
- Starting a conversation and sending each new message require mutual follows.
- If either user unfollows, both retain history but cannot send until mutual following is restored.
- Blocking stops new messages and preserves readable history.
- No group chat, attachments, typing indicators, read receipts, or push notifications.
- Pending/failed sends must be distinguishable from confirmed messages. Retrying must not create duplicates.

### Blocking and reporting

- Users can block others and report posts or accounts.
- Blocking removes follows in both directions and hides each user's profile and posts from the other.
- Block checks apply across feeds, search, profiles, post details, and mutations, not just buttons.
- Existing chat history remains readable; new messages are disabled.
- Unblocking does not restore prior follow relationships automatically.
- Reports are reviewed manually by the owner/admin.

### Administration

Provide a protected screen outside the four tabs for:

- Managing approved email addresses and membership access.
- Reviewing reports and recording their disposition.
- Removing reported content and revoking user access.
- Pausing new media uploads when usage approaches the budget target.

Admin permissions must be server-enforced. Ordinary users must not be able to promote themselves or access the report queue.

### Account deletion

- Self-service account deletion with explicit confirmation.
- Delete the profile, posts, comments, likes, follow relationships, and owned media; clean up related blocks and other live references.
- Preserve sent messages for recipients under a deleted-user identity. Message text itself may still identify its former sender.
- Coordinate Clerk identity deletion with Convex data cleanup.
- Immediately disable the deleting account's app access while cleanup is in progress.
- Treat cross-service cleanup as retryable work; partial failures must be recoverable.
- Administrative record retention and what happens to an allowlist entry after deletion remain explicit planning defaults/risks below rather than silently retaining personal information.

### Appearance and connectivity

- Neutral black/white/gray surfaces with restrained accents.
- Follow the device's light/dark appearance.
- Online-first. Show loading, empty, disconnected, and error states.
- Preserve unsent text while its screen remains open; provide manual retry after failures.
- No persistent offline feed, restart-safe drafts, or offline write queue.
- Avoid duplicate writes if a response is lost after the server has already accepted an operation.

## 4. Architecture and data ownership

| Subsystem | Responsibility |
| --- | --- |
| Expo client | Screens, native navigation, styling, media selection/playback, temporary input state, presentation of live data |
| Clerk | Authentication identity, OAuth provider flows, sessions, secure client session persistence |
| Convex functions | Membership, authorization, business rules, validation, queries, mutations, and external-service actions |
| Convex database | Source of truth for profiles, social graph, posts, comments, conversations, moderation, and read state |
| Convex storage | Uploaded media and lifecycle cleanup |
| EAS | Development/preview builds and Android signing/distribution |

Use Clerk's stable identity to link an authenticated user to a Convex profile. Do not use a client-supplied email or user ID as proof of identity. Match verified provider identity information during access approval and bind membership to the authenticated identity.

Use Convex's current documented Clerk integration and reactive queries. Keep authoritative data in Convex rather than duplicating it in a second client-side database. Paginate feeds, comments, and messages; avoid unbounded reads.

Business rules must hold even if a client directly calls backend functions. Conversation membership, block state, mutual follows, and account status must be checked at the point of sending. Enforce uniqueness transactionally for usernames, follows, likes, and conversation pairs.

Keep provider credentials and backend administrative secrets outside the app bundle. Only intended public configuration belongs in client-visible environment variables.

## 5. Logical data model

This is a logical schema, not generated database code. Exact field names, indexes, validators, and package-specific types will be finalized against current documentation during implementation planning.

| Entity | Essential fields and relationships | Key rules |
| --- | --- | --- |
| Profile | Clerk identity, normalized username, display name, optional avatar/bio, role, access/deletion status, timestamps | One profile per Clerk identity; unique normalized username; display name required |
| Invitation/membership | Normalized approved email, status, approving admin, optional bound identity, timestamps | Approvals are server-controlled; revocation stops app access |
| Post | Author, storage reference, media type, size, dimensions, optional duration/caption, creation time | One media item; ownership and limits validated |
| Follow | Follower and followed profile IDs, creation time | Unique directed pair; no self-follow or blocked relationship |
| Like | User ID, post ID, creation time | Unique user/post pair |
| Comment | Author, post ID, text, creation time | Flat comments; author or authorized admin removal |
| Block | Blocking user, blocked user, creation time | Unique directed pair; either direction denies social visibility and messaging |
| Conversation | Canonical participant pair, last-message summary/time | Exactly two participants; unique pair |
| Message | Conversation, sender/deleted-user reference, text, creation time, retry identifier | Participant-only history; current mutual follows required for new sends |
| Read state | Conversation, user, last-read position | Private unread computation; not exposed as read receipts |
| Report | Reporter, account/post target, reason, status, timestamps, review outcome | Admin-only queue; no exposure to reported user |
| Admin action | Actor, target, action, timestamp, minimal audit context | No secrets or unnecessary content in audit records |
| Operational state | Upload pause flag, upload intents/cleanup jobs, deletion progress | Server-controlled, retryable cleanup without double-processing |

Post publication, message sending, cleanup, and cross-service deletion need idempotent behavior. Do not expose operational records through ordinary social queries.

## 6. Explicit assumptions and proposed defaults

The user approved the product choices above. The following details are proposed defaults rather than answers explicitly supplied during the interview; keep them labeled and resolve any material disagreement before implementing the affected behavior.

- English-only v1 with accessible labels, readable contrast, usable touch targets, and larger-text support.
- User search matches usernames and display names; no hashtag or caption search.
- Profile editing includes username changes, subject to uniqueness.
- One owner/admin initially, bootstrapped securely outside ordinary registration.
- Separate development and pilot-production service environments; manual releases initially.
- Convex subscriptions provide real-time state; local state is limited to temporary UI and inputs.
- No separate activity-notification feed in v1.
- No message editing, unsending, or user-facing conversation deletion in v1.
- No automated moderation or recommendation engine.
- Minimal operational logs, admin audit events, and provider usage monitoring; no message bodies, access tokens, or provider secrets in logs.
- Use provider usage alerts where available and documented manual monitoring otherwise; the owner can pause uploads. Do not promise automatic hard budget enforcement.
- Use pagination and mobile list virtualization; stop video playback when its screen is no longer active.
- Retry cleanup and deletion in background jobs while keeping affected content inaccessible immediately.
- Proposed account-deletion default: revoke membership and require a fresh invitation to rejoin; retain only the minimal audit/deletion evidence necessary for operating the pilot, with retention decided before launch.
- Proposed block default: hide blocked authors' comments in ordinary post views; keep previously received conversation history as agreed.
- Proposed admin privacy default: no general-purpose DM browsing screen. Backend operators still have technical data access; do not claim end-to-end encryption.
- Detailed text limits, username syntax, accepted media formats, request throttles, retention periods, and retry schedules must be chosen explicitly in the implementation specification. No arbitrary values were agreed during the interview.

## 7. Out of scope for v1

- iOS or web release and public app-store launch.
- Public signup without invitation, private accounts, and follow requests.
- Carousels, in-app camera, filters, editing, or video transcoding.
- Ranked feeds, hashtag discovery, saved posts, reposts, or stories/reels features.
- Comment replies/likes and editing published posts/comments.
- Group messaging, DM media, typing indicators, read receipts, and push notifications.
- Persistent offline storage, offline sending, and durable drafts.
- Billing, ads, paid tiers, and commercial tracking.
- Separate web administration application.

## 8. Step-by-step implementation checklist

Complete one phase at a time. Record the actual files changed, checks performed, outcomes, and unresolved blockers in the progress log. Do not mark a phase done merely because its UI exists.

### Phase 0 — Validate prerequisites and close technical unknowns

- [ ] Review current repository state and preserve user modifications.
- [ ] Recheck installed versions, versioned Expo docs, native-tabs guidance, and current Clerk/Convex/NativeWind compatibility.
- [ ] Pin the selected dependency versions and document any compatibility constraint.
- [ ] Verify Android Google and Apple OAuth requirements, callback/deep-link behavior, and Apple developer setup.
- [ ] Confirm media format support, duration/size validation, and physical-device playback within the agreed limits.
- [ ] Validate Convex media delivery and the accepted direct-URL privacy limitation.
- [ ] Estimate storage and delivery usage for the pilot; check actual provider pricing and alert availability.
- [ ] Resolve the proposed defaults and remaining validation, retention, throttling, and cleanup policies required for implementation.
- [ ] Confirm app identifier, project ownership, admin identity, and service region using non-secret configuration.

Acceptance: required provider flows and media approach are feasible; exact dependencies and remaining policies are documented. If an agreed requirement is infeasible, flag the conflict rather than silently substituting a stack or feature.

### Phase 1 — Application foundation

- [ ] Configure NativeWind, shared theme tokens, system appearance, and reusable accessible controls.
- [ ] Establish the four native tabs with Expo Router and secondary stack/modal routes.
- [ ] Add provider configuration, environment-variable templates, and development/pilot separation.
- [ ] Establish lint/typecheck configuration and resolve baseline toolchain issues deliberately.
- [ ] Configure an EAS development build and verify the shell on Android.

Acceptance: navigation, theme changes, keyboard/safe-area behavior, and screen loading/error patterns work on a device; no secrets are bundled.

### Phase 2 — Identity, invitation gate, and profile onboarding

- [ ] Configure Clerk with Google and Apple and integrate authenticated Convex access.
- [ ] Implement backend membership checks, pending-access UI, and manual relay-email approval.
- [ ] Bootstrap the owner/admin securely.
- [ ] Implement required username/display-name onboarding and optional avatar/bio.
- [ ] Implement profile editing, sign-out, and correct returning-user routing.

Acceptance: both providers work in the Android build, duplicate usernames are rejected, unapproved/revoked users cannot read protected data, and interrupted onboarding resumes correctly.

### Phase 3 — Media posting and post lifecycle

- [ ] Implement media selection, preview, limits, caption entry, and publish feedback.
- [ ] Implement authorized upload intents, validation, post publication, and orphan-file cleanup.
- [ ] Implement post rendering, tap-to-play video, and author deletion.
- [ ] Handle permission denial, canceled selection, upload failures, and unsupported files clearly.

Acceptance: valid image/video posts publish; invalid media does not; retry does not duplicate a post; failure leaves no permanent broken post; deletion cleans up records and media.

### Phase 4 — Feeds, discovery, following, and interactions

- [ ] Implement paginated Home and Explore feeds and user search.
- [ ] Implement other-user profiles, follow/unfollow, and own-post profile listings.
- [ ] Implement likes, flat comments, comment deletion, and post-detail navigation.
- [ ] Add empty states, refresh behavior, optimistic feedback with error recovery where appropriate, and authorization checks.

Acceptance: ordering and feed membership match the specification; own posts appear on Home; duplicate likes/follows are impossible; unauthorized deletion is rejected.

### Phase 5 — Mutual-follow messaging

- [ ] Implement unique pair conversations, real-time messages, inbox summaries, and unread counts.
- [ ] Add pending/failed send states and retry deduplication.
- [ ] Enforce mutual follows on every send and participant checks on history reads.
- [ ] Preserve history after unfollow while disabling further sending.

Acceptance: two-device messaging works without duplicate conversations/messages; unread counts are private and accurate; nonparticipants cannot read history; an unfollow immediately prevents subsequent sends.

### Phase 6 — Blocking, reporting, and pilot administration

- [ ] Implement block/unblock and apply visibility rules consistently across all queries and actions.
- [ ] Remove both follow relationships on block; retain read-only conversation history.
- [ ] Implement account/post reports and protected admin review/removal flows.
- [ ] Implement allowlist/access management, audit events, and server-enforced upload pause.

Acceptance: blocking cannot be bypassed by opening a detail route or calling a mutation directly; ordinary users cannot access admin operations; pausing uploads does not unnecessarily disable text features.

### Phase 7 — Account deletion and reliability

- [ ] Implement confirmed self-service deletion and immediate access disablement.
- [ ] Coordinate Clerk deletion, social-data cleanup, owned-file deletion, and message tombstones.
- [ ] Add retryable cleanup tracking, bounded batches, and recovery for partial failures.
- [ ] Verify disconnected/error states and that sensitive data is not logged.

Acceptance: deletion is recoverable across failures, does not leak live profile content, and preserves recipients' message history under a deleted-user identity.

### Phase 8 — Release verification and private pilot

- [ ] Run focused automated authorization/data-integrity tests and device smoke tests.
- [ ] Run lint, typecheck, and dependency/configuration diagnostics.
- [ ] Validate light/dark appearance, larger text, small screens, media playback, and slow/interrupted networks.
- [ ] Verify real Android Google/Apple sign-in, redirect recovery, session expiry, and invitation revocation.
- [ ] Configure service usage monitoring, the operational checklist, and privacy/deletion disclosures matching actual behavior.
- [ ] Produce a self-contained private Android preview build; verify installation without a development server.
- [ ] Confirm both provider configurations and all release dependencies before inviting testers.

Acceptance: all critical journeys and permission boundaries pass, the signed preview installs successfully, and the owner can review reports, revoke access, pause uploads, and recover failed cleanup.

## 9. Test matrix and definition of done

| Area | Required scenarios |
| --- | --- |
| Authentication | Google/Apple success, cancellation, callback failure, session expiry, returning users |
| Membership | Approved email, unknown email, Apple relay approval, revocation during an active session |
| Profiles | Required values, case-normalized username collision, concurrent claims, editing |
| Uploads | Valid files, over-limit files/duration, unsupported formats, cancellation, lost responses, retries, orphan cleanup |
| Feeds | Empty state, correct newest-first ordering, pagination, follow/unfollow changes, deletion |
| Interactions | Duplicate-like prevention, ownership checks, deleted targets, blocked targets |
| Messaging | Two devices, pair uniqueness, duplicate-send retry, unread state, nonparticipant denial, unfollow/block races |
| Moderation | Reporting, admin-only access, removal, revocation, upload-pause bypass attempts |
| Deletion | Clerk/Convex partial failure, restart/retry, media cleanup, deleted identity, preserved messages |
| Mobile UX | Small screens, keyboard, back navigation, light/dark, larger text, slow/offline transitions |
| Distribution | Private build installation, no Metro dependency, production configuration, OAuth redirects |

Use meaningful behavior tests rather than tests that merely mirror components. Run `npx expo lint` and `npx tsc --noEmit`; use `npx expo-doctor` for dependency/configuration diagnostics. Run targeted checks after each phase and broader end-to-end checks for release. Record failures honestly rather than marking a phase complete.

## 10. Cost, operations, and remaining risks

- $25/month is an operating target, excluding developer-account setup costs. It is not a provider-enforced ceiling.
- Media playback can continue generating bandwidth costs while uploads are paused. Monitor storage, delivery, database/function usage, and any build charges.
- Exact service tiers, quotas, prices, alert support, and regional differences must be rechecked before configuration.
- Android Apple sign-in requires the browser-based/provider configuration path, not simply the iOS native module. Real-device OAuth verification is a release gate.
- NativeWind/Clerk/Convex compatibility must be validated together with the installed SDK before feature work depends on it.
- Without transcoding, supported video formats and validation need particular attention. Do not silently accept files that cannot play on target devices.
- Direct media URLs have the explicitly accepted privacy limitation described above; the app does not promise revocable access to downloaded content.
- Multi-service deletion, retry deduplication, media cleanup, and block/unfollow races are the main data-integrity risks.
- Retained message text may identify deleted users; deletion disclosures must say this clearly.
- Manual moderation and access approval depend on owner availability.
- Final acceptance limits and operational thresholds are not inferred from the interview; document them before the affected phase is implemented.

## 11. Documentation references

These sources were consulted during the interview. Reopen the relevant current/versioned documentation before implementation; documentation evidence is not a substitute for running the app.

- [Expo SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/)
- [Expo documentation index and corrections](https://docs.expo.dev/llms.txt)
- [Expo Router native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [EAS documentation](https://docs.expo.dev/eas/index.md)
- [NativeWind installation and SDK 57 support](https://www.nativewind.dev/docs/getting-started/installation)
- [Convex and Clerk integration](https://docs.convex.dev/auth/clerk)
- [Clerk Apple sign-in](https://clerk.com/docs/expo/guides/configure/auth-strategies/sign-in-with-apple)
- [Clerk Apple social connection configuration](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/apple)
- [Convex file serving and access limitations](https://docs.convex.dev/file-storage/serve-files)
- [Convex pricing](https://www.convex.dev/pricing)
- [Clerk pricing](https://clerk.com/pricing)

## 12. Progress log and next session

| Date | Work | Status |
| --- | --- | --- |
| 2026-10-05 | Product interview and initial repository inspection | Complete |
| 2026-10-05 | Save agreed specification and phased implementation checklist | Complete |
| 2026-10-05 | Baseline typecheck | Failed: archived example/ files import removed starter modules through @/ aliases; resolve in Phase 1 |
| 2026-10-05 | Baseline lint attempt | Blocked: ESLint/config missing; Expo attempted automatic dependency setup, which was stopped and manifest changes reverted to keep this update documentation-only |
| Pending | Phase 0: prerequisites and technical validation | Not started |

Next session: read this file and AGENTS.md, inspect the current working tree, then begin Phase 0. Do not restart the product interview or treat unchecked items as implemented. Preserve the distinction between confirmed decisions, proposed assumptions, and unresolved technical risks.
