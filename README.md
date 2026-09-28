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
| `js/render.js` | Renders the front page and wires up its features. |
| `js/waveform.js` | The bar fields and their Morse encoding. |
| `js/playlist.js` | Radio tracks and their running order. |
| `css/` | Design tokens, base styles, layout, components, and the font sheet. |
| `tools/` | Build tools, described below. |

## Tools

Each tool writes committed files, so a fresh clone serves as-is.

- **`build-static.mjs`** writes the site content into each HTML file as real
  markup, so every page reads fully in any browser, crawler or link preview.
  Run it after editing `js/content.js` or `js/playlist.js`. Add `--check` to
  confirm the files match the source.
- **`build-envelope.mjs`** converts a track into the contour that drives the bar
  fields. The audio stays on your machine and only the contour is committed.
  Requires ffmpeg.
- **`rank-tracks.mjs`** orders the radio by activity, liveliest track first,
  working from the committed contours.
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
