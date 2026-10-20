# Site Review, October 20, 2026

The site’s engineering case study and thesis plan establish a clear professional
story. Its main weaknesses were the placement of that evidence and conclusions
that exceeded the pentest study’s records.

## Scope

Reviewed all nine HTML pages, shared content and templates, browser entry points,
navigation, Morse progress, radio loading, local asset references, page metadata,
sitemap, robots file, and build documentation. Checked the study against the
private lab repository at commit `a7d36aa`, including the findings report,
assessment notes, and captured task 19–20 records.

This review did not rerun the pentest experiments, inspect the remote lab database,
validate every bibliography entry, or audit the downloadable résumé PDF’s contents.

## Evidence Corrections

| Published claim | Evidence and revision |
| --- | --- |
| Model capability set the ceiling | The report records local counts of 4 and 4 and an API count of 22. Task histories and configuration differed. Present these as reported observations, without a causal model ranking. |
| One alert across the investigation | The alert was a manual signature test before the assessment tasks. State that origin and the limited User-Agent rule scope. |
| Detection caught almost none of the attacks | Suricata watched the analysis VM interface, not the internal switch. The record cannot establish detection recall across the whole lab. |
| The task outcome depended on prompt constraints | Task 20 inherited a foothold and prohibited further escalation. Later tasks inherited earlier work and changed permissions. Describe the sequence without calling it a controlled comparison. |
| About $9 for the full chain | Later notes report about $0.87 remaining from $10 across the investigation. Captured balances independently show task 19’s $0.12 and task 20’s $0.08 decreases. These are account-balance observations, excluding compute and labor. |
| All later results supported by run artifacts in the repo | Tasks 21–22 are described in written notes; their raw records remained in the lab database. Identify this evidence boundary on the page. |
| The lab’s segmentation could not be reached from inside | Distinguish the controlled external boundary from the internal segmentation under evaluation. API inference used a restricted relay. |

Task 19’s committed finding record identifies finding 86 as pending despite
recorded web-user execution. This illustrates why reported findings and
independently adjudicated vulnerabilities must remain separate.

## Site Changes

- Put Selected work immediately after About. Order the cards as thesis, lab
  study, SIEM architecture, and APT Explorer; use two columns on desktop.
- Replace the hero’s promise of attackers and successful defenders with
  “Studying AI-assisted attacks and building evidence-based detections.”
- Label the lab work exploratory and add methods, observations, source scope,
  and limitations. Preserve existing section IDs.
- Update the work page’s title and social descriptions to cover all studies.
  Rebuild the shared social image with the current tagline.
- Match navigation and Morse target order to the new page order.
- Frame the reading-list detection claim as a research question and qualify
  the SIEM latency figures as observations from those deployments.
- Correct the ethics page’s claim that the network panel stays empty: local
  files load, while browser measurements are not transmitted.
- Document the evidence fields and the separate résumé PDF maintenance step.

Certification wording, SysArc metrics, and omitted contract work follow the
owner’s earlier preferences. The radio, decoder, and visual identity remain.

## Validation

The static build and freshness check cover generated pages. Browser checks cover
all nine pages at desktop and phone widths, plus no-JavaScript checks for the
homepage, work page, and résumé. Local links and fragments are checked separately.
The browser checks use intercepted local files rather than a persistent server.

## Further Work

To turn the lab observations into a repeatable comparison, export the later task
records, pin model and framework versions, reset targets, match budgets, repeat
runs, adjudicate findings, and measure detection on every evaluated segment.
Retain the exploratory label until those conditions are met.
