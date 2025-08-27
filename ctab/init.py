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
        "bottom": 10,
        "usdmax": 50,
        "skim": False,
        "balance": True,
        "network": "bitcoin"
    },
    "actuary": {
        "sig": 9,
        "fast": 12,
        "slow": 26,
        "range": 14,
        "small": 10,
        "medium": 60,
        "large": 360,
        "int": "5m"
    },
    "accountant": {
        "split": 16,
        "nmult": 1.0,
        "nudge": "auto",
        "capped": "auto"
    },
    "trader": {
        "size": 8,
        "adxguard": 0,
        "book": True,
        "force": False
    },
    "comptroller": {
        "live": False,
        "actives": 20,
        "plimit": 0.1,
        "leeway": 0.001,
        "canceleach": True
    },
    "backend": {
        "mdv2": True,
        "staging": True,
        "realdie": True,
        "credset": "default"
    },
    "office": {
        "index": 0,
        "tpvtick": 60,
        "verbose": False,
        "stagish": False,
        "strategy": "preset"
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
        "outer": 256,
        "hist": 1024
    },
    "strategy": {
        "base": {
            "loud": False
        },
        "rsi": {
            "size": 4,
            "period": 16
        },
        "hint": {
            "mult": 0.8,
            "score": 1.5
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
        },
        "macdadx": {
            "low": 25,
            "high": 50
        }
    },
    "mon": {
        "timeout": 60,
        "interval": 1
    }
}
requires = ["ctuser"]