import pathlib, re, struct

root = pathlib.Path(__file__).resolve().parent
scenes = root / "scenes" / "docs"
images = root.parent / "docs" / "images"


def width(name):
    data = (images / f"{name}.png").read_bytes()
    return struct.unpack(">I", data[16:20])[0] // 2


def scene(match):
    name = match.group(1)
    yaml = (scenes / f"{name}.yaml").read_text().rstrip()
    return f"```yaml\n{yaml}\n```\n\n<img src=\"images/{name}.png\" width=\"{width(name)}\" alt=\"{name}\">"


def image(match):
    name = match.group(1)
    return f"<img src=\"images/{name}.png\" width=\"{width(name)}\" alt=\"{name}\">"


for name in ("configuration", "examples"):
    src = (root / f"{name}.md.in").read_text()
    out = re.sub(r"\{\{scene:([\w-]+)\}\}", scene, src)
    out = re.sub(r"\{\{image:([\w-]+)\}\}", image, out)
    (root.parent / "docs" / f"{name}.md").write_text(out)
    print(f"docs/{name}.md written")
