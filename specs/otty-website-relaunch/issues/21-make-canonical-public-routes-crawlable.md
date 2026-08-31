# 21 — Make every canonical public route crawlable

**What to build:** Make the completed Product Landing, Rolling Documentation, and Installation and Downloads production artifacts technically eligible for indexing. Crawlers receive substantive HTML, stable self-references, an accurate route inventory, and ordinary links without introducing promises about ranking or actual indexing.

**Blocked by:** 17 — Consume the latest stable Published Release; 20 — Add the accessible Current Capabilities sequence.

**Status:** ready-for-agent

- [ ] Every public route emits substantive indexable HTML with crawlable internal anchor links and no accidental `noindex` directive.
- [ ] Public pages have concise unique titles and absolute self-referencing canonicals rooted at `https://otty.run`; the Product Landing also has an authored description while Documentation descriptions remain optional.
- [ ] Production robots rules allow the intended public content.
- [ ] The root sitemap contains all and only canonical public routes, including staged Rolling Documentation and Installation and Downloads, without development or duplicate URLs.
- [ ] The Product Landing remains excluded from Documentation search even though both surfaces are crawlable.
- [ ] Artifact-level checks inspect generated metadata, links, robots output, and sitemap inventory rather than source configuration alone.
- [ ] No implementation or public copy promises indexing, ranking, traffic, or field Core Web Vitals outcomes.
