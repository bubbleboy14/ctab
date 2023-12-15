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
    "base": {
        "unspammed": True
    },
    "strategy": {
        "base": {
            "inner": 10,
            "outer": 40,
            "loud": True
        },
        "rsi": {
            "size": 10,
            "period": 14
        },
        "slosh": {
            "vmult": 10
        }
    },
    "mon": {
        "interval": 1
    }
}
requires = ["ctuser"]