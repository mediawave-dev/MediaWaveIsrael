#!/usr/bin/env bash
# Lighthouse mobile, 3 runs, prints perf / LCP / TBT / CLS per run and the median. Usage: lh3.sh <url> <tag>
url="$1"; tag="$2"
export TEMP='G:\tmp\temp' TMP='G:\tmp\temp'
LH=/g/tmp/lh/node_modules/.bin/lighthouse
mkdir -p /g/tmp/mw-qa/lh
for i in 1 2 3; do
  "$LH" "$url" --quiet --only-categories=performance --form-factor=mobile --output=json --output-path="G:/tmp/mw-qa/lh/$tag-$i.json" --chrome-flags="--headless=new --no-first-run" >/dev/null 2>&1
done
python - "$tag" <<'PY'
import json, sys, statistics as st
tag = sys.argv[1]
rows = []
for i in (1, 2, 3):
    try:
        d = json.load(open(f'G:/tmp/mw-qa/lh/{tag}-{i}.json', encoding='utf-8'))
    except Exception as e:
        print(tag, i, 'failed', e); continue
    a = d['audits']
    rows.append((round(d['categories']['performance']['score'] * 100), a['largest-contentful-paint']['numericValue'] / 1000, a['total-blocking-time']['numericValue'], a['cumulative-layout-shift']['numericValue'], a['first-contentful-paint']['numericValue'] / 1000))
for r in rows: print(f'{tag}: perf {r[0]} LCP {r[1]:.2f}s TBT {r[2]:.0f}ms CLS {r[3]:.3f} FCP {r[4]:.2f}s')
if rows:
    m = lambda k: st.median([r[k] for r in rows])
    print(f'{tag} MEDIAN: perf {m(0)} LCP {m(1):.2f}s TBT {m(2):.0f}ms CLS {m(3):.3f} FCP {m(4):.2f}s')
PY
