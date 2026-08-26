# -*- coding: utf-8 -*-
"""
Генерация медиа через kie.ai (унифицированный Jobs API).

Ключ читается из файла ВНЕ репозитория (KEY_FILE) и никогда не печатается.

  python tools/kie.py balance
  python tools/kie.py image "prompt..." --name steel-macro --ar 16:9 --res 2K
  python tools/kie.py image "prompt..." --name grain-x --ref URL --ref URL2   # i2i (nano-banana-edit)
  python tools/kie.py task <taskId>          # статус/результат задачи
  python tools/kie.py fetch <taskId> --name x  # скачать результат готовой задачи

Результаты кладутся в src/assets/img/raw/ (в .gitignore).
"""
import json
import os
import sys
import time
import urllib.request

KEY_FILE = r"C:\Users\Flockyman\kie-key.txt"
API = "https://api.kie.ai/api/v1"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "src", "assets", "img", "raw")


def _key():
    with open(KEY_FILE, encoding="utf-8") as f:
        return f.read().strip()


def _req(method, path, body=None):
    url = API + path
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": "Bearer " + _key(),
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def create_task(model, inp):
    resp = _req("POST", "/jobs/createTask", {"model": model, "input": inp})
    if resp.get("code") != 200:
        raise RuntimeError("createTask: %s" % resp)
    return resp["data"]["taskId"]


def task_info(task_id):
    return _req("GET", "/jobs/recordInfo?taskId=" + task_id)


def wait_task(task_id, every=5, timeout=600):
    t0 = time.time()
    while time.time() - t0 < timeout:
        resp = task_info(task_id)
        data = resp.get("data") or {}
        state = data.get("state")
        if state == "success":
            result = json.loads(data.get("resultJson") or "{}")
            urls = result.get("resultUrls") or []
            print("  готово, кредитов списано: %s" % data.get("creditsConsumed"))
            return urls
        if state == "fail":
            raise RuntimeError("задача упала: %s" % (data.get("failMsg") or data))
        time.sleep(every)
    raise RuntimeError("таймаут ожидания задачи " + task_id)


def download(urls, name):
    os.makedirs(RAW, exist_ok=True)
    out = []
    for i, u in enumerate(urls):
        ext = os.path.splitext(u.split("?")[0])[1] or ".jpg"
        fname = name + (("-%d" % (i + 1)) if len(urls) > 1 else "") + ext
        path = os.path.join(RAW, fname)
        req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
            f.write(r.read())
        print("  -> %s (%.1f KB)" % (path, os.path.getsize(path) / 1024))
        out.append(path)
    return out


def gen_image(prompt, name, refs=None, ar="16:9", res="1K", model=None):
    if refs and (model is None or "edit" in model):
        model = model or "google/nano-banana-edit"
        inp = {"prompt": prompt, "image_urls": refs, "output_format": "jpeg", "aspect_ratio": ar}
    else:
        model = model or "nano-banana-2"
        inp = {"prompt": prompt, "aspect_ratio": ar, "resolution": res, "output_format": "jpg"}
        if refs:
            inp["image_input"] = refs
    print("[%s] %s" % (model, name))
    tid = create_task(model, inp)
    print("  taskId: %s" % tid)
    return download(wait_task(tid), name)


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return
    cmd = args[0]
    if cmd == "balance":
        print(_req("GET", "/chat/credit"))
    elif cmd == "task":
        print(json.dumps(task_info(args[1]), ensure_ascii=False, indent=2))
    elif cmd == "fetch":
        name = args[args.index("--name") + 1] if "--name" in args else args[1]
        data = task_info(args[1]).get("data") or {}
        urls = json.loads(data.get("resultJson") or "{}").get("resultUrls") or []
        download(urls, name)
    elif cmd == "image":
        prompt = args[1]
        def opt(flag, default=None):
            return args[args.index(flag) + 1] if flag in args else default
        refs = [args[i + 1] for i, a in enumerate(args) if a == "--ref"] or None
        gen_image(prompt, opt("--name", "gen"), refs=refs,
                  ar=opt("--ar", "16:9"), res=opt("--res", "1K"), model=opt("--model"))
    else:
        print("неизвестная команда: " + cmd)


if __name__ == "__main__":
    main()
