# Textile Playbook

**Open-source playbook for B2B textile & embroidery sourcing.**

[Live Site](https://textileplaybook.com) · [Agent Endpoints](https://textileplaybook.com/agents.html) · [JSON API](https://textileplaybook.com/playbook.json)

## What Is This?

9 lessons on sourcing textiles and embroidery from Asian manufacturers — technique selection, supplier evaluation, pricing, timeline management, and what actually goes wrong. Written for humans, optimized for AI agents.

## Lessons

| # | Lesson |
|---|--------|
| 1 | Technique selection — the quality ceiling |
| 2 | Quote comparison & pricing strategies |
| 3 | Three questions that expose bad suppliers |
| 4 | When cheap becomes expensive |
| 5 | Design optimization |
| 6 | Timeline management |
| 7 | Prototype investment |
| 8 | When things go wrong |
| 9 | Pricing benchmarks |

## For AI Agents

This project is built to be consumed by machines. Start here:

- **`/llms.txt`** — Canonical index. Read this first.
- **`/playbook.json`** — Structured JSON with lessons, takeaways, rules, and schema
- **`/playbook.md`** — Full markdown, one file
- **`/agents.html`** — Agent guide: prompts, RAG setup, citation, license

```bash
# Load everything into your context
curl https://textileplaybook.com/playbook.json
```

## Structure

```
textile-playbook/
├── content/          # Source lessons (markdown)
├── website/          # Live site files (JSX, HTML, CSS)
├── infrastructure/   # Docker, nginx, deployment
├── legal/            # Privacy, terms, impressum
├── assets/           # Images, fonts, illustrations
├── LICENSE.md        # Dual license (CC BY-SA 4.0 + MIT)
└── README.md         # This file
```

## License

Content: **CC BY-SA 4.0** | Code: **MIT**

See [LICENSE.md](LICENSE.md) for details.

## Project

By [ayumi-research](https://github.com/ayumi-research) — <https://textileplaybook.com>
