from mkswap.config import config as swapconf
from cantools.web import respond, succeed, cgi_get
from cantools import config

def response():
	livemods = config.ctab.live
	action = cgi_get("action", choices=["status",
		"curconf", "setconf", "cancelall"], default="status")
	if action == "cancelall":
		livemods.gem.cancelAll()
	elif action == "curconf":
		succeed(swapconf.current())
	elif action == "setconf":
		swapconf.set(cgi_get("mod"))
	else: # status (pubsub swapmon)
		succeed(livemods.office.status())

respond(response)