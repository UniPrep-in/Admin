# Project Overview

This project is built using the Next.js App Router architecture, following a modern full-stack approach where both frontend and backend logic coexist within the same codebase.

It serves as a secure administrative CMS for managing exam preparation data, including test creation, question management, and flashcards.

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router root
│   ├── api/              # Backend API routes (REST endpoints)
│   ├── auth/             # Authentication pages (login/logout UI)
│   ├── components/       # Reusable UI components (Navbar, UI elements)
│   ├── dashboard/        # Protected admin panel
│   │   ├── create-test/  # Test creation workflow
│   │   ├── flashCard/    # Flashcard management
│   │   ├── tests/        # List of all tests
│   │   │   └── [id]/     # Dynamic test detail/edit page
│   ├── lib/              # Core utilities (Supabase setup, helpers)
│   ├── profile/          # Admin profile management
│   └── (configs)         # layout.tsx, middleware.ts, globals.css
├── store/                # Global state management (Zustand)
│   ├── profileStore.ts
│   ├── questionStore.ts
│   └── testStore.ts
```

## ⚙️ Application Flow

### 1. 🔐 Authentication & Security

Implemented using **Supabase + Next.js Middleware**.

- Every request to `/dashboard/*` is intercepted via `middleware.ts`
- Auth session is retrieved securely using `@supabase/ssr`
- **Role-Based Access Control (RBAC)**:
  - Only users with `is_admin: true` in the `profiles` table can proceed.
  - Unauthorized users are redirected to `/auth`.

👉 _This ensures strict route-level protection, making the app enterprise-ready._

### 2. 🧠 Test & Question Management

Admins interact via:
- `/dashboard/create-test`
- `/dashboard/tests`

**State management handled by Zustand:**
- `testStore.ts` → manages test metadata
- `questionStore.ts` → handles question operations
- `profileStore.ts` → manages admin profile state

**Workflow:**
- UI captures inputs.
- Zustand stores manage temporary state.
- Data is persisted via:
  - Next.js API routes (`/api/tests`)
  - or directly to Supabase.

### 3. 📊 Bulk Upload via Excel

Integration with `xlsx` enables:
- Uploading Excel files containing large datasets.
- Parsing questions in-browser or API layer.
- Bulk insertion into Supabase.

👉 _This dramatically improves efficiency for large-scale test creation._

### 4. 🎨 Frontend Architecture

- Styled using **Tailwind CSS**.
- **Smooth UX enhancements:**
  - Scroll handling via **Lenis**.
  - Animations using **Motion** / **GSAP**.
- **Global Providers:**
  - Wrapped in `layout.tsx`.
  - Likely includes: Toast notifications, Theme/scroll context.
