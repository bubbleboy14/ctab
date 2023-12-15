dirs = ["bots"]
syms = {
    ".": ["_ab.py", "swapper.py"],
    "js": ["ab"],
    "css": ["ab.css"],
    "html": ["ab"],
    "bots": ["swapmon.py"]
}
model = {
    "ctab.model": ["*"]
}
routes = {
    "/_ab": "_ab.py"
}
cfg = {
    "comptroller": {
        "actives": 10,
        "live": False
    },
    "backend": {
        "staging": True
    },
    "office": {
        "index": 0,
        "verbose": True
    },
    "mon": {
        "interval": 1
    }
}
requires = ["ctuser"]