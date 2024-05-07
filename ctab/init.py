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
    "actuary": {
        "small": 10,
        "medium": 60,
        "large": 360
    },
    "accountant": {
        "nmult": 1.0,
        "nudge": "auto",
        "capped": "auto"
    },
    "trader": {
        "force": False,
        "booktrades": True
    },
    "comptroller": {
        "live": False,
        "actives": 20,
        "prunelimit": 0.1
    },
    "backend": {
        "mdv2": True,
        "staging": True,
        "realdie": True,
        "credset": "default"
    },
    "office": {
        "index": 0,
        "verbose": False,
        "stagish": False
    },
    "feeder": {
        "heartbeat": 10,
        "wsdebug": "auto"
    },
    "base": {
        "unspammed": True
    },
    "ndx": {
        "inner": 32,
        "short": 64,
        "long": 128,
        "outer": 256
    },
    "strategy": {
        "base": {
            "loud": False
        },
        "rsi": {
            "size": 4,
            "period": 16
        },
        "slosh": {
            "vmult": 16,
            "vcutoff": 0.8,
            "randlim": 0.04,
            "oneswap": "auto"
        },
        "handcart": {
            "risk": 0.5,
            "profit": 0.01,
            "threshold": 0.05
        }
    },
    "mon": {
        "timeout": 60,
        "interval": 1
    }
}
requires = ["ctuser"]