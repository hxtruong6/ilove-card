# MVP Launch Plan 🚀

This document outlines the remaining critical tasks to get iCard to market. It supersedes `implementation_tasks.md` for the immediate future.

## 🎯 Objective

Launch a stable, mobile-friendly platform for creating and sharing festive message trees.

## 🚨 Critical Path (Must-Have)

### 1. Message System Polish

- [x] **Rich Text Integration**: Complete standard integration of Tiptap in `MessageForm`.
- [x] **Message Display**: Ensure `MessageCard` renders HTML content safely (sanitize).
- [x] **Empty States**: Add friendly "No messages yet" UI with call-to-action on Tree Canvas.

### 2. Mobile Experience (Mobile First)

- [x] **Responsive Navigation**: Ensure Navbar is fully functional on mobile (hamburger menu).
- [x] **Canvas Optimization**: Verify Tree scaling on small screens (prevent horizontal scroll).
- [x] **Touch Targets**: Ensure buttons (Edit/Delete/Add) are easily tappable (min 44px).

### 3. Sharing & SEO

- [x] **Dynamic Metadata**: Implement Next.js `generateMetadata` for Tree pages.
  - Title: "{Tree Name} by {User}"
  - Description: "Send a festive message to {User}'s tree!"
  - OG Image: Dynamic OpenGraph image generation (bonus) or static festive fallback.
- [x] **Share Flow**: Verify generic "Copy Link" works on all devices.

### 4. Stability & Security

- [x] **Auth Fix**: Refactor `failedLoginAttempts` to use Database (Prisma) instead of in-memory Map (critical for serverless).
- [x] **Error Boundaries**: Add simplified Error Boundaries for Tree and Dashboard pages.

## 🧪 Verification

- [x] **E2E Smoke Test**:
  1. Register generic user.
  2. Create Tree (Christmas Theme).
  3. Share Link (Incognito).
  4. Post Message as Guest.
  5. Login as Owner -> Delete Guest Message.
- [ ] **Vercel Deploy**: Confirm build passes and env vars are set.

## 📦 Post-MVP (Backlog)

- Real-time updates (removed from scope).
- Drag-and-drop positioning.
- Advanced Analytics/Admin Dashboard.
- Email Sharing integration (use system share for now).
