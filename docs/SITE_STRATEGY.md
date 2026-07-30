# Asymmetrico site strategy

## Story

The site makes one compact argument: Asymmetrico is a sports technology company;
advanced development tools are unevenly distributed; practical technology can
create leverage; baseball is the first proving ground; and the ambition extends
across sport.

The homepage contains approximately 330 words of visible editorial copy and six
substantial sections:

1. Hero — category, headline, support, baseball, and two actions.
2. Access gap — the problem in two short statements.
3. Mission — the strategic and emotional centre, paired with baseball imagery.
4. Baseball and work — three compact truth-state blocks.
5. Why Asymmetrico — one concise explanation of asymmetric advantage.
6. Closing — vision and contact invitation.

## Architecture

The public site has four pages: `/`, `/work`, `/about`, and `/contact`. The former
standalone name-explanation page is absorbed into About and the former named-product
case study is absorbed into Work. Permanent redirects preserve both old URLs.

The Work page separates built software, research/experimental work, and future
direction without naming a product. The About page keeps sports technology current
and describes physical-system experience only as technical origin.

## Privacy and evidence

Public work is described as built in a real community baseball environment without
identifying the organization. Synthetic interface content is labelled as a
reconstruction. No real athlete, evaluation, account, team, customer, deployment,
or repository information is published.

## Content rules

Central shared copy lives in `content/site.ts`. Prefer one image, headline, and
short paragraph to grids of cards. Do not restore a named-product hierarchy,
standalone speculative products, repeated mission statements, or a long feature
case study.
