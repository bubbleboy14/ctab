from mkswap.config import config as swapconf
from cantools.web import respond, succeed, cgi_get
from cantools import config

def response():
	office = config.ctab.live.office
	action = cgi_get("action", choices=["status", "curconf",
		"setconf", "cancel", "candles"], default="status")
	if action == "cancel":
		token = cgi_get("token")
		if token == "all":
			office.cancelAll()
		else:
			office.cancel(token)
	elif action == "curconf":
		succeed(swapconf.obj())
	elif action == "setconf":
		swapconf.set(cgi_get("mod"))
	elif action == "candles":
		succeed(office and office.actuary.candles or { "waiting": "candles loading" })
	else: # status (pubsub swapmon)
		succeed(office and office.status() or { "waiting": "office loading" })

respond(response)