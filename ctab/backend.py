import rel, json, websocket

LOUD = True

def crsub(streamname):
	return {
		"name": "SubscribeTicker",
		"data": streamname
	}

def subber(streamname, submaker, doafter=None):
	def _subber(ws):
		ws.jsend(submaker(streamname))
		doafter and doafter()
	return _subber

def jsend(ws):
	def _jsend(jmsg):
		msg = json.dumps(jmsg)
		LOUD and print("sending:", msg)
		ws.send(msg)
	return _jsend

platforms = {
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
	feed = getattr(plat, "feed", plat["feeder"](streamname,))
	if "subber" in plat:
		cbs["on_message"] = subber(streamname,
			plat["subber"], getattr(cbs, "on_message"))
	ws = websocket.WebSocketApp(feed, **cbs)
	ws.jsend = jsend(ws)
	ws.run_forever(dispatcher=rel)
	return ws

def echofeed(platform="gemini", streamname="ETHBTC"):
	return feed(platform, streamname,
		on_message = lambda ws, msg : print(msg),
		on_error = lambda *msg : print("error!", *msg))

def events(message):
	return json.loads(message)["events"]

def spew(event):
	print(json.dumps(event))

def start():
	rel.signal(2, rel.abort)
	rel.dispatch()

def stop():
	print("goodbye")
	rel.abort()