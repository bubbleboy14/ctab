from mkswap import presets, getOffice
from mkswap.office import setVerbose
from mkswap.backend import setStaging
from mkswap.comptroller import setLive, setActives
from cantools.web import respond
from cantools.util import log
from cantools import config

tcfg = config.ctab

def s2b(cfg, key):
	if cfg[key] == "False":
		cfg.update(key, False)

def s2i(cfg, key):
	cfg[key] and cfg.update(key, int(cfg[key]))

def prep():
	s2b(tcfg.office, "verbose")
	s2b(tcfg.backend, "staging")
	s2b(tcfg.comptroller, "live")
	s2i(tcfg.comptroller, "actives")
	s2i(tcfg.office, "index")

def response():
	log("initializing mkswap office", important=True)
	prep()
	setLive(tcfg.comptroller.live)
	setVerbose(tcfg.office.verbose)
	setStaging(tcfg.backend.staging)
	setActives(tcfg.comptroller.actives)
	config.update("office", getOffice(**presets[int(tcfg.office.index)]))
	log("office initialized")

respond(response)