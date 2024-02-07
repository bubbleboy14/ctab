from mkswap.backend import setStaging, setCredSet
from mkswap.config import config as swapconfig
from mkswap import presets, getOffice
from cantools.web import respond
from cantools.util import log
from cantools import config

def response():
	log("initializing mkswap office", important=True)
	swobj = config.ctab.obj()
	presel = presets[int(swobj["office"].pop("index"))]
	swobj.pop("mon")
	swapconfig.set(swobj)
	setStaging()
	setCredSet()
	config.ctab.sub("live").update("office", getOffice(**presel))
	log("office initialized")

respond(response)