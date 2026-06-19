# Vercel Deployment Tasks

- [x] 1. Create `server/vercel.json` — serverless config
- [x] 2. Modify `server/index.js` — remove listen/memory-server, export app
- [x] 3. Modify `server/middleware/multer.js` — use /tmp dir
- [x] 4. Create `server/clear-users.js` — wipe all users from Atlas
- [x] 5. Modify `src/config.js` — use REACT_APP_API_URL env var
- [x] 6. Create root `vercel.json` — frontend build config
- [x] 7. Update `.gitignore` — add server/node_modules, server/tmp
- [x] 8. Clear `server/.env` — credentials removed
- [x] 9. Run `clear-users.js` — 3 user accounts deleted from Atlas ✅
- [x] 10. Create walkthrough with Vercel deployment steps
