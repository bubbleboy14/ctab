from mkswap import presets, Office
from cantools.web import respond, succeed
from cantools import config

office = Office(**presets[int(config.ctab.office)])

def response():
	succeed(office.status())

respond(response)