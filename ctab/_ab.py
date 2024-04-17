from rel.util import emit
from mkswap.config import config as swapconf
from cantools.web import respond, succeed, cgi_get
from cantools.util import log
from cantools import config

def response():
	office = config.ctab.live.office
	action = cgi_get("action", choices=["status", "curconf",
		"setconf", "cancel", "candles", "bt"], default="status")
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
		succeed(office and office.actuary.oldCandles(int(cgi_get("count", default=10))) or {
			"waiting": "candles loading"
		})
	elif action == "bt":
		sym = cgi_get("sym")
		side = cgi_get("side")
		log("/_ab forwarding %s %s order"%(sym, side))
		emit("balTrades", sym, side)
	else: # status (pubsub swapmon)
		succeed(office and office.status() or { "waiting": "office loading" })

respond(response)