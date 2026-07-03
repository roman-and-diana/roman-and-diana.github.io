#!/usr/bin/env bash
#
# optimize-media.sh — compress portfolio videos and posters for the web.
#
# WHY: assets/video is ~475 MB (single clips up to 54 MB). That is far too
# heavy for a GitHub Pages portfolio — slow first load and wasted bandwidth.
# These are 9:16 Reels. Settings are tuned for QUALITY: 1080px wide + CRF 21
# keeps the footage visually near-lossless while still cutting total size
# roughly 2-3x (beauty detail is preserved).
#
# REQUIREMENTS: ffmpeg, and cwebp (from the `webp` package) for posters.
#   macOS:  brew install ffmpeg webp
#   Ubuntu: sudo apt install ffmpeg webp
#
# USAGE (from the repo root):
#   chmod +x optimize-media.sh
#   ./optimize-media.sh            # writes *.opt.mp4 next to originals (safe)
#   ./optimize-media.sh --replace  # overwrite originals after review
#
set -euo pipefail

VIDEO_DIR="assets/video"
REPLACE=false
[[ "${1:-}" == "--replace" ]] && REPLACE=true

command -v ffmpeg >/dev/null || { echo "ffmpeg not found. Install it first."; exit 1; }

echo "== Compressing videos in $VIDEO_DIR =="
for f in "$VIDEO_DIR"/*/video.mp4; do
  [[ -e "$f" ]] || continue
  out="${f%.mp4}.opt.mp4"
  before=$(du -h "$f" | cut -f1)
  echo "-> $f ($before)"
  ffmpeg -y -loglevel error -i "$f" \
    -vf "scale='min(1080,iw)':-2" \
    -c:v libx264 -preset slow -crf 21 -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 128k -movflags +faststart \
    "$out"
  after=$(du -h "$out" | cut -f1)
  echo "   done -> $out ($after)"
  if $REPLACE; then mv -f "$out" "$f"; fi
done

echo "== Converting posters to WebP =="
if command -v cwebp >/dev/null; then
  for p in "$VIDEO_DIR"/*/poster.png; do
    [[ -e "$p" ]] || continue
    cwebp -quiet -q 85 -resize 1080 0 "$p" -o "${p%.png}.webp"
    echo "-> ${p%.png}.webp"
  done
  echo "NOTE: update PortfolioRenderer.js poster path from poster.png to poster.webp,"
  echo "      or keep .png as a <video poster> fallback."
else
  echo "cwebp not found — skipping posters. Install the 'webp' package to enable."
fi

echo "== Done. Review the .opt.mp4 files, then re-run with --replace to swap in. =="
