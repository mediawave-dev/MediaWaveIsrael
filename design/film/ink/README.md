# The ink film

A 17 second macro film of a ballpoint pen drawing the MediaWave logo, with its sound. It plays in the home page's
hero (`src/look/sea/SeaSign.tsx`, D232 and D233). Nothing in it is footage, a photo, a 3D model or a sample: the
sheet of paper, the ink, the brass tip, the light, the lens and the sound are all computed here.

## Files

| File | What it does |
|---|---|
| `hand.js` | The logo as pen strokes, read from `logos/horizon/mediawave-compact-light.svg` (the disc and the wave from its numbers, each letter as the centre line of its glyph), with a real hand's timing. The one source for picture and sound. |
| `hand.html` | The strokes as flat ink, to judge the hand before any light: `node shoot.mjs hand.html out.png 1500 420` |
| `render.js`, `shaders.js`, `render.html` | The renderer: builds the paper (fibres into a height map) and the ink map (distance to the line and the moment the ball covered each point), then path-traces each frame in WebGL2 with a thin lens, an open shutter and a softbox. |
| `render.mjs` | Drives the renderer in Chrome on the GPU and writes one PNG a frame. |
| `audio.mjs` | The sound, synthesised from the same strokes: the paper's roughness read at the pen's speed, the desk's ring, touches, lifts, the hand, the room. |
| `serve.mjs`, `shoot.mjs` | A static server for this folder and a one-page screenshot. |

## Making it again

Frames go outside the repository (about 1 GB of PNG). On this machine (Iris Xe) the full render takes about 10 minutes.
The driver skips frames that already exist: delete the ones a change touches, or the whole folder.

```bash
node design/film/ink/render.mjs --out G:/tmp/ink/frames --size 1080 --spp 160
node design/film/ink/audio.mjs G:/tmp/ink/ink.wav
```

A few frames to look at while tuning (`--q` passes extra settings to the page, for example `ev=0.8&ap=1`):

```bash
node design/film/ink/render.mjs --out G:/tmp/ink/test --size 1080 --spp 48 --frames 30,110,250,372,501
```

Encoding, into `public/media/ink/`:

```bash
F=G:/tmp/ink/frames/f%04d.png; O=public/media/ink
CS="-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv"
VF="flags=lanczos:out_color_matrix=bt709:out_range=limited,format=yuv420p"
ffmpeg -y -framerate 30 -i $F -vf "scale=1080:1080:$VF" $CS -c:v libx264 -preset slower -crf 23 -g 60 -movflags +faststart -an $O/ink.mp4
ffmpeg -y -framerate 30 -i $F -vf "scale=720:720:$VF" $CS -c:v libx264 -preset slower -crf 24 -g 60 -movflags +faststart -an $O/ink-m.mp4
ffmpeg -y -framerate 30 -i $F -vf "scale=1080:1080:$VF" $CS -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -cpu-used 2 -g 60 -an $O/ink.webm
ffmpeg -y -framerate 30 -i $F -vf "scale=720:720:$VF" $CS -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 -cpu-used 2 -g 60 -an $O/ink-m.webm
ffmpeg -y -i G:/tmp/ink/frames/f0000.png -vf scale=900:900:flags=lanczos -quality 78 $O/ink-open.webp
ffmpeg -y -i G:/tmp/ink/frames/f0501.png -vf scale=900:900:flags=lanczos -quality 80 $O/ink-signed.webp
ffmpeg -y -i G:/tmp/ink/ink.wav -c:a aac -b:a 128k -movflags +faststart $O/ink.m4a
```

## What to know before changing it

- The film's black is the site's ground (`#0f1011`, `GROUND` in `render.js`), and the page shows it through a round
  soft mask, so there is no frame to see. Change the ground and both must change.
- The ink is the logo's Prussian blue (`INK` in `shaders.js` is what a film of it absorbs, not a colour).
- The key light sits behind and to the side. Straight behind the sheet, the whole fresh line mirrored the softbox
  into the lens and lost its blue.
- The trace shader has no loops on purpose: ANGLE's HLSL compiler unrolls them and a heavy loop takes minutes.
- The ink map has two layers and each stroke keeps to one (odd and even strokes). Choosing the layer by distance
  along the line left a seam after every sharp corner, and it showed as a white nick across the stroke.
- The pen leaves before the camera rises, and the drop on the i is set in the close shot: a pen with no hand on it
  in a wide shot is the one thing that gives the film away.
- The strip light is for the brass only (the sheet never sees it), and the key lights the sheet as a far lamp would,
  so the logo is evenly lit from end to end.
- The sound was never heard by the model that wrote it: it was judged by its spectrum and levels only. A real
  recording of a pen on paper, cut to the film's length, can replace `ink.m4a` with no code change.
- The drawing is a pen's rendition of the logo in one weight and one ink. The logo files stay the source of truth.
