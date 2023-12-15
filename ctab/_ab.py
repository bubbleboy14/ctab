from cantools.web import respond, succeed
from cantools import config

def response():
	succeed(config.office.status())

respond(response)