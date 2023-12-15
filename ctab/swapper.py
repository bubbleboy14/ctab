from mkswap import presets, getOffice
from cantools.web import respond
from cantools.util import log
from cantools import config

def response():
	log("initializing mkswap office", important=True)
	config.update("office", getOffice(**presets[int(config.ctab.office)]))
	log("office initialized")

respond(response)