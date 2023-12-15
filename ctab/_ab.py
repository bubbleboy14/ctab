from mkswap.config import config as swapconf
from cantools.web import respond, succeed, cgi_get
from cantools import config

def response():
	action = cgi_get("action", choices=["status",
		"curconf", "setconf"], default="status")
	if action == "curconf":
		succeed(swapconf.current())
	elif action == "setconf":
		swapconf.set(cgi_get("mod"))
	else: # status (pubsub swapmon)
		succeed(config.office.status())

respond(response)