# Промпты для генерации кадров Steppe Steel

Единый визуальный код сайта: **серебристая оцинковка** (не тёмный прокат),
графитовые сэндвич-панели с одной оранжевой полосой, север Казахстана,
фотореализм без людей и без текста в кадре.

Все команды кладут файл сразу в `src/assets/img/raw/`. После генерации:

```bash
python tools/optimize_images.py
```

Он сам сделает WebP в 5 ширинах + JPEG-фолбэк + LQIP и допишет `images.json`.
Дальше кадр нужно прописать в данные — это сделаю я, просто скажите, что готово.

**Стоимость:** medium ≈ $0.042, high ≈ $0.165 за кадр.
Hero-кадры (A2, A3, A4) имеет смысл делать `--quality high`, остальные — medium.

---

## Приоритет A — смысловые дырки (генерировать в первую очередь)

### A1. `delivery-truck` — отгрузка комплекта
Сейчас на странице «Комплектация и доставка» стоит кадр монтажа — то есть
страница про доставку показывает не доставку. Это главная нестыковка.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py delivery-truck.png "Photorealistic aerial view of a flatbed truck loaded with neatly strapped bundles of silver galvanized steel C-profiles in an industrial yard, a forklift beside it, stacks of steel packages, cold clear morning light, northern Kazakhstan steppe horizon far behind, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### A2. `grain-inside` — зернохранилище изнутри
Ключевой продающий кадр для аграрника: он должен увидеть, как зерно лежит
до наклонных стен. Такого кадра нет вообще.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py grain-inside.png "Photorealistic interior of a large grain storage building, golden wheat piled high against inclined galvanized steel walls, exposed silver galvanized steel frames and roof purlins overhead, daylight streaming from ridge skylights through dust haze, deep perspective down the length of the building, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality high --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### A3. `warehouse-inside` — тёплый склад изнутри
Показывает пролёт без колонн — главный аргумент по складам.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py warehouse-inside.png "Photorealistic interior of a modern warehouse, clear span with no internal columns, light grey sandwich panel walls, silver galvanized steel roof trusses and purlins, rows of pallet racking with plain wrapped goods, bright industrial LED lighting, polished concrete floor, deep symmetrical perspective, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality high --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### A4. `tseh-inside` — производственный цех изнутри
На странице «Цеха и заводы» нет ни одного собственного интерьера.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py tseh-inside.png "Photorealistic interior of an industrial production workshop, heavy black steel columns and roof trusses combined with silver galvanized steel purlins, an overhead crane beam spanning the hall, tall clear span, cold daylight through ribbon windows and roof lights, empty clean concrete floor, deep perspective, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality high --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### A5. `machinery-hangar` — ангар для техники
Подтип «Ангар для техники» сейчас без кадра, а это отдельный запрос аграриев
(«заедет ли комбайн с жаткой»).

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py machinery-hangar.png "Photorealistic interior of an agricultural machinery hangar, generic unbranded combine harvester and tractor parked inside, very tall sliding gates open to a golden field, silver galvanized steel frames and roof structure, dusty warm afternoon light falling through the open gate, wide perspective, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no brand names, no signage, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

---

## Приоритет B — снять дубли и усилить страницы

### B1. `profile-stack` — пакеты профилей ПСУ/ПС
Страница `/profili/` сейчас вообще без фотографии — только чертёж.
Этот кадр даёт «вот он, наш металл».

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py profile-stack.png "Photorealistic close-up of neatly stacked bundles of silver galvanized cold-formed steel profiles, C-shaped and sigma-shaped sections with punched holes and stiffening ribs visible at the ends, zinc spangle texture catching cold light, shallow depth of field, factory floor background softly blurred, medium-format product photography, no people, no faces, no text, no lettering, no labels, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### B2. `sport-hall` — спортивный зал
Подтип «Спортивный зал» на странице цехов без кадра, а это заказы школ и акиматов.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py sport-hall.png "Photorealistic interior of a school sports hall, clear span roof with exposed silver galvanized steel trusses, no internal columns, wooden sports floor with plain court markings, tall windows along one wall, bright even daylight, wide symmetrical perspective, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### B3. `foundation-piles` — винтовые сваи и ростверк
Для статьи про фундамент и конструктива зернохранилищ (сейчас там зимний монтаж).

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py foundation-piles.png "Photorealistic construction site close-up of galvanized screw piles driven into frozen ground in a row, bolted steel grillage beams connecting the pile heads, no concrete, thin snow and dry grass, low winter sun casting long shadows, flat open landscape behind, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### B4. `km-desk` — рабочее место конструктора
Для услуги «Проектирование» и статьи про КМ/КМД.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py km-desk.png "Photorealistic top-down view of an engineer desk, technical steel structure drawings with dimension lines and section details spread out, metal ruler, calipers, pencil, a monitor edge showing a grey 3D steel frame model, warm desk lamp light on matte paper, shallow depth of field, no people, no hands, no faces, no readable text, no lettering, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### B5. `factory-yard` — двор завода
Для страницы «О заводе» (сейчас держится на кадре каркаса в поле).

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py factory-yard.png "Photorealistic aerial view of a steel fabrication plant yard, long production hall with graphite panels and a single orange stripe, stacks of silver galvanized profile bundles laid out in rows, a truck at the loading gate, gravel yard, flat open landscape and a road at the horizon, golden hour light, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

---

## Приоритет C — если захочется добить

### C1. `hangar-night` — фирменный ангар вечером
Кандидат в новый OG-кадр и hero-альтернатива.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py hangar-night.png "Photorealistic dusk exterior of a modern industrial hangar with matte graphite sandwich panels and one bright orange horizontal stripe, warm light spilling from the open gate onto gravel, deep blue twilight sky, flat dark landscape around, low drone angle, medium-format architectural photography, vertical lines strictly vertical, no people, no faces, no text, no lettering, no signage, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### C2. `roof-purlins` — ритм прогонов изнутри
Красивый фактурный кадр для разделителя секций.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py roof-purlins.png "Photorealistic upward view of a galvanized steel roof structure from inside a building, repeating rhythm of C-profile purlins and truss diagonals converging in perspective, zinc surface catching cold daylight from ridge skylights, strong graphic geometry, medium-format architectural photography, no people, no faces, no text, no lettering, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

### C3. `bolt-joint` — болтовой узел крупным планом
Аргумент «сборка без сварки» сейчас проиллюстрирован только узлом зернохранилища.

```bash
python C:\Users\Flockyman\ai-tools\gen_image.py bolt-joint.png "Photorealistic extreme close-up of a bolted connection between galvanized steel profiles, hexagonal bolts and washers in punched holes, zinc spangle texture, gusset plate, shallow depth of field with cold neutral light, blurred steel frame in background, macro product photography, no people, no text, no lettering, no logos, no watermarks" --quality medium --out "C:\Users\Flockyman\Desktop\stepee steel site\src\assets\img\raw"
```

---

## Что важно в промптах и лучше не менять

- **«silver galvanized»** — иначе модель рисует тёмный крашеный прокат, а это
  не ваш продукт.
- **«no people, no faces»** — люди в кадре сразу выдают сток и требуют
  согласия на публикацию.
- **«no text, no lettering, no signage, no logos»** — нейросети пишут
  бессмысленные буквы на стенах и бортах машин, это самый частый брак.
- **«vertical lines strictly vertical»** — убирает завал стен.
- **Одна оранжевая полоса** — фирменный код; больше оранжевого в кадре не нужно.
- Кадры остаются визуализациями: на сайте они выводятся с меткой
  «ВИЗУАЛИЗАЦИЯ». Выдавать их за фото объектов нельзя.
