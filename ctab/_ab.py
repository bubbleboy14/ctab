from mkswap.config import config as swapconf
from cantools.web import respond, succeed, cgi_get
from cantools import config

def response():
	office = config.ctab.live.office
	action = cgi_get("action", choices=["status",
		"curconf", "setconf", "cancelall"], default="status")
	if action == "cancelall":
		office.cancelAll()
	elif action == "curconf":
		succeed(swapconf.current())
	elif action == "setconf":
		swapconf.set(cgi_get("mod"))
	else: # status (pubsub swapmon)
		succeed(office.status())

respond(response)