// ================================================================================
// AI AGENTS: This file (content.jsx) is the client-side data model.
// Agents should NOT parse this file. Use the public endpoints instead:
//
//   /playbook.json  — Structured JSON (lessons, takeaways, rules, schema)
//   /playbook.md    — Full markdown (complete playbook, one file)
//   /llms.txt       — Canonical index (read this first)
//   /agents.html    — Agent guide (prompts, RAG setup, citation)
//
// This file is consumed by React/Babel to render the lesson grid and reader.
// The data here mirrors /playbook.json — they share the same source of truth.
// ================================================================================

// Shared content model for all three ebook directions.
// Every direction consumes this identical data; only presentation differs.

const BOOK = {
  title: "The Textile Playbook",
  subtitle: "How marketing agencies buy branded apparel without losing their minds",
  edition: "First Edition",
  date: "May 2026",
  market: "For marketing agencies buying branded apparel in the EU",
  publisher: "FIELD GUIDE No. 01",
};

// Key takeaway per lesson — surfaces on intro page as a one-line bottom line.
const TAKEAWAYS = {
  1: "Match technique to textile and use case before matching to budget.",
  2: "Always ask for the all-in delivered price. Sticker price is fiction.",
  3: "Ask every supplier: \u201CWhat\u2019s the most cost-effective way to achieve this look?\u201D",
  4: "Named contact + proof process + per-piece QC = operational foundation.",
  5: "Price \u00D7 Risk Factor = True Cost. Client-facing work is \u00D72 by default.",
  6: "The rush fee isn\u2019t the problem. The lack of buffer is.",
  7: "\u20AC30 prototype on a \u20AC2,000 order is insurance, not overhead.",
  8: "A supplier\u2019s response to the first mistake is your real contract.",
  9: "Walk into negotiations with ranges, not asks. \u201CI\u2019m seeing \u20ACX\u2013\u20ACY\u201D beats \u201CCan you do \u20ACX?\u201D",
};

const TOC = [
  { n: 1, t: "The Technique You Pick Determines Your Quality Ceiling", l: "Pick embroidery, screen print, or DTF for the right job" },
  { n: 2, t: "Why Your \u201CSimple Logo\u201D Quote Varies 300%", l: "Understand pricing games and hidden costs" },
  { n: 3, t: "The Design That Looks Better and Costs Less", l: "Match designs to technique and budget" },
  { n: 4, t: "The Three Questions That Expose Bad Suppliers", l: "Vet suppliers before they become your problem" },
  { n: 5, t: "When Cheap Becomes Expensive", l: "Avoid the five cheap traps" },
  { n: 6, t: "Timeline Management Without Panic", l: "Handle rush jobs and seasonal delays" },
  { n: 7, t: "The Prototype Investment", l: "When \u20AC30 saves \u20AC2,000" },
  { n: 8, t: "When Things Go Wrong", l: "Fix problems without breaking relationships" },
  { n: 9, t: "Pricing Benchmarks That Actually Exist", l: "Real numbers for negotiation" },
];

// Each lesson carries the same schema so presentations can cherry-pick.
const LESSONS = [
  {
    n: 1,
    title: "The Technique You Pick Determines Your Quality Ceiling",
    summary: "Embroidery, DTG, screen print, transfer \u2014 each technique locks you into specific durability, cost, and visual outcomes. Pick the wrong one and you're explaining to your client why their premium jackets look like expo freebies.",
    saves: "A technique mismatch costs \u20AC2,000 and a client relationship. The \u201Ccheap\u201D DTF print on workwear that peels after 5 washes. The \u201Cpremium\u201D embroidery that takes 2 weeks when the event is in 3 days. Get this right and everything else flows.",
    sections: [
      {
        kind: "table",
        heading: "The Decision Framework: What's the Goal?",
        cols: ["Goal", "Right Technique", "Why"],
        rows: [
          ["Premium gifts, long-term workwear, brand prestige", "Embroidery", "Adds texture, survives washing, signals quality. Limited colors unless using Coloreel. Days for large orders."],
          ["Mass distribution, expos, giveaways, cotton bags", "Screen print / DTF", "Cheap per unit, fast turnaround, fine for items worn 1\u20132 times. Less durable, less premium."],
          ["Complex artwork, gradients, photorealistic", "Digital transfer / DTG", "Handles detail and color range embroidery can't. Fast. Durability trade-off acceptable for short-life items."],
          ["Huge quantities, simple designs, tight deadlines", "Screen printing", "Cheapest at volume. Limited colors per screen. Fast once set up."],
        ],
      },
      {
        kind: "table",
        heading: "Textile\u2013Technique Mismatches",
        sub: "The \u201Coops\u201D moments",
        cols: ["Textile", "Technique", "What Goes Wrong"],
        rows: [
          ["Light / sheer T-shirts", "Embroidery (small text)", "Destroys fabric, puckering, holes"],
          ["Fluffy fleece / sherpa", "DTF or screen print", "Ink sits on surface, doesn't adhere, looks cheap"],
          ["Two-sided items (bags)", "Embroidery", "Backside is ugly, limits use"],
          ["Underwear / base layers", "Embroidery", "Backside scratches skin, uncomfortable"],
          ["Waterproof jackets", "Standard embroidery", "Creates holes, needs waterproof backing patch"],
          ["Terry cloth towels", "DTF", "Ink spreads in fibers, blurry, low quality"],
        ],
      },
      {
        kind: "rule",
        heading: "The Rule",
        body: "Technique + Textile + Use case = Feasibility",
        list: [
          ["Light T-shirts", "DTF or small outline embroidery (no fill)"],
          ["Sherpa / fleece", "Must embroider \u2014 print won't stick"],
          ["Two-sided", "Large appliqu\u00E9 (covered back) or print only"],
          ["Base layers", "Print or laser-etched, never embroidery"],
          ["Waterproof", "Embroidery + heat-sealed waterproof backing"],
          ["Towels", "Embroidery only \u2014 industry standard, print looks bad"],
        ],
      },
      {
        kind: "story",
        heading: "Real Example \u2014 The Cap Rush",
        blocks: [
          { label: "Client wants", body: "5,000 caps for a trade show in 10 days. You choose embroidery because \u201Cit's nicer.\u201D" },
          { label: "Day 8", body: "Supplier needs 3 more weeks \u2014 large embroidery machines running 24/7 can only do \u2248500 caps/day, and they're booked solid." },
          { label: "Result", body: "Air-freighting printed caps at 3\u00D7 cost, or showing up with nothing." },
          { label: "The rule", body: "Technique \u00D7 Timeline \u00D7 Budget = Feasibility. Change one, others shift." },
        ],
      },
    ],
  },
  {
    n: 2,
    title: "Why Your \u201CSimple Logo\u201D Quote Varies 300%",
    summary: "Same design, three suppliers, \u20AC800 to \u20AC2,400. They're not scamming you \u2014 they're pricing different things. And some make money on the product, not the decoration.",
    saves: "Spot who's padding the decoration and who's giving you a product margin play. Know where you can negotiate and where you can't.",
    sections: [
      {
        kind: "bullets",
        heading: "The Quote Is Never Just \u201CPer Piece\u201D",
        sub: "Every embroidery quote breaks down into:",
        items: [
          ["Setup / digitizing", "\u20AC30\u2013150 one-time \u2014 converts your logo to machine-readable stitches"],
          ["Sample / mockup", "\u20AC20\u201350 \u2014 optional, recommended for first orders"],
          ["Per-piece price", "Depends on stitch count, colors, locations"],
          ["Color changes", "\u20AC10\u201325 per change \u2014 each color = machine stop, thread change"],
          ["Rush fees", "20\u2013100% if under 2 weeks"],
          ["Shipping", "Often excluded, can be \u20AC50\u2013300"],
          ["Digitizing revisions", "\u20AC20\u201350 if you change the logo after approval"],
        ],
      },
      {
        kind: "sidebyside",
        heading: "Technique-specific setup",
        a: {
          title: "Screen print adds",
          items: [
            "Screen fees \u20AC25\u201350 per color",
            "Minimum order 50\u2013100 to justify setup",
            "Color limit usually max 6\u20138",
          ],
        },
        b: {
          title: "DTF / transfer adds",
          items: [
            "Film / setup \u20AC20\u201380 per design",
            "No minimums \u2014 but per-piece price higher",
            "Color unlimited, gradients fine",
          ],
        },
      },
      {
        kind: "table",
        heading: "The Hidden Pricing Game",
        cols: ["Strategy", "What it means", "Where the margin is"],
        rows: [
          ["Bundled pricing", "Product + decoration in one price", "60\u201380% on product, 20\u201340% on decoration"],
          ["Customer-supplied goods (Fremdware)", "You supply items, they decorate", "Decoration must cover all costs + profit"],
          ["Hybrid", "Discounted decoration if you buy the product from them", "Product margin subsidizes the work"],
        ],
      },
      {
        kind: "economics",
        heading: "Real Economics",
        cards: [
          {
            title: "Cheap caps with 2\u20133 logos",
            rows: [
              ["Cap wholesale", "\u20AC1.50"],
              ["Target margin", "30%"],
              ["Decoration cost", "\u20AC2.50"],
              ["Margin left", "almost nothing"],
            ],
            note: "Supplier can't budge on price \u2014 they're already at cost.",
          },
          {
            title: "Premium jackets with 1 logo",
            rows: [
              ["Jacket wholesale", "\u20AC25"],
              ["Target margin", "35%"],
              ["Decoration cost", "\u20AC4"],
              ["Margin available", "\u20AC8\u201310"],
            ],
            note: "Supplier can discount decoration 50% and still make money on the jacket.",
          },
        ],
      },
      {
        kind: "rule",
        heading: "The Negotiating Rule",
        body: null,
        list: [
          ["Cheap product, complex decoration", "Don't negotiate hard. They have no room. Pay or simplify."],
          ["Expensive product, simple decoration", "Negotiate. There's product margin that can subsidize the work."],
        ],
      },
      {
        kind: "table",
        heading: "The Comparison Trap",
        cols: ["Supplier", "Quote", "Reality"],
        rows: [
          ["A", "\u20AC800", "\u20AC50 digitizing + \u20AC5/cap \u00D7 150. Cheapest until you add \u20AC180 shipping + 3-week queue."],
          ["B", "\u20AC1,200", "\u20AC80 digitizing + sample + \u20AC6.50/cap + shipping. Often the real answer when everything's included."],
          ["C", "\u20AC2,400", "\u20AC150 + rush fee + \u20AC14/cap + \u201Cpremium guarantee.\u201D For clients who need it Thursday and will pay anything."],
        ],
      },
      {
        kind: "asks",
        heading: "What to Ask",
        items: [
          "Is this price for your product or customer-supplied goods?",
          "What's the price if I buy the product from you?",
          "What's the all-in delivered price including digitizing, samples, shipping, and timeline?",
        ],
        redflag: "Supplier pushes hard for \u201Crecommended products\u201D but won't explain why. They're hiding margin structure.",
      },
    ],
  },
  {
    n: 3,
    title: "The Design That Looks Better and Costs Less",
    summary: "That filled logo your designer loves? It costs 3\u00D7 more and feels like a traffic sign on your chest. A few smart edits \u2014 outline instead of fill, simplified detail, strategic placement \u2014 and you get something that looks more premium for half the price.",
    saves: "A 15-minute design review can save \u20AC500 and produce better results.",
    sections: [
      {
        kind: "threecol",
        heading: "By Technique",
        cols: [
          {
            title: "Embroidery",
            items: [
              ["Filled designs", "High stitch count \u2014 slow, expensive, stiff, patch-like"],
              ["Outline / satin stitch", "Lower count, faster, moves with fabric, premium look"],
              ["Rule of thumb", "If design >10cm, consider outline or partial fill"],
            ],
          },
          {
            title: "DTF / Transfer",
            items: [
              ["Large solid prints", "Stiffen fabric, crack at folds, heavy feel"],
              ["Strategic placement", "Chest logo vs full-back \u2014 half the size, 80% of visibility"],
              ["Breathability", "Large prints trap heat \u2014 bad for workwear, fine for bags"],
            ],
          },
          {
            title: "Screen Print",
            items: [
              ["Color limits", "Each color = screen = cost"],
              ["Simplify gradients", "Spot colors or halftones instead of full CMYK"],
            ],
          },
        ],
      },
      {
        kind: "paragraph",
        heading: "The Feasibility Conversation",
        body: "Before you finalize a design, ask: \u201CWhat's the most cost-effective way to achieve this look?\u201D Suppliers won't suggest changes unless you ask. They'll quote your complex design at 3\u00D7 the price and let you decide.",
      },
      {
        kind: "compare",
        heading: "Example",
        a: {
          label: "Designer wants",
          title: "Full-back photorealistic, DTF on hoodies",
          stats: [["Cost", "\u20AC18/piece"], ["Presence", "Full back"], ["Feel", "Plastic"], ["Durability", "Cracks after 10 washes"]],
        },
        b: {
          label: "Alternative 1",
          title: "10cm chest logo, simplified vector, embroidered",
          stats: [["Cost", "\u20AC6/piece"], ["Presence", "Chest only"], ["Feel", "Premium"], ["Durability", "Lasts years"]],
        },
        c: {
          label: "Alternative 2",
          title: "Simplified outline back logo, embroidered",
          stats: [["Cost", "\u20AC18/piece"], ["Presence", "Full back"], ["Feel", "Premium"], ["Durability", "Lasts years"]],
        },
        footer: "A chest logo isn't a full-back print, so pick by goal: spend less with the chest logo, or keep the back presence for the same money with outline embroidery that actually lasts.",
      },
    ],
  },
  {
    n: 4,
    title: "The Three Questions That Expose Bad Suppliers",
    summary: "Most suppliers aren't scammers \u2014 they're disorganized. These three questions expose where their process breaks down before you're holding a box of wrong-size polos with crooked logos.",
    saves: "Catches the \u201Cwe'll figure it out\u201D approach before it becomes your problem.",
    sections: [
      {
        kind: "table",
        heading: "The Real Risk Categories",
        cols: ["Risk", "What goes wrong", "Cost"],
        rows: [
          ["Existence", "Ghost company, deposits disappear, nothing ships", "100% loss + deadline blown"],
          ["Product", "Wrong sizes, poor quality, color mismatch", "Rewrite or unusable stock"],
          ["Decoration", "Logo shifted, wrong colors, messy backside", "Unusable, client rejection"],
          ["Delivery", "Late, rushed packing, no QC, logos not cleaned", "Missed event + bad first impression"],
          ["Service", "Unreachable during problems, no prototyping, rigid", "No path to fix errors"],
        ],
        footnote: "Most reputable suppliers have solved the first two. The danger zone is decoration + delivery + service.",
      },
      {
        kind: "questions",
        heading: "The Three Questions",
        items: [
          {
            q: "Walk me through your logo approval process \u2014 what do I see before production starts?",
            levels: [
              ["Strong", "Digital proof within 24h, physical sample on actual fabric for orders over \u20AC500, final production approval checkpoint"],
              ["Medium", "PDF proof only \u2014 screen calibration risk"],
              ["Weak", "\u201CJust send us the file\u201D or \u201CWe don't do proofs\u201D"],
            ],
            gap: "Screen colors \u2260 thread colors. Navy on your monitor becomes purple on their machine.",
          },
          {
            q: "What does your quality check step look like?",
            levels: [
              ["Strong", "Every piece checked, loose threads trimmed, backing removed, steamed/pressed, individually bagged"],
              ["Medium", "Spot-checking from each batch"],
              ["Weak", "\u201CThe embroiderer checks their own work\u201D"],
            ],
            gap: "\u201CNo time for individual checks on large orders\u201D \u2014 quality scales down with quantity.",
          },
          {
            q: "If I need a last-minute change, how do I reach you and how fast do you respond?",
            levels: [
              ["Strong", "Named team, phone / Signal / WhatsApp, under 2h response, production manager escalation"],
              ["Medium", "Email only, 24h response"],
              ["Weak", "\u201CLeave a message, someone will get back to you\u201D"],
            ],
            gap: "No named contact = watching deadlines evaporate while \u201Csomeone\u201D eventually checks email.",
          },
        ],
      },
      {
        kind: "rubric",
        heading: "Scoring Rubric",
        cols: ["Question", "2 pts", "1 pt", "0 pts"],
        rows: [
          ["Approval process", "Physical + digital proof", "Digital only", "No proof"],
          ["Quality check", "Every piece, finishing included", "Spot check", "No check"],
          ["Responsiveness", "Named contact, fast channel, prototyping", "Email, 24h", "No named contact, vague"],
        ],
        scores: [
          ["6 pts", "Solid operational foundation"],
          ["4\u20135 pts", "Manageable with explicit written agreements"],
          ["0\u20133 pts", "High risk"],
        ],
      },
    ],
  },
  {
    n: 5,
    title: "When Cheap Becomes Expensive",
    summary: "That \u20AC3 cap quote looks like a win until you're explaining to your client why their logo is peeling off after three washes. The real cost isn't the price tag \u2014 it's what happens after.",
    saves: "Spot the five cheap traps before you fall in. Save the relationship, not just the budget line.",
    sections: [
      {
        kind: "traps",
        heading: "The Five Cheap Traps",
        items: [
          {
            n: 1,
            title: "The Peeling Logo",
            sub: "Durability vs. price",
            pitch: "\u201CSame design, \u20AC3 vs \u20AC7. Big savings on 500 pieces!\u201D",
            reality: [
              ["\u20AC3", "DTF on cheap cotton, heat-pressed at lower temp"],
              ["\u20AC7", "Embroidery on quality fabric, proper stitch density"],
            ],
            math: [
              ["Cheap", "500 \u00D7 \u20AC3 = \u20AC1,500 + replacement \u20AC1,500 + damaged relationship"],
              ["Quality", "500 \u00D7 \u20AC7 = \u20AC3,500, client happy, reorders 2,000 next quarter"],
            ],
            rule: "Cheap becomes expensive when the item is meant to last.",
          },
          {
            n: 2,
            title: "The Rush Fee Surprise",
            sub: "Timeline vs. price",
            pitch: "\u201CWe can do it in 3 days, no extra charge.\u201D",
            hidden: "Skipping quality check, outsourcing to unaccountable shops, no time to fix if wrong.",
            rule: "Your sleep, your stress, your professional credibility \u2014 the real cost.",
          },
          {
            n: 3,
            title: "The Hidden Setup",
            sub: "Quote vs. total",
            pitch: "Sticker: \u20AC4.50/piece",
            actual: "\u20AC4.50 + \u20AC80 digitizing + \u20AC50 color changes + \u20AC60 rush + \u20AC120 shipping + \u20AC40 sample = \u20AC6.25/piece",
            rule: "Always ask for \u201Call-in delivered price.\u201D Sticker price is fiction.",
          },
          {
            n: 4,
            title: "Single Point of Failure",
            sub: "Supplier reliability",
            pitch: "\u201CWe're a small shop, personal service, great prices!\u201D",
            hidden: "One embroiderer, no backup. If sick, your order stops. If overwhelmed, you're waiting.",
            rule: "Cheap small shops are fine for small, non-critical orders. Mission-critical work needs redundancy.",
          },
          {
            n: 5,
            title: "The Correction Cascade",
            sub: "Error compounding",
            pitch: "\u201CWe'll fix it, no problem!\u201D",
            hidden: "2 weeks to fix, \u20AC200 shipping back and forth, client gets half on time, you spend 10 hours on emails.",
            rule: "One mistake is fixable. A pattern of mistakes is a supplier who doesn't have their process sorted.",
          },
        ],
      },
      {
        kind: "list",
        heading: "When Cheap Is Actually Fine",
        items: [
          "One-time events \u2014 giveaways, conference bags",
          "Short lifespan expected \u2014 cotton bags",
          "Non-critical branding \u2014 internal shirts",
          "Ample time buffer \u2014 2 weeks to fix if needed",
          "Supplier history \u2014 you know their \u201Ccheap\u201D is \u201Creliable\u201D",
        ],
      },
      {
        kind: "table",
        heading: "The True Cost Formula",
        sub: "Price \u00D7 Risk Factor = True Cost",
        cols: ["Factor", "Multiplier", "Applies when"],
        rows: [
          ["Client-facing", "\u00D72", "Client logo, client event"],
          ["Deadline-critical", "\u00D71.5", "Event date, no buffer"],
          ["Quality-sensitive", "\u00D71.5", "Workwear, long-term use"],
          ["Single supplier", "\u00D71.3", "No backup option"],
        ],
      },
      {
        kind: "rule",
        heading: "The One-Third Rule",
        list: [
          ["Bottom third", "Cutting corners you haven't discovered yet"],
          ["Middle third", "Fair price, fair value, reasonable expectation"],
          ["Top third", "Premium pricing, maybe premium value, maybe just ego"],
        ],
        body: "Start with middle third. Build relationships.",
      },
    ],
  },
  {
    n: 6,
    title: "Timeline Management Without Panic",
    summary: "Rush fees, realistic deadlines, and the seasonal chaos that turns \u201C2 weeks\u201D into \u201Cnext month.\u201D Learn to read supplier timelines before they cost you the client relationship.",
    saves: "Every rushed order is a risk multiplier. The fee isn't the problem \u2014 the lack of buffer is.",
    sections: [
      {
        kind: "table",
        heading: "The Rush Fee Structure",
        cols: ["Timeline", "Fee multiplier", "When it applies"],
        rows: [
          ["Standard (3\u20134 weeks)", "1.0\u00D7", "Baseline, planned orders"],
          ["Expedited (2 weeks)", "1.25\u20131.5\u00D7", "Most suppliers can accommodate"],
          ["Rush (1 week)", "1.5\u20132.0\u00D7", "Requires dedicated machines"],
          ["Emergency (3 days)", "2.0\u20133.0\u00D7", "Or \u201Cimpossible\u201D \u2014 depending on supplier"],
        ],
        footnote: "Rush fees don't guarantee quality. They guarantee speed. The shortcut often skips QC.",
      },
      {
        kind: "threecol",
        heading: "What's Actually Possible",
        cols: [
          {
            title: "Embroidery",
            items: [
              ["Small (50\u2013100)", "5\u20137 days standard, 3 days rush"],
              ["Large (500+)", "2\u20133 weeks standard, 1 week rush if machines available"],
              ["Hard limit", "A 12-head machine does \u2248500 caps/day. Booked is booked."],
            ],
          },
          {
            title: "Screen / DTF",
            items: [
              ["Small order", "3\u20135 days standard, 2 days rush"],
              ["Large order", "1\u20132 weeks standard, 1 week rush"],
              ["Hard limit", "Each color = screen = setup time"],
            ],
          },
          {
            title: "\u201CIn stock\u201D vs sourced",
            items: [
              ["In stock", "Product in their warehouse \u2014 decoration only timeline"],
              ["Sourced", "From wholesaler \u2014 add 3\u20137 days"],
              ["Custom / imported", "From manufacturer \u2014 add 2\u20136 weeks"],
            ],
          },
        ],
        footnote: "\u201CWe can get those jackets\u201D = \u201CWe know where to order them.\u201D Add the shipping time.",
      },
      {
        kind: "table",
        heading: "Seasonal Delays (European Market)",
        cols: ["Period", "Impact", "Mitigation"],
        rows: [
          ["August summer holidays", "Most EU suppliers closed 2\u20134 weeks", "Plan around August, order by July 15"],
          ["Christmas / New Year", "Queue stretches, rush fees spike", "Order by November 15"],
          ["Easter week", "Production slows, variable dates", "Check calendar, add buffer"],
          ["Trade show season", "Suppliers prioritize large orders", "Small orders wait"],
        ],
      },
      {
        kind: "sidebyside",
        heading: "Pay Rush Fees vs. Push Back on Client",
        a: {
          title: "Pay the fee when",
          items: [
            "Client deadline is immovable \u2014 event, launch",
            "Order is small \u2014 rush fee <10% of total",
            "Supplier history of rush quality you trust",
          ],
        },
        b: {
          title: "Push back when",
          items: [
            "Client is compressing unnecessarily (\u201Cwe just decided\u201D)",
            "Rush fee exceeds 25% of order value",
            "Supplier has no rush track record with you",
          ],
        },
        script: "\u201CWe can meet Thursday, but it requires a rush fee of \u20ACX and carries quality risk. I recommend Monday for the same result at standard price. What's driving the Thursday deadline?\u201D",
        scriptNote: "You're not saying no. You're making them own the risk.",
      },
      {
        kind: "timeline",
        heading: "Reading Supplier Timelines",
        items: [
          { level: "Uncommitted", phrase: "\u201CShould be fine\u201D", meaning: "No specific date. No confirmation process. High risk." },
          { level: "Delay tactic", phrase: "\u201CWe'll confirm after deposit\u201D", meaning: "Timeline unknown until you're committed. Medium-high risk." },
          { level: "Professional", phrase: "Delivery date + checkpoints", meaning: "Clear milestones. Accountability. Low risk." },
        ],
      },
      {
        kind: "buffer",
        heading: "The Buffer Rule",
        rows: [
          ["Client says", "We need these by Friday"],
          ["You hear", "We need these by Thursday morning"],
          ["You tell supplier", "We need these by Wednesday EOD"],
          ["You plan", "Delivery Tuesday (1 day buffer for fixes)"],
        ],
        footer: "2 days buffer reduces stress by 80%. Worth it every time.",
      },
    ],
  },
  {
    n: 7,
    title: "The Prototype Investment",
    summary: "Sampling isn't optional for anything that matters. A \u20AC30 prototype eliminates 80% of pre-production risk before you're committed to 500 pieces.",
    saves: "The \u20AC30 prototype is insurance. Skip it when you can afford to be wrong.",
    sections: [
      {
        kind: "table",
        heading: "When to Prototype \u2014 Non-Negotiable",
        cols: ["Situation", "Why it matters"],
        rows: [
          ["First order with new supplier", "You don't know their interpretation of your files"],
          ["New technique or fabric", "Drape, weight, color behave differently than expected"],
          ["Color-critical work", "Brand colors must match \u2014 screens lie"],
          ["Complex placement", "Chest + sleeve + back alignment requires precision"],
          ["Rush timeline", "No buffer for fixes if it's wrong"],
          ["Client-facing / high visibility", "Errors are public and expensive"],
        ],
        footnote: "The test: \u201CIf this goes wrong, what's my exposure?\u201D High exposure = prototype.",
      },
      {
        kind: "checklist",
        heading: "What a Prototype Should Include",
        sub: "Physical Sample Checklist",
        items: [
          ["Size / fit", "Actual garment in target size \u2014 not just \u201Csize L\u201D but \u201Cthis brand's size L\u201D"],
          ["Fabric hand", "Weight, texture, drape \u2014 does it match expectation?"],
          ["Color accuracy", "Thread / ink color vs brand spec (Pantone or physical reference)"],
          ["Logo placement", "Precise position, size, alignment"],
          ["Decoration quality", "Stitch density, thread tension, backing finish"],
          ["Label / tags", "Care instructions, size label, branding"],
        ],
        note: "PDF proof for digital approval. Physical prototype for production go-ahead.",
      },
      {
        kind: "sidebyside",
        heading: "The 5-Minute Check",
        a: {
          title: "Walk through",
          items: [
            "Visual \u2014 does it look like the brief?",
            "Tactile \u2014 does it feel premium or cheap?",
            "Functional \u2014 does it wear well?",
            "Detail \u2014 loose threads, crooked lines, backing showing?",
            "Compare \u2014 side-by-side with reference",
          ],
        },
        b: {
          title: "Red flags",
          items: [
            "Color \u201Cclose enough\u201D \u2014 will drift further in production",
            "Placement \u201Cabout there\u201D \u2014 no precision in their process",
            "Loose threads \u2014 no finishing step",
            "\u201CThat's just the sample\u201D \u2014 production won't be better",
          ],
        },
      },
      {
        kind: "paragraph",
        heading: "Prototype-to-Production Drift",
        body: "The risk: sample looks great, production doesn't match. Why it happens \u2014 different machine or operator, \u201Csample-grade\u201D materials, no documented standard. The fix: approve in writing with photo evidence, require production match to approved sample (contractual), mid-production check. The nuclear option: production must match approved prototype or full re-run at supplier cost.",
      },
      {
        kind: "economics",
        heading: "The \u20AC30 Math",
        cards: [
          {
            title: "Scenario A \u2014 Prototype",
            rows: [["Cost", "\u20AC30"], ["Time", "+1 week"], ["Risk", "Low (80% caught)"], ["Rework", "5% of orders"]],
          },
          {
            title: "Scenario B \u2014 No prototype",
            rows: [["Cost", "\u20AC0"], ["Time", "\u20131 week"], ["Risk", "High (80% go live)"], ["Rework", "40% \u00D7 \u20AC2,000 = \u20AC800 expected"]],
          },
        ],
        footer: "\u20AC30 prototype saves \u20AC770 per order on average for high-exposure orders.",
      },
      {
        kind: "table",
        heading: "Pro Types \u2014 When You Need More Than One",
        cols: ["Prototype", "When to use", "Cost"],
        rows: [
          ["Digital mockup", "Initial approval, layout confirmation", "Free \u2013 \u20AC10"],
          ["Single physical", "Standard orders, repeat suppliers", "\u20AC20\u201350"],
          ["Size run", "Garments S\u2013XL to check fit", "\u20AC50\u2013150"],
          ["Color / technique matrix", "3 colors \u00D7 2 techniques before deciding", "\u20AC100\u2013300"],
          ["Pre-production sample", "First 5 pieces from actual run", "Cost of goods"],
        ],
      },
      {
        kind: "script",
        heading: "The \u201CCan't Afford a Prototype\u201D Fallacy",
        client: "\u201CWe don't have time / budget for a sample.\u201D",
        translation: "\u201CWe can't afford to get this wrong, but we're not going to verify it's right.\u201D",
        response: "\u201CI understand the pressure. Here's the risk: if color / position is off, we're looking at a full re-run at \u20ACX and Y weeks delay. The prototype is \u20AC30 insurance against that. Worth 10 minutes to discuss?\u201D",
        frame: "Not as delay / cost. As risk management.",
      },
    ],
  },
  {
    n: 8,
    title: "When Things Go Wrong",
    summary: "Error happened. Client is angry. Supplier is defensive. How to fix without breaking the relationship or your margin.",
    saves: "Every error is data. The question is whether you pay tuition once or keep repeating the class.",
    sections: [
      {
        kind: "table",
        heading: "Immediate Triage \u2014 First 30 Minutes",
        sub: "Step 1: Assess the damage",
        cols: ["Category", "Action", "Timeline"],
        rows: [
          ["Total loss", "Unusable, unsalvageable, embarrassing", "Start emergency sourcing"],
          ["Partial loss", "Some items okay, some wrong", "Sort, salvage good, fix / replace bad"],
          ["Cosmetic only", "Embarrassing but functional", "Can client live with it?"],
          ["Client doesn't know yet", "You found it first", "Time to fix before they see it"],
        ],
      },
      {
        kind: "list",
        heading: "Step 2 \u2014 Document Everything",
        items: [
          "Photos of the problem (multiple angles, close-up, context)",
          "Photos of what was ordered (brief, approved sample)",
          "Timeline of events (ordered, approved, delivered)",
          "Communications (emails, messages, what was promised)",
        ],
        note: "Document before accusing. Facts first, emotion second.",
      },
      {
        kind: "sidebyside",
        heading: "Supplier Accountability",
        a: {
          title: "They owe \u2014 contractual",
          items: [
            "Wrong item \u2014 full replacement or refund",
            "Wrong color \u2014 re-run if outside agreed tolerance",
            "Wrong placement \u2014 re-run if outside brief specs",
            "Missed deadline \u2014 rush re-run at their cost or refund",
          ],
        },
        b: {
          title: "Good will \u2014 relationship",
          items: [
            "\u201CClose enough\u201D color within industry tolerance",
            "Minor quality \u2014 finishing fixes, not re-run",
            "Your error in brief \u2014 they don't owe correction",
          ],
        },
        script: "\u201CThere's a gap between what we approved and what arrived. Here's the documentation. What's your path to resolution?\u201D",
        scriptNote: "Problem \u2192 Evidence \u2192 Resolution request. Not blame \u2192 anger \u2192 demand.",
      },
      {
        kind: "script",
        heading: "Client Communication \u2014 How to Say \u201CWe Fucked Up\u201D",
        client: "The formula \u2014 acknowledge, specify, own, fix, timeline, impact.",
        translation: "\u201CWe've identified a color mismatch on the jackets. Supplier thread color is off from the approved sample. We're sourcing a re-run with correct color, delivery Thursday. You have enough stock for Tuesday's soft launch, full inventory for Friday's event.\u201D",
        response: "Clients care about: their event, their reputation, your reliability. Address these directly \u2014 not your process, not supplier drama.",
        frame: "Address what they actually care about.",
      },
      {
        kind: "hours",
        heading: "Emergency Sourcing \u2014 48-Hour Plan",
        rows: [
          ["Hour 0", "Accept original plan is dead"],
          ["Hour 1\u20134", "Contact 3 alternative suppliers \u2014 specific need, quantity, deadline, budget"],
          ["Hour 4\u201312", "Evaluate quotes \u2014 not just price, can they actually deliver?"],
          ["Hour 12\u201324", "Approve sample / simplified proof if possible"],
          ["Hour 24\u201348", "Production + express shipping"],
          ["Hour 48", "Delivery (hopefully)"],
        ],
        footer: "Who to call: your backup suppliers, local shops, same-city competitors, wholesalers with decoration partners.",
      },
      {
        kind: "compare",
        heading: "The Correction Cascade",
        a: {
          label: "Don't do this",
          title: "The spiral",
          stats: [
            ["1", "Error discovered"],
            ["2", "Supplier promises fix"],
            ["3", "Fix is also wrong"],
            ["4", "Now at deadline"],
            ["5", "Panic source at 3\u00D7 cost"],
            ["6", "Client loses confidence"],
          ],
        },
        b: {
          label: "Do this instead",
          title: "The pause",
          stats: [
            ["1", "Error discovered"],
            ["2", "Pause \u2014 fixable or Plan B?"],
            ["3", "Fixable: supplier re-runs with supervision"],
            ["4", "Not fixable: activate Plan B immediately"],
            ["5", "Keep client informed at checkpoints"],
            ["6", "Deliver something on time"],
          ],
        },
        footer: "A partial solution on time beats a perfect solution late.",
      },
      {
        kind: "list",
        heading: "Post-Mortem \u2014 5 Questions, Honestly",
        items: [
          "Where did the process break \u2014 brief, approval, production, comms?",
          "What was the early warning \u2014 did we miss a signal?",
          "What would have prevented this \u2014 prototype, different supplier, better brief?",
          "What will we do differently next time \u2014 specific, actionable?",
          "Is this a supplier problem or a process problem \u2014 wrong partner vs wrong system?",
        ],
        note: "Same failure twice = you didn't learn. Third time = you don't care.",
      },
      {
        kind: "sidebyside",
        heading: "The Nuclear Options",
        a: {
          title: "Demand full re-run at supplier cost",
          items: [
            "Deviated from approved sample (documented proof)",
            "Missed deadline with no proactive communication",
            "Material substitution without approval",
          ],
        },
        b: {
          title: "Eat the cost yourself",
          items: [
            "You approved the wrong thing (signed off)",
            "\u201CClose enough\u201D wasn't defined (tolerance never specified)",
            "Timeline was impossible, you pushed anyway",
          ],
        },
      },
    ],
  },
  {
    n: 9,
    title: "Pricing Benchmarks That Actually Exist",
    summary: "Real numbers from the German / EU textile market \u2014 what embroidery, screen print, and DTF actually cost per piece, what setup fees look like, and where suppliers make their margin.",
    saves: "Walk into a supplier negotiation knowing what \u201Cfair\u201D looks like. Spot the padded quote before you commit.",
    sections: [
      {
        kind: "table",
        heading: "Embroidery \u2014 Per-Piece by Stitch Count",
        cols: ["Stitch range", "Per-piece", "Typical applications"],
        rows: [
          ["0\u20135,000", "\u20AC2.50\u20134.00", "Small chest logos, text, simple shapes"],
          ["5,000\u201310,000", "\u20AC4.00\u20136.50", "Medium logos, standard cap embroidery"],
          ["10,000\u201320,000", "\u20AC6.50\u201310.00", "Large back designs, detailed artwork"],
          ["20,000+", "\u20AC10.00\u201316.00", "Complex full-chest, oversized designs"],
        ],
        footnote: "Prices per location. Company name \u2248 3k stitches. Medium logo \u2248 8k. Detailed emblem \u2248 15k. Photorealistic \u2248 25k+.",
      },
      {
        kind: "table",
        heading: "Screen Print \u2014 Per-Piece by Color Count",
        cols: ["Colors", "Per-piece", "Min order", "Notes"],
        rows: [
          ["1", "\u20AC1.50\u20133.00", "50\u2013100", "Cheapest at volume, fastest setup"],
          ["2\u20133", "\u20AC3.00\u20135.50", "50", "Most common for branded apparel"],
          ["4\u20136", "\u20AC5.50\u20138.50", "100", "Complex designs, longer setup"],
          ["6+", "\u20AC8.50\u201314.00+", "100\u2013250", "Consider DTF instead"],
        ],
        footnote: "Each color = one screen = \u20AC25\u201350 setup. 4-color design = \u20AC100\u2013200 in screens alone.",
      },
      {
        kind: "table",
        heading: "DTF / Transfer \u2014 Per-Piece by Size",
        cols: ["Size", "Dimensions", "Per-piece", "Best for"],
        rows: [
          ["Small", "<10cm", "\u20AC2.00\u20134.00", "Chest logos, small text"],
          ["Medium", "10\u201320cm", "\u20AC4.00\u20137.00", "Full-chest, back designs"],
          ["Large", ">20cm", "\u20AC7.00\u201312.00", "Oversized, full-back"],
        ],
        footnote: "No setup fees (or minimal \u20AC20\u201350 film charge). Unlimited colors, works on almost any fabric \u2014 but less durable, \u201Cplastic\u201D feel.",
      },
      {
        kind: "table",
        heading: "Base Product Costs \u2014 Wholesale to Decoration Shop",
        cols: ["Product", "Range", "Notes"],
        rows: [
          ["Caps", "\u20AC1.50\u20134.00", "\u20AC1.50 basic cotton, \u20AC4 premium structured"],
          ["T-shirts", "\u20AC2.00\u20138.00", "\u20AC2 promo, \u20AC8 premium retail weight"],
          ["Polos", "\u20AC8.00\u201315.00", "Pique knit standard"],
          ["Sweatshirts / hoodies", "\u20AC12.00\u201325.00", "Fleece weight drives price"],
          ["Jackets (softshell)", "\u20AC20.00\u201340.00", "Waterproof adds \u20AC5\u201310"],
          ["Jackets (padded)", "\u20AC25.00\u201350.00", "Down / synthetic premium"],
          ["Cotton bags", "\u20AC2.00\u20135.00", "\u20AC2 thin promo, \u20AC5 heavy canvas"],
          ["Workwear pants", "\u20AC15.00\u201335.00", "Cargo / safety premium"],
        ],
      },
      {
        kind: "table",
        heading: "Setup Fees \u2014 The Hidden Cost Layer",
        cols: ["Fee", "Range", "When it applies"],
        rows: [
          ["Digitizing (embroidery)", "\u20AC30\u2013150", "First-time logo, per design"],
          ["Screen making", "\u20AC25\u201350 per color", "Screen print"],
          ["Film / output (DTF)", "\u20AC20\u201380 per design", "Digital transfers"],
          ["Sample / mockup", "\u20AC20\u201350", "Physical sample before production"],
          ["Color changes", "\u20AC10\u201325 per change", "Embroidery thread swaps mid-run"],
          ["Digitizing revision", "\u20AC20\u201350", "Changes after approval"],
        ],
        footnote: "Digitizing is one-time per design. Same logo on 50 items or 5,000 \u2014 paid once. Keep the file.",
      },
      {
        kind: "example",
        heading: "The 100-Hoodie Order",
        lines: [
          ["Hoodies (\u20AC18 wholesale)", "\u20AC1,800", "\u20AC18 \u00D7 100"],
          ["Embroidery 8k stitches", "\u20AC550", "\u20AC5.50 \u00D7 100"],
          ["Digitizing", "\u20AC60", "One-time"],
          ["Rush fee (2-week)", "\u20AC305", "1.25\u00D7 on decoration"],
          ["Shipping (DE national)", "\u20AC85", "3-day freight"],
        ],
        total: ["Total", "\u20AC2,800", "\u20AC28 / hoodie delivered"],
        trap: [
          ["A", "\u20AC2,400", "excluded digitizing + 2-week standard"],
          ["B", "\u20AC2,800", "all-inclusive, realistic timeline \u2014 the real answer"],
          ["C", "\u20AC3,400", "\u201Cpremium quality\u201D padding"],
        ],
      },
      {
        kind: "paragraph",
        heading: "The \u201CAll-In\u201D Ask",
        body: "Never negotiate on sticker price. Negotiate on delivered cost. \u201CI need 150 items, chest logo, delivered to [city] by [date]. What's the all-in price including digitizing, samples, shipping, and any rush fees?\u201D Then compare apples to apples: same product tier, same decoration complexity, same timeline, same inclusions.",
      },
      {
        kind: "table",
        heading: "Red Flag Pricing",
        cols: ["Quote", "Likely issue"],
        rows: [
          ["Embroidery at \u20AC1.50 / piece", "Misquoted stitch count, will revise up"],
          ["\u201CFree digitizing\u201D", "Baked into per-piece price, or low quality"],
          ["\u201CNo rush fee\u201D", "Standard price already includes it, or quality risk"],
          ["Screen print at DTF prices", "Wrong technique for the volume"],
          ["Shipping \u201Cto be determined\u201D", "Hidden \u20AC100+ surprise coming"],
        ],
      },
    ],
  },
];

window.BOOK = BOOK;
window.TOC = TOC;
window.LESSONS = LESSONS;
window.TAKEAWAYS = TAKEAWAYS;
