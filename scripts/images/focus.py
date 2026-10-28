"""Photo focus v1.0: record each local photo's size and, when it shows people, where their faces are, so crops keep heads in frame.
Writes image.width, image.height and image.position ("x% y%", only when faces are found) into every data entry with a local image.
Run: python3 scripts/images/focus.py  (re-runnable; an entry with "positionManual": true keeps its position)."""
import json, glob, os
import cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL = os.environ.get("YUNET_MODEL", os.path.expanduser("~/.cache/argile/face_detection_yunet_2023mar.onnx"))   # OpenCV Zoo's YuNet face model

def focus(path):
    """(w, h, 'x% y%' or None): the centre of the faces found, nudged up so the head sits in the upper part of a crop."""
    with Image.open(path) as im: w, h = im.size
    img = cv2.imread(path)
    if img is None: return w, h, None
    det = cv2.FaceDetectorYN.create(MODEL, "", (w, h), score_threshold=0.85)
    _, found = det.detect(img)
    side = min(w, h)
    faces = [f[:4].astype(int) for f in (found if found is not None else []) if min(f[2], f[3]) >= side * 0.05]
    if len(faces) == 0: return w, h, None
    big = max(f[2] * f[3] for f in faces)
    keep = [f for f in faces if f[2] * f[3] >= big * 0.35]          # the people, not a face-like pattern on a pot
    x0 = min(f[0] for f in keep); x1 = max(f[0] + f[2] for f in keep)
    y0 = min(f[1] for f in keep); y1 = max(f[1] + f[3] for f in keep)
    cx, cy = (x0 + x1) / 2 / w, (y0 + y1) / 2 / h
    cy = max(0.0, cy - 0.06)                                          # a little headroom above the face
    return w, h, f"{round(cx * 100)}% {round(cy * 100)}%"

def entries(d):
    if isinstance(d, list): return d
    if isinstance(d, dict) and isinstance(d.get("opportunities"), list): return d["opportunities"]
    return [x for k, v in d.items() if isinstance(v, list) for x in v if isinstance(x, dict)]

stats = {"sized": 0, "faces": 0}
for f in sorted(glob.glob(os.path.join(ROOT, "data/opportunities/*.json"))) + [os.path.join(ROOT, "data/inspirations/index.json")]:
    raw = open(f).read(); d = json.loads(raw)
    indent = 2 if raw.startswith("[\n  {") or raw.startswith("{\n  ") else 1
    changed = False
    for x in entries(d):
        img = x.get("image")
        if not isinstance(img, dict) or not str(img.get("src", "")).startswith("/"): continue
        p = os.path.join(ROOT, "public", img["src"].lstrip("/"))
        if not os.path.exists(p): continue
        w, h, pos = focus(p)
        img["width"], img["height"] = w, h; stats["sized"] += 1; changed = True
        if pos and not img.get("positionManual"): img["position"] = pos; stats["faces"] += 1
        elif not pos and not img.get("positionManual"): img.pop("position", None)
    if changed: open(f, "w").write(json.dumps(d, indent=indent, ensure_ascii=False) + "\n")
print(stats)
