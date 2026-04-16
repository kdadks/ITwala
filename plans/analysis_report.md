# Comprehensive Codebase Analysis Report

## 1. Project Structure & Dependencies
- **Framework**: Next.js (v16) with TypeScript.
- **State / Data Layer**: Supabase client (`src/lib/supabaseClient.ts`) used across API routes and client‑side hooks.
- **Styling**: Tailwind CSS with several plugins (aspect‑ratio, forms, typography).
- **UI**: Headless UI, Heroicons, Radix Slot, Lucide icons, Framer Motion.
- **Utilities**: A large `src/utils` folder containing helpers for analytics, currency, location, PDF generation, etc.
- **Pages**: Mixed static and server‑rendered pages under `src/pages`, plus an extensive admin section.

## 2. Architectural Weaknesses
| Issue | Location | Impact | Recommendation |
|-------|----------|--------|----------------|
| **Tight coupling to Supabase** | Multiple utils (`analytics.ts`, `currency.ts`, `siteSettings.ts`) and components directly import the Supabase client. | Hard to swap data source, testing becomes difficult. | Introduce a thin **data‑access layer** (e.g., `src/services/*`) that abstracts Supabase calls. Components consume services via hooks. |
| **Missing separation of concerns** | UI components contain business logic (e.g., price calculation in `CourseBanner.tsx`). | Reduces reusability and bloats components. | Move business logic to dedicated utility functions or service hooks. |
| **Monolithic utils** | `src/utils` holds many unrelated helpers (analytics, PDF, location, currency). | Increases cognitive load, risk of accidental imports. | Split into domain‑specific modules (`src/utils/analytics/*`, `src/utils/pdf/*`, etc.) and expose only needed functions. |
| **Global mutable state** | `sessionStorage` and `localStorage` accessed directly in many places (e.g., `analytics.ts`). | Hard to mock in tests, potential race conditions. | Wrap storage access in a small abstraction (`storage.ts`) that can be stubbed. |
| **Lack of error handling** | API routes often assume successful Supabase responses (`.from(...).insert(...)` without try/catch). | Unhandled rejections can crash the server. | Centralise error handling middleware or utility (`handleSupabaseError`). |

## 3. Duplicated Logic
- **Currency formatting** appears in `src/utils/currency.ts` and also inline in several components (`CourseBanner`, `InvoicePreview`).
- **Country detection** logic duplicated between `src/utils/countryDetection.ts` and some API routes that fetch IP data.
- **Student ID generation** logic exists in `src/utils/locationData.ts` and older scripts under `scripts/`.

**Action**: Consolidate each duplicated piece into a single exported function and replace all inline copies.

## 4. Performance Hotspots
| Area | Observation | Suggested Fix |
|------|-------------|--------------|
| **Large page renders** | Pages like `src/pages/dashboard/index.tsx` import many heavy components (charts, tables) without code‑splitting. | Use dynamic `import()` with `next/dynamic` and enable `ssr: false` for client‑only heavy components. |
| **Repeated API calls** | `useAuth` hook fetches the current user on every render of protected pages. | Cache the user in a React context or SWR cache with a longer `revalidateOnFocus` interval. |
| **PDF generation** | `src/utils/pdfGenerator.ts` loads `jsPDF` and `autotable` on the client for every invoice preview. | Lazy‑load the PDF module only when the preview button is clicked. |
| **Analytics** | `analytics.ts` sends a request on every page view, including on static pages during build. | Guard analytics initialization with `if (process.env.NODE_ENV === 'production')` and debounce rapid navigation events. |

## 5. Best‑Practice Violations
- **Naming**: Mixed camelCase and snake_case in Supabase column names (`site_settings` vs. `siteSettings`). Adopt a consistent convention.
- **Missing Types**: Several utility functions use `any` (e.g., `hydrateModuleIds`). Replace with proper TypeScript interfaces.
- **Security**: API routes expose raw Supabase keys via environment variables without server‑side protection checks. Ensure `NEXT_PUBLIC_` prefix is not used for secret keys.
- **Linting**: Some files lack ESLint compliance (unused imports, console.log). Run `npm run lint -- --fix`.

## 6. Refactoring Recommendations (code snippets)
### 6.1 Centralised Supabase Service
```ts
// src/services/supabaseService.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PRIVATE_SUPABASE_KEY!);

export const fetchSiteSettings = async () => {
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) throw error;
  return data;
};

// other CRUD helpers …
export default supabase;
```
Replace direct `supabase.from(...)` calls with the above helpers.

### 6.2 Shared Currency Formatter
```ts
// src/utils/formatters/currency.ts
export const formatCurrency = (amount: number, locale = 'en-IN') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR' }).format(amount);
```
Import this function wherever currency is displayed.

### 6.3 Dynamic Import for PDF Generation
```tsx
// src/components/admin/InvoicePreview.tsx
const loadPdf = () => import('../../utils/pdfGenerator');
const handlePreview = async () => {
  const { generateInvoicePDF } = await loadPdf();
  const blob = await generateInvoicePDF(invoiceData);
  // …
};
```

## 7. Prioritized Action Plan
| Priority | Task | Estimated Effort |
|----------|------|------------------|
| **P1** | Create a Supabase service layer and replace direct client usage. | Small |
| **P1** | Consolidate duplicated currency and country utilities. | Small |
| **P2** | Split `src/utils` into domain‑specific subfolders and update imports. | Medium |
| **P2** | Add proper TypeScript typings for any‑typed functions. | Medium |
| **P3** | Implement dynamic imports for heavy components (PDF, charts). | Medium |
| **P3** | Introduce global error‑handling wrapper for Supabase calls. | Medium |
| **P4** | Review and fix security exposure of secret keys in env files. | Small |
| **P4** | Run linting, fix naming inconsistencies, and enforce ESLint rules. | Small |

## 8. Next Steps
1. **Approve the plan** – once approved, the implementation can be split into the above tickets.
2. **Create issue tickets** in the project tracker for each priority block.
3. **Start with the service layer** to unlock easier testing and future data‑source swaps.

---
*Generated by the architectural analysis assistant.*

