// The radio's playlist. Each track plays through YouTube's iframe, so nothing
// here is hosted by this site and nothing needs a licence: YouTube already
// settled that with the rights holders, and an embed is how they intend the
// content to be used off-site.
//
// `envelope` points at a spectrum contour built from the track by
// tools/build-envelope.mjs. That file is what the bar fields animate from,
// because the iframe is a different origin and the Web Audio API cannot reach
// its audio. The contour is derived data of a few dozen kilobytes; the audio it
// was measured from never enters this repo.
//
// To add a track:
//   1. find the YouTube id, the part after v= in the watch URL
//   2. node tools/build-envelope.mjs "path\to\track.m4a" assets/envelopes/<slug>.bin
//   3. add an entry below
// A track with no envelope still plays. The bars fall back to their own timing.

// Ordered by how little dead air each track has, liveliest first, because the
// bars are the reason the radio exists and a visitor who presses play is most
// likely watching during the first minute. Seconds below are the time each
// track spends under half its own average level, measured from its contour by
// tools/rank-tracks.mjs. Re-run that after adding a track.
export const playlist = [
  {
    id: 'Ob_EDY9Eiis',
    title: 'WannaCry',
    artist: 'Ninajirachi & Porter Robinson',
    envelope: 'assets/envelopes/wannacry.bin',   // 5s still
  },
  {
    id: 'x4ErS1hKABk',
    title: 'Hard Refresh (DJ Dave Remix)',
    artist: 'DJ Dave',
    envelope: 'assets/envelopes/hard-refresh.bin',   // 7s still
  },
  {
    id: 'Bj_5qfFBn8Q',
    title: 'The Peace (Frost Children Remix)',
    artist: 'underscores',
    envelope: 'assets/envelopes/the-peace.bin',   // 21s still
  },
  {
    id: 'HU1EdQKQV3M',
    title: 'iPod Touch (Madeon Remix)',
    artist: 'Ninajirachi',
    envelope: 'assets/envelopes/ipod-touch.bin',   // 23s still
  },
];

// Shown above the track list. Says what the radio is, in one line.
export const radioIntro =
  'Tracks play from YouTube, so nothing loads from Google until you press play. '
  + 'The bar fields across the site follow whatever is playing.';
