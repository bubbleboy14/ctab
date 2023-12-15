from mkswap import presets, getOffice
from mkswap.backend import setStaging
from mkswap.comptroller import setLive
from cantools.web import respond
from cantools.util import log
from cantools import config

tcfg = config.ctab
for flag in ["live", "staging"]:
	if tcfg[flag] == "False":
		tcfg.update(flag, False)

def response():
	log("initializing mkswap office", important=True)
	setLive(tcfg.live)
	setStaging(tcfg.staging)
	config.update("office", getOffice(**presets[int(tcfg.office)]))
	log("office initialized")

respond(response)