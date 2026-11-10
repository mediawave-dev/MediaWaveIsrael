# The ink film

A 17 second macro film of a ballpoint pen drawing the MediaWave logo, with its sound. It is the ground of the home
page's hero: a lit sheet of paper with the headline set on it, lying over the showreel (`src/look/sea/SeaSign.tsx`,
D232 to D235). Nothing in
it is footage, a photo, a 3D model or a sample: the sheet of paper, the ink, the brass tip, the light, the lens and
the sound are all computed here.

One take, three cuts (`SHOTS` in `render.js`): the hand is the same, the camera differs. The site uses two: `p`,
upright, for a screen taller than wide (the pen in the upper half, the lower half of the sheet left calm for the
words), and `w`, wide (the pen on the left and high, the lower right left calm). `sq` is the first, square cut with
a pool of light on a dark desk; the site no longer uses it.

## Files

| File | What it does |
|---|---|
| `hand.js` | The logo as pen strokes, read from `logos/horizon/mediawave-compact-light.svg` (the disc and the wave from its numbers, each letter as the centre line of its glyph), with a real hand's timing. The one source for picture and sound. |
| `hand.html` | The strokes as flat ink, to judge the hand before any light: `node shoot.mjs hand.html out.png 1500 420` |
| `render.js`, `shaders.js`, `render.html` | The renderer: builds the paper (fibres into a height map) and the ink map (distance to the line and the moment the ball covered each point), then path-traces each frame in WebGL2 with a thin lens, an open shutter and a softbox. |
| `render.mjs` | Drives the renderer in Chrome on the GPU and writes one PNG a frame. |
| `audio.mjs` | The sound, synthesised from the same strokes: the paper's roughness read at the pen's speed, the desk's ring, touches, lifts, the hand, the room. One sound for every cut. |
| `spectrum.py` | How harsh the sound is, in numbers, heard the way a phone hears it (A-weighted, nothing under 400 Hz): where the energy sits, how far the pitch wanders, how many clicks a second. Python with numpy. |
| `calm.py` | Where words can stand on a cut: which part of the frame the pen, its shadow or the ink ever cover, over every frame. Prints the table the QA gate checks the words against (Python with Pillow and numpy). |
| `serve.mjs`, `shoot.mjs` | A static server for this folder and a one-page screenshot. |

## Making it again

Frames go outside the repository (about 1 GB of PNG a cut). On this machine (Iris Xe) a cut takes about 10 minutes.
The driver skips frames that already exist: delete the ones a change touches, or the whole folder.

```bash
node design/film/ink/render.mjs --out G:/tmp/ink/frames-p --cut p --w 810 --h 1440 --spp 160
node design/film/ink/render.mjs --out G:/tmp/ink/frames-w --cut w --w 1600 --h 900 --spp 160
node design/film/ink/audio.mjs G:/tmp/ink/ink.wav
python design/film/ink/spectrum.py G:/tmp/ink/ink.wav
```

The signed sheet is what stays on the screen, so its last frame is also rendered at twice the size, for dense screens:

```bash
node design/film/ink/render.mjs --out G:/tmp/ink/hi-p --cut p --w 1620 --h 2880 --spp 160 --frames 501
node design/film/ink/render.mjs --out G:/tmp/ink/hi-w --cut w --w 3200 --h 1800 --spp 160 --frames 501
```

After a render that moves the pen or the camera, measure where the words may stand, and carry the numbers over:

```bash
python design/film/ink/calm.py G:/tmp/ink/frames-p G:/tmp/ink/p-min.png
python design/film/ink/calm.py G:/tmp/ink/frames-w G:/tmp/ink/w-min.png
```

The printed table goes into `CUTS` in `scripts/qa/ink-sign.mjs`; `--calm` and `--edge` in
`src/look/sea/sea-sign.css` are read off it (the row from which the film stays paper, and for the wide cut how far
in from the left that holds); the mark's and Replay's places there are the disc's place in the close shot and the
logo's in the last frame.

A few frames to look at while tuning (`--q` passes extra settings to the page, for example `ev=0.8&ap=1`):

```bash
node design/film/ink/render.mjs --out G:/tmp/ink/test --cut w --w 800 --h 450 --spp 48 --frames 30,110,250,372,501
```

Encoding, into `public/media/ink/`:

```bash
P=G:/tmp/ink/frames-p/f%04d.png; W=G:/tmp/ink/frames-w/f%04d.png; O=public/media/ink
CS="-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv"
VF="flags=lanczos:out_color_matrix=bt709:out_range=limited,format=yuv420p"
ffmpeg -y -framerate 30 -i $P -vf "scale=810:1440:$VF" $CS -c:v libx264 -preset slower -crf 23 -g 60 -movflags +faststart -an $O/ink-p.mp4
ffmpeg -y -framerate 30 -i $W -vf "scale=1600:900:$VF" $CS -c:v libx264 -preset slower -crf 23 -g 60 -movflags +faststart -an $O/ink-w.mp4
ffmpeg -y -framerate 30 -i $W -vf "scale=1280:720:$VF" $CS -c:v libx264 -preset slower -crf 24 -g 60 -movflags +faststart -an $O/ink-w-m.mp4
ffmpeg -y -framerate 30 -i $P -vf "scale=810:1440:$VF" $CS -c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 -cpu-used 2 -g 60 -an $O/ink-p.webm
ffmpeg -y -framerate 30 -i $W -vf "scale=1600:900:$VF" $CS -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -cpu-used 2 -g 60 -an $O/ink-w.webm
ffmpeg -y -framerate 30 -i $W -vf "scale=1280:720:$VF" $CS -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 -cpu-used 2 -g 60 -an $O/ink-w-m.webm
ffmpeg -y -i G:/tmp/ink/frames-p/f0000.png -vf scale=810:1440:flags=lanczos -quality 90 $O/ink-p-open.webp
ffmpeg -y -i G:/tmp/ink/frames-p/f0501.png -vf scale=810:1440:flags=lanczos -quality 90 $O/ink-p-signed.webp
ffmpeg -y -i G:/tmp/ink/frames-w/f0000.png -vf scale=1600:900:flags=lanczos -quality 90 $O/ink-w-open.webp
ffmpeg -y -i G:/tmp/ink/frames-w/f0501.png -vf scale=1600:900:flags=lanczos -quality 90 $O/ink-w-signed.webp
ffmpeg -y -i G:/tmp/ink/hi-p/f0501.png -quality 84 $O/ink-p-signed-2x.webp
ffmpeg -y -i G:/tmp/ink/hi-w/f0501.png -vf scale=2880:1620:flags=lanczos -quality 84 $O/ink-w-signed-2x.webp
ffmpeg -y -i G:/tmp/ink/ink.wav -c:a aac -b:a 128k -movflags +faststart $O/ink.m4a
```

## What to know before changing it

- The hero's cuts light the whole sheet (`pool` and `edge` in `SHOTS`): the page shows them edge to edge, as its
  ground, and the paper's colour there (`--paper` in `sea-sign.css`, `#e8e5de`) is the film's own, measured. Only the
  square cut has the dark desk (`GROUND`, the site's `#0f1011`).
- A film of a bright flat sheet comes out of any encoder in faint flat patches (8 bit colour has no steps that
  small; a lower crf more than doubles the file and still shows them). The page lays a still grain over the sheet
  instead (`.sea-sign::before`).
- Words go only where `calm.py` says the film stays paper. A new camera or a new hand means a new measure.
- The sound is a soft hush of one colour, on purpose. The first version read the paper as sound at the pen's speed
  (a hiss that swept with every stroke), clicked on every fibre, ticked at 2.9 kHz on every lift and knocked on
  every touch; Nati and others found it grating. On a phone's speaker nothing under 400 Hz is left, so judge any
  change with `spectrum.py`: clicks ("jumps") near 0 a second, the pitch wandering under about 100 Hz, and no
  louder than about -27 LUFS. Nobody here can listen to it: say so when handing it over.
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
