// The still under each wheel video (D260): the video's own first frame, so the fade from still to video shows no jump.
// Usage: node scripts/posters-from-video.mjs   (every public/work/*-card-*.mp4 gets its public/work/*-card-*.webp)
import { readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

for (const f of readdirSync('public/work').filter((n) => /-card-[a-z0-9]+\.mp4$/.test(n))) {
  const png = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', `public/work/${f}`, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], { maxBuffer: 64 << 20 })
  const out = `public/work/${f.replace(/\.mp4$/, '.webp')}`
  // 528 px: a 176 px card on a phone with three device pixels to the CSS pixel
  await sharp(png).resize({ width: 528 }).webp({ quality: 72 }).toFile(out)
  console.log('  ', out)
}
