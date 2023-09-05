import rel, json, websocket

def log(*msg):
	print(*msg)

_predefs = {
	"strategy": "rsi",
	"platform": "dydx"
}
_presets = [{
	"strategy": "slosh",
	"globalTrade": True,
	"globalStrategy": True,
	"symbols": ["BTC-USD", "ETH-USD"]
}, {
	"platform": "gemini",
	"symbols": ["BTCUSD", "ETHUSD", "ETHBTC"]
}, {
	"symbols": ["BTC-USD"]
}]

def presets():
	from cantools.util.io import selnum
	print("noting Office defaults (%s), please select a configuration from the following presets.\n"%(_predefs,))
	return selnum(_presets)

def crsub(streamname):
	return {
		"name": "SubscribeTicker",
		"data": streamname
	}

def ddtrades(streamname):
	return {
		"type": "subscribe",
		"channel": "v3_trades",
		"id": streamname
	}

def ddorders(streamname):
	return {
		"type": "subscribe",
		"channel": "v3_orderbook",
		"id": streamname
	}

def subber(streamname, submaker, doafter=None):
	def _subber(ws):
		log("opened - sending sub block")
		ws.jsend(submaker(streamname))
		doafter and doafter()
	return _subber

def jsend(ws):
	def _jsend(jmsg):
		msg = json.dumps(jmsg)
		log("sending:", msg)
		ws.send(msg)
	return _jsend

platforms = {
	"dydx": {
#		"feed": "wss://api.stage.dydx.exchange/v3/ws",
		"feed": "wss://api.dydx.exchange/v3/ws",
		"subber": ddtrades # or ddorders - both get "Invalid subscription id for channel"
	},
	"chainrift": {
		"feed": "wss://ws.chainrift.com/v1",
		"subber": crsub
	},
	"gemini": {
		"feeder": lambda sname : "wss://api.gemini.com/v1/marketdata/%s"%(sname,)
	}
}

def feed(platname, streamname, **cbs): # {on_message,on_error,on_open,on_close}
	plat = platforms[platname]
	feed = "feed" in plat and plat["feed"] or plat["feeder"](streamname)
	if "subber" in plat:
		cbs["on_open"] = subber(streamname,
			plat["subber"], getattr(cbs, "on_open", None))
	ws = websocket.WebSocketApp(feed, **cbs)
	ws.jsend = jsend(ws)
	ws.run_forever(dispatcher=rel)
	return ws

def echofeed(platform="gemini", streamname="ETHBTC"):
	return feed(platform, streamname,
		on_message = lambda ws, msg : log(msg),
		on_close = lambda ws, code, msg: log("close!", code, msg),
		on_error = lambda ws, exc : log("error!", str(exc)))

def dydxtest():
	echofeed("dydx", "BTC-USD")
	start()

def events(message, use_initial=False):
	msg = json.loads(message)
	if "events" in msg: # gemini
		ez = []
		for event in msg["events"]:
			if event.get("type") != "change" or not event.get("side"):
				log("skipping", event)
			if use_initial or event.get("reason") != "initial":
				ez.append(event)
		return ez
	else: # dydx
		log("\n\n\n", message, "\n\n\n")
		if "contents" in msg:
			return msg["contents"]["trades"]
		else:
			log("skipping event!!!")
			return []

def spew(event):
	log(json.dumps(event))

def start():
	rel.signal(2, rel.abort)
	rel.dispatch()

def stop():
	log("goodbye")
	rel.abort()