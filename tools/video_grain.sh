#!/usr/bin/env bash
# Обработка видео с объекта (обзор монтажа зернохранилища, вертикальное 478x850 из WhatsApp)
# в два файла для сайта: полный ролик с речью и короткая нарезка без звука.
#
#   bash tools/video_grain.sh "C:/Users/.../WhatsApp Video 2026-09-06 at 19.12.41.mp4"
#   STEP=loop bash tools/video_grain.sh "<исходник>"   # только нарезка (full | loop | poster | all)
#
# Нужен ffmpeg с libplacebo (сборка Gyan full) и GPU с Vulkan: апскейл ewa_lanczossharp
# и дебандинг считаются на видеокарте. Без Vulkan — замените блок UP на CPU-вариант ниже.
# Стабилизация (vidstab) пробовалась и забракована: на переменной частоте кадров WhatsApp
# даёт рассыпанные блоки; ролик остаётся «с руки», это честная съёмка с площадки.
set -euo pipefail
SRC="${1:?source video}"
STEP="${STEP:-all}"
OUT="src/assets/video"
TMP="${TMPDIR:-/tmp}/video_grain"
mkdir -p "$OUT" "$TMP"

# Шумоподавление до апскейла (кодек WhatsApp), масштаб 720x1280 на GPU, лёгкая резкость после.
DENOISE="hqdn3d=1.5:1:2.5:2.5"
UP="hwupload,libplacebo=w=720:h=1280:upscaler=ewa_lanczossharp:deband=true:deband_iterations=2:deband_threshold=4:format=yuv420p,hwdownload,format=yuv420p"
SHARP="unsharp=5:5:0.35"
X264="-c:v libx264 -preset slow -profile:v high -level 4.0 -pix_fmt yuv420p -movflags +faststart"

# 1. Полный ролик с речью: 0:00–4:00, звук — срез гула ветра, мягкое шумоподавление, нормализация громкости.
#    crf 28 + потолок 1,4 Мбит/с: исходник и так 1,4 Мбит/с, выше битрейт не добавит деталей,
#    а файл лежит в репозитории GitHub Pages (ориентир — до 40 МБ).
if [ "$STEP" = all ] || [ "$STEP" = full ]; then
ffmpeg -v error -y -init_hw_device vulkan -i "$SRC" -t 240 \
  -vf "fps=30,${DENOISE},${UP},${SHARP},fade=t=in:st=0:d=0.3,fade=t=out:st=239.4:d=0.6" \
  -af "highpass=f=100,afftdn=nr=8:nf=-40,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=239.2:d=0.8" \
  $X264 -crf 28 -maxrate 1400k -bufsize 2800k -c:a aac -b:a 96k -ac 1 "$OUT/grain-walkthrough.mp4"
echo "full: $(du -h "$OUT/grain-walkthrough.mp4" | cut -f1)"
fi

# 2. Нарезка без звука для автопроигрывания: спокойные планы каркаса без руки ведущего
#    (в 3:39–3:51 ведущий жестикулирует, в 2:36–2:41 в объектив бьёт солнце — эти куски не берём).
#    start:len — секунды исходника.
if [ "$STEP" = all ] || [ "$STEP" = loop ]; then
SEGS=("3:6" "60:8" "185:5" "172:6" "237:4")
i=0; LIST=()
for s in "${SEGS[@]}"; do
  st="${s%%:*}"; ln="${s##*:}"
  ffmpeg -v error -y -init_hw_device vulkan -ss "$st" -t "$ln" -i "$SRC" \
    -vf "fps=30,${DENOISE},${UP},${SHARP}" -an -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$TMP/seg$i.mp4"
  LIST+=("$TMP/seg$i.mp4"); i=$((i+1))
done

# Склейка с перекрёстным затемнением 0.5 с, затемнение в начале и в конце — для зацикливания.
python - "$TMP" "$OUT" "${SEGS[@]}" <<'PY'
import subprocess, sys
tmp, out, segs = sys.argv[1], sys.argv[2], sys.argv[3:]
lens = [float(s.split(':')[1]) for s in segs]
n = len(lens); F = 0.5
inputs = []
for i in range(n): inputs += ['-i', f'{tmp}/seg{i}.mp4']
fc, prev, off = [], '[0:v]', 0.0
for i in range(1, n):
    off += lens[i-1] - F
    cur = f'[x{i}]' if i < n-1 else '[xf]'
    fc.append(f'{prev}[{i}:v]xfade=transition=fade:duration={F}:offset={off:.3f}{cur}')
    prev = cur
total = off + lens[-1]
fc.append(f'[xf]fade=t=in:st=0:d=0.4,fade=t=out:st={total-0.4:.3f}:d=0.4,format=yuv420p[v]')
cmd = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', '[v]',
       '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level', '4.0', '-pix_fmt', 'yuv420p',
       '-crf', '30', '-maxrate', '900k', '-bufsize', '1800k', '-movflags', '+faststart', '-an',
       f'{out}/grain-loop.mp4']
subprocess.run(cmd, check=True)
print('loop: %.1f s' % total)
PY
echo "loop: $(du -h "$OUT/grain-loop.mp4" | cut -f1)"
fi

# 3. Кандидаты в постер (1080x1920). Выбран кадр 1:15 — он же video-grain-poster в images.json:
#    cp <кадр> src/assets/img/raw/video-grain-poster.jpg && python tools/optimize_images.py video-grain-poster
if [ "$STEP" = all ] || [ "$STEP" = poster ]; then
for t in 6 9 75 225; do
  ffmpeg -v error -y -init_hw_device vulkan -ss "$t" -i "$SRC" -frames:v 1 \
    -vf "${DENOISE},hwupload,libplacebo=w=1080:h=1920:upscaler=ewa_lanczossharp:deband=true:format=yuv420p,hwdownload,format=yuv420p,${SHARP}" \
    -q:v 2 "$TMP/poster-$t.jpg"
done
echo "posters: $TMP/poster-*.jpg"
fi
