# -*- coding: utf-8 -*-
"""
Пакетная генерация изображений для сайта BURO.

Использует C:\\Users\\Flockyman\\ai-tools\\gen_image.py (ключ читается им самостоятельно).
Ключ нигде не печатается и не сохраняется.

  python tools/gen_images.py            # сгенерировать недостающие
  python tools/gen_images.py --force    # перегенерировать всё
  python tools/gen_images.py --only bayaan   # только по подстроке имени
"""
import os, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, r"C:\Users\Flockyman\ai-tools")
import gen_image  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "img", "raw")

# Единый визуальный код BURO: тёплый минимализм, естественный свет, спокойная геометрия.
STYLE = (
    "Photographed on a medium-format camera with a tilt-shift lens, perfectly vertical lines, "
    "natural daylight, soft shadows, calm restrained composition with generous negative space. "
    "Warm minimalist material palette: lime plaster, natural oak, travertine, brushed blackened steel, "
    "linen, muted warm greys and sand tones. Editorial architectural photography, "
    "Dezeen / Architectural Digest quality, subtle film grain, no people, no faces, "
    "no text, no lettering, no signage, no logos, no watermarks, no brand names."
)

EXT = (
    "Exterior architectural photography, tilt-shift lens, perfectly vertical lines, natural light, "
    "calm restrained composition. Contemporary architecture: warm sand-coloured stone, deep-set windows, "
    "blackened steel, clean horizontal lines. Editorial architectural photography, subtle film grain, "
    "no people, no text, no lettering, no signage, no logos, no watermarks."
)

W = "1536x1024"   # 3:2 горизонталь
V = "1024x1536"   # 2:3 вертикаль
S = "1024x1024"   # квадрат

IMAGES = [
    # --- Главная / общие ---------------------------------------------------
    ("hero-main", W,
     "Wide interior view of a contemporary business-class residential lobby in a northern continental city. "
     "Double-height space, full-height glazing with low winter sun, travertine floor, warm oak slatted wall, "
     "a long low bench, a single large plant, blackened steel reception desk. " + STYLE),
    ("og-default", W,
     "Minimal interior corner of a contemporary apartment: plastered wall, oak floor, a single Wishbone-style chair, "
     "long shadow from a tall window, empty calm space, warm neutral palette. " + STYLE),
    ("intro-detail", W,
     "Close architectural detail: junction of lime-plaster wall, oak reveal and blackened steel shadow gap, "
     "raking daylight across the surface, extreme material texture, macro-adjacent but architectural. " + STYLE),

    # --- Проект: BAYAAN, ЖК бизнес+ класса, места общего пользования -------
    ("bayaan-cover", W,
     "Entrance lobby of a business-plus class residential complex: double-height volume, full-height glazing, "
     "warm travertine walls, oak slat ceiling, a long freestanding stone bench, indirect cove lighting, "
     "polished concrete floor with a large soft rug. Late afternoon light. " + STYLE),
    ("bayaan-02", W,
     "Residential lobby lounge: low modular sofa in bouclé, round travertine coffee table, tall arched mirror, "
     "linen curtains filtering daylight, warm sand and greige palette, sculptural pendant lamp. " + STYLE),
    ("bayaan-03", V,
     "Elevator hall of a premium residential building: fluted oak wall panels, brushed bronze elevator doors, "
     "stone floor with a fine inlay line, a narrow console with a ceramic vessel, soft linear lighting. " + STYLE),
    ("bayaan-04", W,
     "Long residential corridor: rhythm of oak-framed doors, textured plaster walls, continuous linear light cove, "
     "dark stone skirting, deep perspective, quiet and precise. " + STYLE),
    ("bayaan-05", W,
     "Residents co-working lounge in a residential complex: long oak table, black slender chairs, "
     "bookshelf wall, glazed partition, warm task lighting, calm neutral materials. " + STYLE),

    # --- Проект: коттеджный дом --------------------------------------------
    ("cottage-cover", W,
     "Double-height living room of a private house: large panoramic window onto a snowy winter garden, "
     "plaster fireplace volume, deep low sofa in warm greige, oak floor, sculptural floor lamp, "
     "open oak staircase visible at the edge of frame. " + STYLE),
    ("cottage-02", W,
     "Open kitchen-dining of a private house: full-height oak cabinetry, veined stone island with waterfall edge, "
     "three slim pendant lights, long solid oak dining table with black chairs, view to the garden. " + STYLE),
    ("cottage-03", V,
     "Master bedroom of a private house: upholstered headboard wall in linen, warm plaster, "
     "bedside sconces in blackened brass, sheer curtain diffusing morning light, oak floor, minimal styling. " + STYLE),
    ("cottage-04", V,
     "Entrance hall and staircase of a private house: cantilevered oak treads, blackened steel balustrade with "
     "thin vertical rods, double-height plaster wall, single artwork, stone floor. " + STYLE),
    ("cottage-05", W,
     "Contemporary two-storey private house at dusk in a snowy landscape, warm sand stone and dark timber, "
     "large glazed openings glowing warm from inside, flat roof with deep overhang, cleared driveway. " + EXT),

    # --- Проект: квартира с террасой ---------------------------------------
    ("terrace-cover", W,
     "Living room of a contemporary apartment opening onto a terrace through full-height sliding glazing: "
     "low sofa, travertine coffee table, oak floor, sheer linen curtain, city skyline softly out of focus outside. " + STYLE),
    ("terrace-02", W,
     "Apartment terrace with outdoor lounge: large-format stone paving, low teak seating with off-white cushions, "
     "planters with ornamental grasses, glass balustrade, evening city light. " + EXT),
    ("terrace-03", V,
     "Compact contemporary kitchen in an apartment: handleless matte cabinetry in warm grey, stone splashback "
     "and worktop with visible veining, integrated linear lighting, one ceramic bowl, calm and precise. " + STYLE),
    ("terrace-04", W,
     "Overhead flat-lay of architectural working drawings on a light oak table: floor plans, sections and "
     "furniture layouts printed on white paper, a scale ruler, a mechanical pencil, folded tracing paper. "
     "Drawings are abstract technical linework without readable text or numbers. "
     "Soft daylight, muted palette, editorial studio photography, no people, no logos, no watermarks."),

    # --- Проект: коммерческий интерьер (офис) -------------------------------
    ("office-cover", W,
     "Contemporary office reception: monolithic stone desk, backlit oak slat wall, low lounge chairs, "
     "acoustic felt ceiling baffles, warm neutral palette, full-height glazing with city view. " + STYLE),
    ("office-02", W,
     "Open-plan workspace: long shared oak desks, black task chairs, glazed meeting box with fluted glass, "
     "linear suspended lighting, plants, calm warm-grey palette. " + STYLE),
    ("office-03", V,
     "Meeting room with a long stone table, black leather chairs, full-height oak wall with concealed doors, "
     "linen curtain, single pendant, precise and quiet. " + STYLE),

    # --- Проект: ресторан / гостеприимство ----------------------------------
    ("restaurant-cover", W,
     "Contemporary restaurant interior at dusk: banquette seating in deep olive bouclé, travertine bar with "
     "brushed bronze fittings, warm pools of light from small pendants, arched plaster niches, oak flooring. " + STYLE),
    ("restaurant-02", V,
     "Detail of a restaurant bar: travertine counter edge, blackened steel shelving with glassware, "
     "warm concealed lighting, dark plaster wall behind. " + STYLE),

    # --- Услуги -------------------------------------------------------------
    ("svc-apartment", W,
     "Contemporary apartment living room, warm minimalism: plaster walls, oak floor, low sofa, "
     "round travertine table, tall window with sheer curtain, calm empty space. " + STYLE),
    ("svc-house", W,
     "Interior of a private house: double-height hall with oak staircase, plaster walls, stone floor, "
     "panoramic window onto a winter landscape. " + STYLE),
    ("svc-commercial", W,
     "Boutique retail interior: fluted plaster walls, travertine display plinths, brushed steel rails, "
     "warm concealed lighting, calm and expensive, no merchandise branding. " + STYLE),
    ("svc-developers", W,
     "Show apartment in a new residential building, styled for viewing: neutral furniture, oak floor, "
     "plaster walls, large window with city view, staged and immaculate. " + STYLE),
    ("svc-architecture", W,
     "Contemporary low-rise residential building facade: warm sand stone, deep-set windows in blackened steel, "
     "horizontal banding, ground-floor glazing, winter daylight. " + EXT),
    ("svc-drawings", W,
     "Architectural working documentation on a desk: rolled and flat drawings with abstract technical linework, "
     "floor plans and sections, a scale ruler, matte black pen, oak table surface. "
     "No readable text or numbers. Soft daylight, editorial studio photography, no people, no logos."),
    ("svc-3d", W,
     "Large monitor on an oak desk in a quiet studio showing an abstract grey clay 3D render of an interior, "
     "beside it a colour swatch fan and a stone sample. Soft daylight, calm workspace, "
     "no readable text on screen, no people, no logos, no watermarks."),
    ("svc-supervision", W,
     "Interior under construction with finishing in progress: fresh plaster walls, protected oak floor, "
     "stone and tile samples leaning against a wall, a folded drawing on a trestle, "
     "daylight from a large window. No people, no text, no logos. " + STYLE),

    # --- О бюро / студия / процесс -----------------------------------------
    ("studio-01", W,
     "Architectural design studio interior: long shared oak worktable, matte black task lamps, "
     "pinboard wall with abstract plans and material samples, shelves with material boards, "
     "large window with northern light. No people, no readable text. " + STYLE),
    ("studio-02", W,
     "Overhead flat-lay of an interior material board: travertine and marble samples, oak veneer, "
     "brushed bronze and blackened steel chips, linen and bouclé fabric swatches, warm paint chips, "
     "arranged on a pale plaster surface. Soft daylight, editorial styling, no text, no logos."),
    ("process-01", W,
     "Hands only, from above, pointing at an architectural floor plan on a table, a pencil and scale ruler nearby, "
     "abstract technical linework with no readable text. Warm daylight, editorial photography, no faces, no logos."),
    ("process-02", W,
     "White cardboard architectural massing model of a residential building on a pale table, "
     "raking daylight casting long precise shadows, minimal and abstract, no text, no logos. " + STYLE),

    # --- Журнал -------------------------------------------------------------
    ("journal-01", W,
     "Overhead composition: interior design project documents, a floor plan, a material sample, a calculator "
     "and a pen on a pale plaster surface, abstract linework with no readable text. "
     "Soft daylight, editorial photography, no people, no logos."),
    ("journal-02", W,
     "Sequence of interior design stages laid out on a table: sketch, plan, material board, small stone sample, "
     "abstract and text-free, warm neutral palette, soft daylight, editorial flat-lay, no people, no logos."),
    ("journal-03", W,
     "Stack of architectural working drawings bound in a folder on an oak desk, abstract technical linework "
     "with no readable text, a black pen and a scale ruler alongside, soft daylight, no people, no logos."),
    ("journal-04", W,
     "Lobby of a new residential building seen from the entrance: stone floor, plaster walls, oak joinery, "
     "a long bench, low winter light through full-height glazing. " + STYLE),

    # --- ВИЗУАЛЬНАЯ ВОЛНА 2: хиро-кадры, детали, ночь, текстуры -------------
    # Хиро-слайды главной — высокое качество
    ("hero-02", W,
     "Dramatic double-height living room of a private house at blue hour: panoramic glazing onto snowy garden, "
     "warm interior light glowing, plaster fireplace wall, low sculptural furniture, long shadows, cinematic mood. " + STYLE, "high"),
    ("hero-03", W,
     "Monumental entrance lobby of a premium residential tower: ten-metre travertine wall washed by grazing light, "
     "floating blackened-steel staircase, single long stone bench, vast negative space, cathedral-like calm. " + STYLE, "high"),
    ("hero-04", W,
     "Contemporary restaurant interior at night seen slightly from above: glowing travertine bar as an island of light, "
     "olive velvet banquettes, candle-like pools of warm light, dark plaster walls, cinematic atmosphere. " + STYLE, "high"),

    # Широкоформатные кадры-разделители
    ("wide-materials", W,
     "Extreme close macro of travertine surface meeting brushed bronze strip and oak veneer, raking golden light, "
     "abstract composition of three materials in horizontal bands, tactile texture. " + STYLE, "high"),
    ("wide-light", W,
     "Sunlight pattern falling through tall mullioned window onto lime plaster wall and oak floor, "
     "almost abstract composition of light and shadow geometry, warm tones, meditative emptiness. " + STYLE, "high"),
    ("wide-stair", W,
     "Sculptural spiral staircase in warm plaster, viewed from below, soft daylight from a skylight above, "
     "abstract curves and shadow gradients, monumental and quiet. " + STYLE, "high"),

    # BAYAAN — дополнительные кадры
    ("bayaan-06", W,
     "Night exterior view into the glowing lobby of a business-class residential complex through full-height glazing: "
     "warm oak ceiling visible inside, stone bench, soft pools of light, snow falling outside, cinematic contrast. " + STYLE, "high"),
    ("bayaan-07", V,
     "Detail of a residential lobby: sculptural stone reception desk edge, brushed bronze inlay line, "
     "soft cove lighting grazing fluted plaster, shallow depth of field. " + STYLE),

    # Коттедж — дополнительные кадры
    ("cottage-06", W,
     "Private house living room at dusk: fireplace lit, snow outside panoramic window, warm pools of lamplight, "
     "deep shadows, hygge atmosphere without clutter, cinematic composition. " + STYLE, "high"),
    ("cottage-07", V,
     "Bathroom of a private house: monolithic travertine washbasin, backlit mirror niche, "
     "warm plaster walls, brass tap, single branch in a vase, spa-like calm. " + STYLE),

    # Терраса — дополнительные кадры
    ("terrace-05", W,
     "Apartment terrace at golden hour: low sun flaring across stone paving, linen canopy shadow, "
     "city skyline in warm haze beyond glass balustrade, teak lounge chair, glass of water on a stone side table. " + STYLE, "high"),

    # Процесс/студия — живые кадры работы
    ("studio-03", W,
     "Architectural model workshop table: several white cardboard massing models at different scales, "
     "cutting mat, steel ruler, scalpel, raking window light casting long precise shadows, no people. " + STYLE),
    ("studio-04", W,
     "Moodboard in progress on a linen pinboard: pinned fabric swatches, stone samples on a ledge below, "
     "torn paper notes without readable text, warm daylight, tactile creative disorder. " + STYLE),
]


def main():
    force = "--force" in sys.argv
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]

    os.makedirs(OUT, exist_ok=True)
    todo = []
    for item in IMAGES:
        name, size, prompt = item[0], item[1], item[2]
        quality = item[3] if len(item) > 3 else "medium"
        if only and only not in name:
            continue
        path = os.path.join(OUT, name + ".png")
        if os.path.exists(path) and not force:
            print("skip (есть):", name)
            continue
        todo.append((name, size, prompt, path, quality))

    if not todo:
        print("Нечего генерировать.")
        return

    cost = sum(0.165 if j[4] == "high" else 0.042 for j in todo)
    print("К генерации: %d изображений (~$%.2f)" % (len(todo), cost))
    t0 = time.time()
    ok, fail = 0, []

    def run(job):
        name, size, prompt, path, quality = job
        for attempt in range(3):
            try:
                gen_image.generate(path, prompt, size=size, quality=quality, model="gpt-image-2")
                return name, None
            except SystemExit as e:
                if attempt == 2:
                    return name, str(e)
                time.sleep(5 * (attempt + 1))
            except Exception as e:  # noqa: BLE001
                if attempt == 2:
                    return name, str(e)
                time.sleep(5 * (attempt + 1))
        return name, "unknown"

    with ThreadPoolExecutor(max_workers=4) as ex:
        for fut in as_completed([ex.submit(run, j) for j in todo]):
            name, err = fut.result()
            if err:
                fail.append((name, err))
                print("FAIL", name, err[:200])
            else:
                ok += 1

    print("\nГотово: %d ок, %d ошибок, %d сек" % (ok, len(fail), time.time() - t0))
    for n, e in fail:
        print(" -", n, e[:300])


if __name__ == "__main__":
    main()
