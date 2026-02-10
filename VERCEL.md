Vercel Deployment

Steps to deploy this Vite React app to Vercel:

1. Connect the repository to Vercel (Import Project).
2. Set the following Environment Variable in the Vercel project settings:
   - `VITE_API_BASE` -> e.g. `https://your-backend.example.com/api`

3. Build Settings (Vercel should detect automatically from `package.json`):
   - Framework: None (Static)
   - Build Command: `npm run build` (or `npm run vercel-build`)
   - Output Directory: `dist`

4. (Optional) Set Node Version: The project requests Node 18 via `package.json` `engines`.

5. Deploy. The `vercel.json` routes are configured so all client routes are served from `index.html` (SPA).

Notes:
- Ensure any backend CORS and production API endpoints are configured and reachable from Vercel.
- If your backend requires authentication for logout or other actions, add the appropriate endpoints and update the frontend accordingly.
