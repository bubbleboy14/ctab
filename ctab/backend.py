import rel, json, websocket

from dydx3 import Client
from dydx3.helpers.request_helpers import generate_now_iso
from dydx3.constants import API_HOST_GOERLI, NETWORK_ID_GOERLI, WS_HOST_GOERLI

def log(*msg):
	print(*msg)

LOUD = True

def crsub(streamname):
	return {
		"name": "SubscribeTicker",
		"data": streamname
	}

def ddsub(streamname):
	print("opened - sending sub block")
	now = generate_now_iso()
	dclient = Client(
		network_id=NETWORK_ID_GOERLI,
		host=API_HOST_GOERLI
	)
	sig = dclient.private.sign(
		request_path='/ws/accounts',
		method='GET',
		iso_timestamp=now,
		data={}
	)
	return {
		"type": "subscribe",
		"channel": "v3_accounts",
		"accountNumber": '0',
		"market": streamname,
		"timestamp": now,
		"signature": sig
	}

def subber(streamname, submaker, doafter=None):
	def _subber(ws):
		ws.jsend(submaker(streamname))
		doafter and doafter()
	return _subber

def jsend(ws):
	def _jsend(jmsg):
		msg = json.dumps(jmsg)
		LOUD and log("sending:", msg)
		ws.send(msg)
	return _jsend

platforms = {
	"dydx": {
		"feed": WS_HOST_GOERLI,
		"subber": ddsub
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
	echofeed("dydx", "ETH-BTC")
	start()

def events(message):
	return json.loads(message)["events"]

def spew(event):
	log(json.dumps(event))

def start():
	rel.signal(2, rel.abort)
	rel.dispatch()

def stop():
	log("goodbye")
	rel.abort()