# Clerk Authentication Setup Guide

## ✅ Setup Complete

Your React + Vite frontend has been integrated with **Clerk Authentication**. Here's what was done:

### Files Modified

1. **`package.json`** — Added `@clerk/clerk-react@^5.0.0` to dependencies
2. **`src/main.tsx`** — Wrapped the app with `<ClerkProvider>` (required for Vite)
3. **`src/pages/Login.tsx`** — Replaced custom form with `<SignIn />` component
4. **`src/pages/Signup.tsx`** — Replaced custom form with `<SignUp />` component
5. **`src/components/ProtectedRoute.tsx`** — Updated to use Clerk's `useUser()` hook
6. **`src/components/Layout.tsx`** — Updated to display Clerk user info and `signOut()`
7. **`.env.local`** — Created with `VITE_CLERK_PUBLISHABLE_KEY` placeholder

### Environment Variable Setup

**⚠️ IMPORTANT:** Get your Clerk Publishable Key and set it up:

1. Go to [Clerk Dashboard API Keys](https://dashboard.clerk.com/last-active?path=api-keys)
2. Select **React** as your framework
3. Copy your **Publishable Key**
4. Open `.env.local` (in the `Frontend/` directory) and replace:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```
   with your actual key.

**Example:**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_c2xvdWRpbm_example123
```

> **Note:** `.env.local` is in `.gitignore` — your key will never be committed to the repository.

### Next Steps

1. **Install dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Test the auth flow:**
   - Visit `http://localhost:5173` (or your Vite dev URL)
   - Click "Sign Up" or "Login"
   - Use Clerk's prebuilt forms to create an account
   - Sign in and navigate to protected routes (Dashboard, Upload, etc.)

### Key Clerk Components Used

- **`<ClerkProvider>`** — Wraps your app in `main.tsx`
- **`<SignIn />`** — Prebuilt sign-in component (replaces `/login`)
- **`<SignUp />`** — Prebuilt sign-up component (replaces `/signup`)
- **`useUser()`** — Hook to get current user info
- **`useClerk()`** — Hook for `signOut()` functionality
- **`<ProtectedRoute>`** — Redirects unauthenticated users to `/login`

### Configuration Details

- **Routing:** Uses Clerk's built-in routing (`path`-based) — no conflicts with React Router
- **Fallback redirects:** Authenticated users land on `/dashboard` after sign-in/sign-up
- **Sign-out redirect:** Users are redirected to `/` after signing out
- **User data in Layout:** Displays first/last name and email from `user.emailAddresses[0]`

### Verification Checklist

✅ Environment variable is `VITE_CLERK_PUBLISHABLE_KEY` (Vite-required prefix)  
✅ `<ClerkProvider>` is in `main.tsx` (app root)  
✅ No usage of deprecated `frontendApi`  
✅ Environment variables use placeholder only in code; real key in `.env.local`  
✅ Real keys excluded from git (`.env.local` is in `.gitignore`)  

### Troubleshooting

**Issue: "Missing Clerk Publishable Key" error**
- Solution: Ensure `.env.local` exists and has the correct environment variable name (`VITE_CLERK_PUBLISHABLE_KEY`)

**Issue: Sign-in/Sign-up forms don't appear**
- Solution: Verify your Publishable Key is correct and your app is running on the URL configured in Clerk Dashboard

**Issue: User info not displaying in sidebar**
- Solution: Ensure the user is signed in; the `useUser()` hook returns `null` until auth is confirmed

### Clerk Documentation

- [Clerk React Quickstart](https://clerk.com/docs/quickstarts/react)
- [Clerk API Reference](https://clerk.com/docs/reference/clerk-react)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-modes.html)

---

**Questions?** Review the [official Clerk docs](https://clerk.com/docs) or check the code comments in the updated files.
