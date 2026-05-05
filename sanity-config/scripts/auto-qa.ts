/**
 * scripts/auto-qa.ts
 * 
 * Automated QA pipeline for destination documents.
 * Run: npx ts-node sanity/scripts/auto-qa.ts
 * 
 * Scores 0–100. Auto-approves ≥80 with zero issues.
 * 
 * Workflow:
 *   Pipeline creates → Auto QA scores → ≥80 = approved → <80 = needs_review
 *   Restaurants/hidden gems with flags → local_check
 *   Published only after editor_approved = true
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token:     process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-18',
  useCdn: false,
})

// ─── Banned phrases ────────────────────────────────────────────────────────────
const BANNED = [
  'hidden gem', 'hidden gems',
  'paradise', 'postcard-perfect', 'postcard perfect',
  'off the beaten path', 'off-the-beaten-path',
  'nestled', 'crystal-clear waters', 'crystal clear waters',
  'breathtaking', 'stunning', 'magical',
  'picturesque', 'charming little',
  'unspoiled', 'untouched',
]

// ─── QA function ──────────────────────────────────────────────────────────────
async function qaDestination(doc: any) {
  const issues: string[] = []
  let score = 100

  // ── Field completeness ────────────────────────────────────────────────────
  if (!doc.hero_image)                       { issues.push('Missing hero image');         score -= 20 }
  if (!doc.tagline)                          { issues.push('Missing tagline');             score -= 10 }
  if (!doc.intro_paragraph)                  { issues.push('Missing intro paragraph');     score -= 15 }
  if (!doc.body_content?.length)             { issues.push('Missing body content');        score -= 20 }
  if ((doc.gallery?.length ?? 0) < 8)        { issues.push(`Gallery < 8 (has ${doc.gallery?.length ?? 0})`); score -= 10 }
  if (doc.hidden_gems?.length !== 3)         { issues.push(`Hidden gems: need 3, have ${doc.hidden_gems?.length ?? 0}`); score -= 5 }
  if (doc.gastronomy?.length !== 3)          { issues.push(`Gastronomy: need 3, have ${doc.gastronomy?.length ?? 0}`);   score -= 5 }
  if (!doc.at_a_glance?.best_months?.length) { issues.push('Missing best months');         score -= 5 }
  if (!doc.at_a_glance?.crowd_level)         { issues.push('Missing crowd level');         score -= 3 }
  if (!doc.coordinates)                      { issues.push('Missing coordinates');         score -= 5 }

  // ── Banned phrases scan ───────────────────────────────────────────────────
  const allText = [doc.tagline, doc.intro_paragraph].filter(Boolean).join(' ').toLowerCase()
  for (const phrase of BANNED) {
    if (allText.includes(phrase)) {
      issues.push(`Banned phrase: "${phrase}"`)
      score -= 8
    }
  }

  // ── SEO checks ────────────────────────────────────────────────────────────
  if (!doc.seo?.meta_title)                        { issues.push('Missing meta title');       score -= 8 }
  if ((doc.seo?.meta_title?.length ?? 0) > 60)     { issues.push('Meta title > 60 chars');    score -= 3 }
  if (!doc.seo?.meta_description)                  { issues.push('Missing meta description'); score -= 5 }
  if (!doc.seo?.focus_keyword)                     { issues.push('Missing focus keyword');    score -= 4 }
  if ((doc.seo?.meta_description?.length ?? 0) > 160) { issues.push('Meta description > 160 chars'); score -= 2 }

  // ── Translation completeness ───────────────────────────────────────────────
  for (const lang of ['de', 'fr', 'it', 'es', 'ro', 'pl', 'ru', 'el']) {
    if (!doc.translations?.[lang]?.tagline)         { issues.push(`Missing ${lang} tagline`);         score -= 2 }
    if (!doc.translations?.[lang]?.intro_paragraph) { issues.push(`Missing ${lang} intro paragraph`); score -= 1 }
  }

  // ── Verification flags ────────────────────────────────────────────────────
  const needsVerifyCount   = doc.needs_verification?.length ?? 0
  const unverifiedRest     = doc.gastronomy?.filter((g: any) => g.needs_verification).length ?? 0
  const unverifiedGems     = doc.hidden_gems?.filter((g: any) => !g.verified).length ?? 0

  if (needsVerifyCount > 0) {
    issues.push(`${needsVerifyCount} field(s) need local verification`)
    score -= needsVerifyCount * 3
  }
  if (unverifiedRest > 0) {
    issues.push(`${unverifiedRest} restaurant(s) unverified`)
    score -= unverifiedRest * 5
  }

  // ── Score & auto-approve ──────────────────────────────────────────────────
  const finalScore  = Math.max(0, score)
  const auto_approve = finalScore >= 80 && issues.length === 0

  // Determine review_status
  let review_status = 'needs_review'
  if (auto_approve)                          review_status = 'approved'
  else if (unverifiedRest > 0 || unverifiedGems > 0) review_status = 'local_check'

  // ── Patch Sanity document ─────────────────────────────────────────────────
  await client.patch(doc._id).set({
    qa_score:       finalScore,
    qa_issues:      issues,
    review_status,
    editor_approved: auto_approve,
  }).commit()

  return {
    slug:         doc.slug?.current,
    score:        finalScore,
    issues,
    auto_approve,
    review_status,
  }
}

// ─── Batch runner ─────────────────────────────────────────────────────────────
async function runQABatch(filter?: string) {
  const query = filter
    ? `*[_type == "destination" && ${filter}]`
    : `*[_type == "destination" && review_status in ["ai_draft", "needs_review"]]`

  console.log(`\n🔍 Running QA on: ${query}\n`)
  const docs = await client.fetch(query)
  console.log(`Found ${docs.length} destinations to score.\n`)

  const results = await Promise.allSettled(docs.map(qaDestination))

  let approved = 0, needsReview = 0, localCheck = 0, errors = 0

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const r = result.value
      const icon = r.auto_approve ? '✅' : r.review_status === 'local_check' ? '📍' : '🔴'
      console.log(`${icon} ${r.slug ?? 'unknown'} — score: ${r.score} — ${r.issues.length === 0 ? 'No issues' : r.issues.join(' | ')}`)
      if (r.auto_approve)                   approved++
      else if (r.review_status === 'local_check') localCheck++
      else                                  needsReview++
    } else {
      console.error(`❌ Error:`, result.reason)
      errors++
    }
  }

  console.log(`\n─────────────────────────────────────────────────`)
  console.log(`✅ Auto-approved:   ${approved}`)
  console.log(`📍 Local check:     ${localCheck}`)
  console.log(`🔴 Needs review:    ${needsReview}`)
  console.log(`❌ Errors:          ${errors}`)
  console.log(`─────────────────────────────────────────────────\n`)
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
const filter = process.argv[2] // optional GROQ filter
runQABatch(filter).catch(err => {
  console.error('QA batch failed:', err)
  process.exit(1)
})
