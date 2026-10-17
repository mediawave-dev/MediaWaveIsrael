#!/usr/bin/env bash
# Lighthouse mobile, all four categories, N runs, the median per category and metric.
# Usage: lh-all.sh <url> <tag> [runs=3]   (Lighthouse 13.5 installed in G:\tmp\lh)
# Serve the build gzipped first (uncompressed serving inflates Lantern by seconds):
#   node C:/Users/User/.claude/skills/pattern-breaker/scripts/serve.mjs dist --port 4192 --spa
url="$1"; tag="$2"; runs="${3:-3}"
export TEMP='G:\tmp\temp' TMP='G:\tmp\temp'
LH=/g/tmp/lh/node_modules/.bin/lighthouse
mkdir -p /g/tmp/mw-qa/lh
for i in $(seq 1 "$runs"); do
  "$LH" "$url" --quiet --form-factor=mobile --output=json --output-path="G:/tmp/mw-qa/lh/$tag-$i.json" --chrome-flags="--headless=new --no-first-run" >/dev/null 2>&1
done
python - "$tag" "$runs" <<'PY'
import json, sys, statistics as st
tag, runs = sys.argv[1], int(sys.argv[2])
rows = []
for i in range(1, runs + 1):
    try:
        d = json.load(open(f'G:/tmp/mw-qa/lh/{tag}-{i}.json', encoding='utf-8'))
    except Exception as e:
        print(tag, i, 'failed', e); continue
    c, a = d['categories'], d['audits']
    rows.append([round(c[k]['score'] * 100) for k in ('performance', 'accessibility', 'best-practices', 'seo')] + [
        a['largest-contentful-paint']['numericValue'] / 1000, a['total-blocking-time']['numericValue'],
        a['cumulative-layout-shift']['numericValue'], a['first-contentful-paint']['numericValue'] / 1000])
for r in rows:
    print(f'{tag}: perf {r[0]} a11y {r[1]} bp {r[2]} seo {r[3]} | LCP {r[4]:.2f}s TBT {r[5]:.0f}ms CLS {r[6]:.3f} FCP {r[7]:.2f}s')
if rows:
    m = lambda k: st.median([r[k] for r in rows])
    print(f'{tag} MEDIAN: perf {m(0)} a11y {m(1)} bp {m(2)} seo {m(3)} | LCP {m(4):.2f}s TBT {m(5):.0f}ms CLS {m(6):.3f} FCP {m(7):.2f}s')
PY
