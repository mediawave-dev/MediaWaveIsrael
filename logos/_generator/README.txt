# Generator scripts — geometry source of truth
# gen-wordmark.mjs: Outfit TTF -> vector paths (needs opentype.js@1.3.4 + outfit-*.ttf from Google Fonts)
# gen-mark.mjs: tapered-ribbon crest mark (Tiller-Hanson offset beziers)
# compose.mjs: assembles all crest lockup SVGs from the two above
# patch-swell.mjs: cleanup + lockup for the swell concept (needs wf source svgs)
# run: node compose.mjs <outdir>
