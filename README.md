# hi-im-pod.github.io

Personal site for Garrett Ennis, a master's student and researcher at the SecAI
Lab at Sungkyunkwan University. Published at
[hi-im-pod.github.io](https://hi-im-pod.github.io).

## Running it

Static HTML, CSS, and ES modules. There is no build step. The modules need a
real origin, so open it through a server rather than from the filesystem:

```
npx http-server -p 8788 -c-1
```

## Layout

| Path | What it holds |
| --- | --- |
| `js/content.js` | Every piece of text on the site. Change content here, not in the markup. |
| `js/templates.js` | That content as HTML. Used by the browser and by the build tool, so the two cannot disagree. |
| `js/render.js` | Applies the templates to the front page and wires up the rest. |
| `js/waveform.js` | The bar fields, including the Morse encoding. |
| `css/` | Design tokens, base, layout, components, and the generated font sheet. |
| `tools/` | Two generators, described below. |

## Generators

Both write files that are committed, so a clone needs neither to serve the site.

`tools/fetch-fonts.mjs` downloads the webfonts and writes `css/fonts.css`, so
that opening a page sends no request to Google. It scans the source for Hangul
and pulls only the Korean chunks covering the characters actually used, cutting
each one to those glyphs. Re-run it after adding Korean text. Needs
`pip install fonttools brotli`.

`tools/build-static.mjs` writes the site's content into the HTML files as real
markup, from the same templates in `js/templates.js` that the browser uses. Run
it after editing `js/content.js` or `js/playlist.js`. Pass `--check` to verify
nothing is stale without writing.

The pages carry their own content rather than waiting for a script because
`<noscript>` only fires when scripting is *disabled*, not when a script is
blocked or fails. A content blocker that stops one file leaves scripting on, so
the noscript fallback stays hidden. Before this existed, `index.html` in that
state came to 68 characters, and so did the view a link unfurler or a
non-JavaScript crawler got.

## Notes

The section dividers are not decoration. Each one spells the name of the section
below it in Morse, encoded in the bar heights. `decoder.html` explains how to
read them.

Fonts are self-hosted under the SIL Open Font License 1.1. See
`assets/fonts/README.txt`. The site makes no third-party requests.
