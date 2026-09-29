# hi-im-pod.github.io

Personal site of Garrett Ennis, AI security researcher at the SecAI Lab at
Sungkyunkwan University, and security engineer.

Live at [hi-im-pod.github.io](https://hi-im-pod.github.io).

## What is on it

- **Research and experience.** Background, education, research interests, and a
  reading list of peer-reviewed papers.
- **How I work.** The reasoning behind past projects: the constraint, the
  decision, the alternative I turned down, and the result.
- **Morse meters.** Every bar field spells a word in Morse. The decoder page
  teaches the code and tracks what you find.
- **Radio.** Four tracks that drive the bar fields in time with the music.
- **Privacy.** Every file loads from this site, fonts included. The ethics page
  lists exactly what the radio contacts once a visitor presses play.

## Run it

The site is static HTML, CSS and ES modules. Modules load over HTTP, so serve
the folder and open http://localhost:8788:

```
npx http-server -p 8788 -c-1
```

## Layout

| Path | Contents |
| --- | --- |
| `js/content.js` | All site text. Edit content here. |
| `js/templates.js` | The HTML for that content, shared by the browser and the build tool. |
| `js/resume.js` | Renders `resume.html`. |
| `js/render.js` | Renders the front page and wires up its features. |
| `js/waveform.js` | The bar fields and their Morse encoding. |
| `js/playlist.js` | Radio tracks and their running order. |
| `css/` | Design tokens, base styles, layout, components, and the font sheet. |
| `tools/` | Five build tools, described below. |
| `sitemap.xml`, `robots.txt` | The page list for search engines. |

## Pages

`index.html`, `reading.html`, `work.html` and `resume.html` take their content
from `js/content.js`. The résumé uses the same experience and education entries
as the front page, so the two cannot disagree. The other pages are written by
hand.

Every page except `diagnostics.html`, which runs without the site's scripts,
gets its nav from `NAV_ITEMS` in `js/templates.js`. Add a link there, not in
the HTML files, and run `build-static.mjs`. A new page also needs an entry in
the `PAGES` map in `tools/build-static.mjs` and a line in `sitemap.xml`.

`arrival.html` is left out of the sitemap on purpose and carries `noindex`. It
is found by decoding the footer message, not by search.

`404.html` is what GitHub Pages serves for any address that does not exist,
at that address. It is out of the sitemap and carries `noindex`, and its
`<base href="/">` keeps its links working when the missing address is nested,
such as `/old/path`.

## Escaping

Every value from `js/content.js` and `js/playlist.js` reaches the page through
`esc()` in `js/templates.js`, in text and in attributes. The only unescaped
markup is the markup written in `templates.js` itself: the tags around each
value, `ko()`, and the links in `footerHints()`. No data field holds HTML. If a
field needs a link or emphasis, add it in the template that renders the field,
as `footerHints()` does, and keep the data plain text. `esc()` does not check
URL schemes; `build-static.mjs` does. It fails the build on any generated
`href` or `src` that is not `https:`, `mailto:` or a path on this site.

## Tools

There are five. Four write committed files, so a fresh clone serves as-is.
`rank-tracks.mjs` only reports.

- **`build-static.mjs`** writes the site content, nav and footer into each HTML
  file as real markup, so every page reads fully in any browser, crawler or
  link preview. Run it after editing `js/content.js`, `js/playlist.js` or
  `js/templates.js`. Add `--check` to confirm the files match the source.
- **`build-envelope.mjs`** converts a track into the contour that drives the bar
  fields. The audio stays on your machine and only the contour is committed.
  Requires ffmpeg.
- **`rank-tracks.mjs`** ranks the radio by activity, liveliest track first,
  working from the committed contours, and says whether `js/playlist.js` is in
  that order.
- **`fetch-fonts.mjs`** downloads the webfonts and writes `css/fonts.css`. It
  subsets the Korean face to the Hangul characters in use. Requires
  `pip install fonttools brotli`.
- **`build-social-card.mjs`** renders `assets/social-card.png`, the link preview
  image. Run it with playwright installed and the site served, after changing
  the name, tagline or palette.

## Add a track

1. Build its contour: `node tools/build-envelope.mjs track.mp3 assets/envelopes/<name>.bin`
2. Add the YouTube ID, title, artist and contour path to `js/playlist.js`.
3. Run `node tools/rank-tracks.mjs` and reorder the list to match.
4. Run `node tools/build-static.mjs`.

## Write up a project

Each project in `js/content.js` has four fields. A project with all four filled
appears on `work.html`, and its front-page tile links there.

| Field | Contents |
| --- | --- |
| `constraint` | What made the problem hard. Include the numbers. |
| `decision` | What was chosen, in one active sentence. |
| `rejected` | The alternative turned down, and why it failed in this environment. |
| `measure` | How success was measured, as a metric. |

Each field takes a string, or an array of strings for several paragraphs.
`rejected` carries the most weight, because it shows the judgement behind the
build. Run `node tools/build-static.mjs` after editing.

## Fonts

Archivo and IBM Plex are self-hosted under the SIL Open Font License 1.1. See
`assets/fonts/README.txt`.
