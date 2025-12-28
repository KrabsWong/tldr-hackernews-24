# Enhance Homepage List Layout

## Overview
This change proposal improves the homepage with content previews, better layout adaptation, and adds header/footer sections.

## Files
- `proposal.md` - Detailed proposal with goals, risks, and success criteria
- `design.md` - Technical design and architectural decisions
- `tasks.md` - Ordered list of implementation tasks
- `specs/homepage-list-enhancement/spec.md` - Specification requirements and scenarios

## Key Changes
1. Remove redundant date display from post titles
2. Add 200-300 character content previews for each post
3. Constrain content width to ~850px for optimal readability
4. Add header with "Read it 1000 years later" tagline
5. Add footer with copyright and acknowledgments to Jekyll and GitHub

## Validation
Run `openspec validate enhance-homepage-layout --strict` to check for any issues.
