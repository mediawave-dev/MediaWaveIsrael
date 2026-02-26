# Roadmap — Directus CMS Migration

## Phase 1: Infrastructure Setup
**Goal**: Docker Compose + dependencies + npm scripts + directory structure
**Tasks**: PLAN-1 (docker + dirs + gitignore + deps + scripts)
**Dependencies**: None
**Requirements**: R1, R2, R3, R23

## Phase 2: SDK Integration Layer
**Goal**: Create src/directus/ with client, types, hooks, queries, imageUrl, HtmlContent, mappers
**Tasks**: PLAN-1 (client + types + hooks), PLAN-2 (queries + imageUrl + HtmlContent + mappers + index)
**Dependencies**: Phase 1
**Requirements**: R7-R14, R24

## Phase 3: Seed Script
**Goal**: Create seed script that populates Directus with all content data
**Tasks**: PLAN-1 (seed script with all 10 collections)
**Dependencies**: Phase 1
**Requirements**: R4, R5, R6, R15, R16

## Phase 4: Component Migration — Simple Sections
**Goal**: Migrate 5 simple components (Services, WhyUs, HowWeWork, Packages, Contact)
**Tasks**: PLAN-1 (Services + WhyUs + HowWeWork), PLAN-2 (Packages + Contact)
**Dependencies**: Phase 2
**Requirements**: R17

## Phase 5: Component Migration — Complex Sections
**Goal**: Migrate 4 complex components (Testimonials, FAQ, Blog, BlogPost)
**Tasks**: PLAN-1 (Testimonials + FAQ), PLAN-2 (Blog + BlogPost)
**Dependencies**: Phase 2
**Requirements**: R18, R19, R20

## Phase 6: Build Config & Verification
**Goal**: Update vite config, env vars, verify everything works
**Tasks**: PLAN-1 (vite config + env + final verification)
**Dependencies**: Phase 4, Phase 5
**Requirements**: R21, R22, R25, R26, R27

---

## Progress Tracker
| Phase | Status | Tasks |
|-------|--------|-------|
| 1. Infrastructure | PENDING | 0/1 |
| 2. SDK Layer | PENDING | 0/2 |
| 3. Seed Script | PENDING | 0/1 |
| 4. Simple Components | PENDING | 0/2 |
| 5. Complex Components | PENDING | 0/2 |
| 6. Build & Verify | PENDING | 0/1 |

**Total**: 0/9 tasks complete
