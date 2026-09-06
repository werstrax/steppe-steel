# Фотографии для STEPPESTEEL — 07.09.2026

Текущее направление: реальные фотографии, предоставленные пользователем. Прежние архитектурные рендеры и интерактивный 3D-блок сняты со страниц. Подробная техническая документация и оригиналы PDF сохранены.

> Уточнение пользователя: все четыре фото — зернохранилища. Актуальное распределение остальных категорий и новые изображения: [обновление](category-photos-2026-09-07.md).

## Размещение

| Исходник в Downloads | Ресурс | Размещение |
| --- | --- | --- |
| WhatsApp Image 2026-09-07 at 00.07.26.jpeg | photo-warehouse-exterior | Первый экран, зернохранилища |
| WhatsApp Image 2026-09-07 at 00.07.37.jpeg | photo-warehouse-interior | Конструкция и галерея зернохранилищ |
| WhatsApp Image 2026-09-07 at 00.07.56.jpeg | photo-warehouse-frame | Каркас зернохранилища |
| WhatsApp Image 2026-09-07 at 00.08.18.jpeg | photo-grain-complex | Галерея зернохранилищ |
| Дополнительный сгенерированный интерьер | photo-editorial-interior | Снят со страниц после уточнения; сохранён в архиве |

Фотографии не приписываются новому проекту завода. Аэроснимок не является заявлением о производстве силосов. Генерированный интерьер подписан на странице «сгенерированный кадр».

## Подготовка изображений

- Оригиналы сохранены без изменений в локальной папке src/assets/img/raw, которая исключена из публикации.
- WebP с адаптивными ширинами 320–1672 px; у каждого снимка предел равен его исходному разрешению. Увеличение разрешения не применялось.
- JPEG для совместимости. У трёх небольших исходных JPEG резервные файлы побайтово совпадают с оригиналами.
- Первый экран загружается приоритетно; остальные изображения — лениво. Размеры указаны в HTML.
- WebP шириной 480 px: 19–34 КБ. Основные версии шириной 577–1152 px: 38–142 КБ.
- Точные размеры и байты: photo-optimization.json.
- Полноразмерный новый кадр: ../src/assets/img/photo-editorial-interior-1672.webp.

## Новый кадр: генерация

Режим: встроенный image_gen (одна генерация по двум референсам пользователя).
Исходник результата:
C:/Users/Flockyman/.codex/generated_images/01a07129-66d9-7293-8ac6-944581512449/exec-c6f80e11-c6ee-4d9c-aa5c-4d3db8ac2d09.png

Промпт:

```text
Use case: photorealistic-natural.
Asset type: one widescreen 16:9 documentary architectural interior photograph illustration.
Input images: Image 1 is a construction-type and photographic realism REFERENCE showing the actual interior of a galvanized-steel agricultural grain warehouse. Image 2 is a supporting construction-type REFERENCE showing its exterior. These are references only: generate a NEW image, do not modify either original and do not reproduce them exactly.
Primary request: Create ONE extraordinarily photorealistic photograph-like INTERIOR of a functional galvanized-steel grain warehouse of the exact construction TYPE visible in the references. Exposed silver-grey triangulated steel roof trusses joined coherently in repeating bays; trapezoidal profiled metal roofing and vertical sheet upper walls; inward-sloping lower grain retaining walls along both sides, matching the reference's characteristic inclined metal retaining-wall panels. Broad worn concrete floor with faint genuine tire marks, subtle dusty patches, small realistic surface imperfections. Empty operational agricultural warehouse, no grain pile required.
Composition/framing: A professional real architectural photographer's eye-height full-frame 24mm lens view looking lengthwise through the broad storage hall, straight verticals and natural corrected perspective, believable proportions, widescreen 16:9. Show the roof trusses and lower sloping walls clearly. Gentle natural daylight from an open doorway, neutral white balance, realistic exposure with softly darker distant interior.
Materials/style: Authentic mundane working agricultural building elevated only through competent documentary photography. Real metal surfaces with subtle unevenness, fastening details, slight dust and wear. Photographic fine detail and restrained natural contrast, ordinary practical lighting.
Constraints: No people, machinery, signs, text, logos, watermark. No stylized architectural visualization, no perfectly pristine materials, no excessive CGI metallic shine, no glossy plastic appearance, no dramatic fog or haze, no cinematic sunset or theatrical light beams, no extravagant architecture. It will be identified externally as an illustrative generated photograph, not a verified real project; do not bake a label into the image.
```

## Проверка

Сборка и статический валидатор. Отдельно проверены наличие всех пяти новых ресурсов в HTML, отсутствие прежних рендеров и 3D-загрузчика в страницах, целостность трёх PDF и ограничения исходного разрешения. Браузерное тестирование не выполнялось.
