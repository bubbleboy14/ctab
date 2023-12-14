from mkswap import presets, getOffice
from cantools.web import respond, succeed
from cantools import config

office = getOffice(**presets[int(config.ctab.office)])

def response():
	succeed(office.status())

respond(response)