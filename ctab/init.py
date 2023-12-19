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
        "skim": False,
        "balance": False,
        "network": "bitcoin"
    },
    "comptroller": {
        "actives": 20,
        "live": False
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
            "outer": 20,
            "loud": False
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
        "timeout": 10,
        "interval": 1
    }
}
requires = ["ctuser"]