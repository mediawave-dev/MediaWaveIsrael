# Roadmap — Sanity CMS Integration

## Phase 1: Sanity Project Setup ✅ COMPLETE
**Goal**: Install Sanity v3, configure in existing Vite project, embed Studio at /studio
**Tasks**: PLAN-1 (dependencies + config), PLAN-2 (embed Studio + Vite config)
**Dependencies**: None

## Phase 2: Content Schemas ✅ COMPLETE
**Goal**: Define all 10 content type schemas with Hebrew labels
**Tasks**: PLAN-1 (service, package, faq, blogPost, blockContent), PLAN-2 (project, testimonial, siteSettings, whyUs, howWeWork)
**Dependencies**: Phase 1

## Phase 3: Studio Customization ✅ COMPLETE
**Goal**: Custom desk structure, Hebrew UI, singleton pattern
**Tasks**: PLAN-1 (desk structure + Hebrew locale + singleton)
**Dependencies**: Phase 2

## Phase 4: Data Migration ✅ COMPLETE
**Goal**: Migrate all existing hardcoded content to Sanity
**Tasks**: PLAN-1 (static content: services, packages, FAQ, etc.), PLAN-2 (blog posts + portfolio with images)
**Dependencies**: Phase 2 + Manual step (Sanity project creation + write token)

## Phase 5: Frontend Integration ✅ COMPLETE
**Goal**: Replace hardcoded data with Sanity GROQ queries
**Tasks**: PLAN-1 (hook + queries + Portable Text), PLAN-2 (homepage sections), PLAN-3 (blog + portfolio)
**Dependencies**: Phase 4

## Phase 6: Live Preview ✅ COMPLETE
**Goal**: Real-time preview of draft content
**Tasks**: PLAN-1 (preview mode + banner + context)
**Dependencies**: Phase 5

## Phase 7: Polish, Test & Deploy ✅ COMPLETE
**Goal**: Performance check, deployment config, Hebrew client guide
**Tasks**: PLAN-1 (bundle optimization + Cloudflare config), PLAN-2 (client guide + env docs)
**Dependencies**: Phase 6

---

## Progress Tracker
| Phase | Status | Tasks |
|-------|--------|-------|
| 1. Setup | ✅ Complete | 2/2 |
| 2. Schemas | ✅ Complete | 2/2 |
| 3. Studio | ✅ Complete | 1/1 |
| 4. Migration | ✅ Complete | 2/2 |
| 5. Frontend | ✅ Complete | 3/3 |
| 6. Preview | ✅ Complete | 1/1 |
| 7. Polish | ✅ Complete | 2/2 |

**Total**: 13/13 tasks complete — PROJECT DONE
