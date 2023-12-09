syms = {
    ".": ["_ab.py"],
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
	"mon": {
		"interval": 1
	}
}
requires = ["ctuser"]