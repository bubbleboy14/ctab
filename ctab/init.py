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
        "bottom": 40,
        "skim": False,
        "balance": True,
        "network": "bitcoin"
    },
    "accountant": {
        "capped": True
    },
    "comptroller": {
        "live": False,
        "actives": 20,
        "prunelimit": 0.1
    },
    "backend": {
        "staging": True,
        "realdie": True,
        "credset": "default"
    },
    "office": {
        "index": 0,
        "verbose": False,
        "stagish": False
    },
    "base": {
        "unspammed": True
    },
    "ndx": {
        "inner": 16,
        "short": 32,
        "long": 64,
        "outer": 128
    },
    "strategy": {
        "base": {
            "loud": False
        },
        "rsi": {
            "size": 10,
            "period": 14
        },
        "slosh": {
            "vmult": 16,
            "vcutoff": 0.5,
            "randlim": 0.002,
            "oneswap": False
        }
    },
    "mon": {
        "timeout": 60,
        "interval": 1
    }
}
requires = ["ctuser"]