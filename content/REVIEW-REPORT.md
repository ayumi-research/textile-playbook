# Textile Playbook Lessons 1-8 — Review Report

**Review Date:** 2026-02-25  
**Reviewer:** Subagent (Kyra)  
**Scope:** Lessons 1-8 for consistency, flow, and quality

---

## Overall Quality Score: 8/10

**Summary:** Strong content with clear expertise. Minor structural inconsistencies and broken cross-references need fixing before compilation. All lessons deliver practical value and maintain consistent tone.

---

## Issues Found

### 1. Broken Cross-References (High Priority)

| Lesson | Issue | Fix |
|--------|-------|-----|
| **Lesson 2** | "Next: Lesson 3 — Design Optimization (or Lesson 4 — Three Questions)" | Remove "(or Lesson 4 — Three Questions)" |
| **Lesson 5** | "Next: Lesson 6 — Timeline Negotiation (or Lesson 7 — The Prototype Investment)" | Remove "(or Lesson 7 — The Prototype Investment)" |
| **Lesson 8** | References "Lesson 9 — Pricing Benchmarks That Actually Exist" | Remove or change to "End of Section" / "Coming Soon" |

**Lesson 2 and 5** appear to have internal editing notes that weren't cleaned up. The parenthetical alternatives suggest the author was unsure of the order and left both options.

**Lesson 8** ends with a reference to a Lesson 9 that doesn't exist in this compilation. Either Lesson 9 is planned and this is fine, or it should be removed/changed to indicate end of section.

---

### 2. Terminology Inconsistency (Medium Priority)

| Term | Usage | Recommendation |
|------|-------|--------------|
| **DTF vs Transfer vs Digital Transfer** | Lesson 1 uses "DTF" and "Digital transfer / DTG" interchangeably | Standardize on "DTF" (most common industry term) or define on first use |
| **Fremdware** | Lesson 2 uses German term without translation | Add translation: "customer-supplied goods (Fremdware)" — already done, but verify reader knows this is German |
| **DTG** | Mentioned once in Lesson 1 | Clarify if DTG (Direct-to-Garment) is treated as separate from DTF or synonymous |

**Suggestion:** Add a glossary or standardize terms in the intro. First mention of each technique should define it.

---

### 3. Pricing Consistency (Verified: Consistent)

No conflicts found. Prices align logically across lessons:

| Item | Lesson 2 | Lesson 7 | Status |
|------|----------|----------|--------|
| Digitizing/setup | €30-150 | — | ✓ Consistent |
| Sample/mockup | €20-50 | €20-50 (single physical) | ✓ Consistent |
| Color changes | €10-25 | — | ✓ Documented once |
| Rush fees | 20-100% / 1.25-3.0× | — | ✓ Lesson 6 adds granularity |

**Note:** Lesson 7's "€30 prototype" aligns with the lower end of Lesson 2's sample pricing (€20-50).

---

### 4. Format Uniformity (Minor Issues)

**Good:** All lessons follow the core structure:
- Quick Summary (H2 bold)
- Why This Saves You (H2 bold)
- `---` separator
- Body content with H2/H3 headers
- "Part of The Textile Playbook" footer
- "Next: Lesson X" pointer

**Inconsistencies:**

| Element | Standard | Exceptions |
|---------|----------|------------|
| Quick Summary length | 2-4 sentences | Lesson 1 (2 sentences) ✓, Lesson 3 (2 sentences) ✓ — actually consistent |
| Technical Detail section | Most have explicit "Technical Detail" or technique breakdown | Lesson 3 lacks explicit technical section header (just "By Technique") |
| Table column alignment | Most left-aligned | All consistent |
| Bullet style | Hyphens (`-`) | All consistent |

**Suggestion:** Consider adding explicit "Technical Detail" header to Lesson 3 for consistency, though "By Technique" works fine.

---

### 5. Table Formatting Consistency (Minor)

All tables use standard markdown pipe format. No formatting errors detected.

**Table density varies by content:**
- Lesson 1: 3 tables (decision framework, mismatches, rules)
- Lesson 2: 4 tables (pricing breakdown, hidden game, comparison, etc.)
- Lesson 3: No tables (text only) — intentional for short lesson
- Lesson 4: 3 tables (risk categories, questions, scoring rubric)
- Lesson 5: 1 table (true cost formula) — could add more
- Lesson 6: 4 tables (rush fees, timeline possibilities, seasonal, etc.)
- Lesson 7: 3 tables (when to prototype, red flags, pro types)
- Lesson 8: 2 tables (triage, supplier accountability)

**Lesson 3 and 5** are light on tables compared to others, but this fits their content. Not a problem.

---

### 6. Tone and Voice (Consistent)

**Strengths:**
- Direct, conversational tone throughout
- Second person "you" consistently used
- Practical examples with real numbers (euros, quantities)
- "The Rule" / "The Fix" framing used effectively
- "Real Example" / "Real Economics" sections ground theory in practice

**Consistent phrases:**
- "Quick Summary" vs "Executive Summary" — consistent
- "Why This Saves You" — consistent
- "The Rule" / "The Math" / "The Fix" — consistent pattern

**Minor variation:** Lesson 3's "By Technique" section is less narrative than others — but appropriate for the content.

---

### 7. Missing Content / Placeholders

| Location | Issue | Severity |
|----------|-------|----------|
| Lesson 2, footer | "(or Lesson 4 — Three Questions)" appears to be an editing note | Low |
| Lesson 5, footer | "(or Lesson 7 — The Prototype Investment)" appears to be an editing note | Low |
| Lesson 8, footer | References Lesson 9 which doesn't exist in this set | Medium (if not planned) |

---

## Suggestions for Fixes

### Priority 1 (Before Compilation)

1. **Fix Lesson 2 footer:**
   ```markdown
   *Next: Lesson 3 — Design Optimization*
   ```

2. **Fix Lesson 5 footer:**
   ```markdown
   *Next: Lesson 6 — Timeline Management*
   ```

3. **Fix Lesson 8 footer:** (if Lesson 9 not included)
   ```markdown
   *Part of The Textile Playbook*
   ```
   Or if Lesson 9 is planned:
   ```markdown
   *Next: Lesson 9 — Pricing Benchmarks That Actually Exist (Coming Soon)*
   ```

### Priority 2 (Polish)

4. **Add technique glossary** or standardize definitions:
   - DTF: Direct-to-Film transfer
   - DTG: Direct-to-Garment (if different from DTF)
   - Embroidery types: fill vs satin vs outline

5. **Consider adding table to Lesson 3** — even a simple cost comparison table would align it with other lessons:
   | Design Approach | Technique | Cost Estimate | Look/Feel |

6. **Lesson 5 "True Cost Formula" table** could be expanded with examples (like Lesson 2's comparison table).

### Priority 3 (Nice to Have)

7. **Standardize header capitalization:** Some use Title Case, some Sentence case in table headers. Pick one style.

8. **Add internal linking:** If compiling to PDF/web, make "Next: Lesson X" an actual link.

---

## Lesson-by-Lesson Assessment

| Lesson | Content Quality | Structure | Tables | Cross-refs | Score |
|--------|-----------------|-----------|--------|------------|-------|
| 1 — Technique Ceiling | Strong | ✓ | 3 tables | ✓ | 9/10 |
| 2 — Quote Variability | Strong | ✓ | 4 tables | ⚠️ (dual ref) | 8/10 |
| 3 — Design Optimization | Good (short) | ✓ | 0 tables | ✓ | 8/10 |
| 4 — Three Questions | Strong | ✓ | 3 tables | ✓ | 9/10 |
| 5 — Cheap vs Expensive | Strong | ✓ | 1 table | ⚠️ (dual ref) | 8/10 |
| 6 — Timeline Management | Strong | ✓ | 4 tables | ✓ | 9/10 |
| 7 — Prototype Investment | Strong | ✓ | 3 tables | ✓ | 9/10 |
| 8 — When Things Go Wrong | Strong | ✓ | 2 tables | ⚠️ (ref to 9) | 8/10 |

---

## Strengths Summary

1. **Expertise is evident:** Real numbers, specific industry terms (Fremdware, Coloreel), practical traps
2. **Actionable content:** Every lesson has immediate application
3. **Consistent voice:** Feels like one author throughout
4. **Good table variety:** Decision matrices, comparison tables, checklists, rubrics
5. **Scoping is right:** Not too academic, not too shallow
6. **Real examples ground theory:** "The Cap Rush," "The €30 Math"

---

## Final Recommendation

**Ready for compilation after 3 quick fixes:**
1. Clean up Lesson 2 footer
2. Clean up Lesson 5 footer  
3. Confirm/fix Lesson 8 footer (Lesson 9 status)

The content is solid, the flow is logical (technique → quoting → design → vetting → value → timeline → prototyping → troubleshooting), and the tone is appropriate for the target audience.

**Overall Grade: 8/10** — Minor editing cleanup needed, then ready to ship.
