# Goal: Improve Next.js Performance & Bundle Size

**Objective:** Reduce LCP to <2.5s and cut bundle size by 30% for the workremotehub-next project.

## Current Context
- Next.js 14.2.0 project with Prisma, NextAuth, TailwindCSS.
- No explicit code splitting, image optimization, or caching strategies in place.
- Bundle analysis not currently integrated.

## Proposed Approach
1. Implement route-based code splitting using dynamic imports.
2. Optimize images with Next.js Image component (format, lazy loading, priority).
3. Add Incremental Static Regeneration (ISR) for suitable pages.
4. Integrate @next/bundle-analyzer to monitor progress.
5. Audit and remove unused dependencies.

## Step-by-Step Plan
1. **Setup Bundle Analyzer**
   - Install `@next/bundle-analyzer` as dev dependency.
   - Modify `next.config.js` to enable analyzer via env flag.
   - Run build and capture baseline bundle stats.

2. **Dynamic Imports for Heavy Components**
   - Identify large components (e.g., charts, maps, rich editors) via bundle analysis.
   - Replace static imports with `next/dynamic` (with loading fallback).
   - Focus on pages: dashboard, analytics, article editor.

3. **Image Optimization**
   - Search for `<img>` tags in pages/components.
   - Replace with `next/image`, specifying width/height, using `blurDataURL` or `placeholder`.
   - Set `loader` to default or custom if using external storage.

4. **Implement ISR**
   - Determine pages with semi-static content (e.g., blog articles, user profiles).
   - Export `getStaticProps` with `revalidate` interval (e.g., 60 seconds).
   - Keep `getServerSideProps` where auth/data freshness is critical.

5. **Dependency Audit**
   - Run `npm ls` or use `depcheck` to find unused packages.
   - Remove or replace heavy dependencies with lighter alternatives.

6. **Verify & Iterate**
   - Run bundle analyzer after each major change.
   - Measure LCP using Chrome DevTools or Web Vitals extension.
   - Target: LCP <2.5s, bundle size reduction ≥30%.

## Files Likely to Change
- `next.config.js` (add bundle analyzer)
- `pages/_app.js` or layout (if applying global dynamic imports)
- Component files: `components/Chart.tsx`, `components/Map.tsx`, etc.
- Page files: `pages/dashboard.tsx`, `pages/articles/[slug].tsx`, etc.
- `package.json` (add/remove dependencies)

## Validation Steps
- [ ] Bundle analyzer shows reduced JS/CSS size.
- [ ] LCP measured in DevTools <2.5s on mobile emulation.
- [ ] No regression in functionality (test critical user flows).
- [ ] ISR pages update after revalidate interval without full rebuild.

## Risks & Tradeoffs
- **Risk:** Over-splitting may increase waterfall if not careful. Mitigate by splitting at route level and using `loading` fallback.
- **Tradeoff:** ISR introduces slight staleness; adjust revalidate time based on content criticality.
- **Risk:** Image optimization may break if dimensions not set; enforce via lint or PR checklist.

## Open Questions
- Which pages benefit most from ISR vs. SSR? (Decide after traffic analysis.)
- Are there any third-party scripts impacting LCP? (Audit with DevTools.)
