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
    "harvester": {
        "batch": 10,
        "bottom": 50,
        "skim": False,
        "balance": True,
        "network": "bitcoin"
    },
    "comptroller": {
        "live": False,
        "actives": 20,
        "prunelimit": 0.1
    },
    "backend": {
        "staging": True
    },
    "office": {
        "index": 0,
        "verbose": False,
        "stagish": False
    },
    "base": {
        "unspammed": True
    },
    "strategy": {
        "base": {
            "inner": 3,
            "outer": 10,
            "long": 40,
            "loud": False
        },
        "rsi": {
            "size": 10,
            "period": 14
        },
        "slosh": {
            "vmult": 16,
            "vcutoff": 0.5
        }
    },
    "mon": {
        "timeout": 20,
        "interval": 1
    }
}
requires = ["ctuser"]