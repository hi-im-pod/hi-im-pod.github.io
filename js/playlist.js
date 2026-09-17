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

export const playlist = [
  {
    id: 'jNQXAC9IVRw',
    title: 'Placeholder',
    artist: 'Swap this entry out',
    envelope: 'assets/envelopes/placeholder.bin',
  },
];

// Shown above the track list. Says what the radio is, in one line.
export const radioIntro =
  'Tracks play from YouTube, so nothing loads from Google until you press play. '
  + 'The bar fields across the site follow whatever is playing.';
