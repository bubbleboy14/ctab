from rel import timeout
from rel.util import ask, listen
from mkswap.backend import setStaging, setCredSet
from mkswap.config import config as swapconfig
from mkswap import getOffice
from cantools.web import respond
from cantools.util import log
from cantools import config
from model import Fill, TPV

def filled(trade):
	fill = Fill()
	fill.metrics = config.ctab.live.office.stratuses()
	fill.balances = ask("balances", mode="actual")
	fill.client_order_id = trade["client_order_id"]
	fill.rationale = trade["rationale"]
	fill.order_id = trade["order_id"]
	fill.market = trade["symbol"]
	fill.amount = trade["amount"]
	fill.price = trade["price"]
	fill.score = trade["score"]
	fill.side = trade["side"]
	fill.fee = trade["fee"]
	fill.put()

def ticktpv():
	bals = ask("balances", mode="actual", nousd=True, nodiff=True)
	log("ticktpv()", important=True)
	if "waiting" in bals:
		print("waiting for balances")
		return True
	tpv = TPV()
	tpv.balances = bals
	tpv.prices = ask("prices", prop="average")
	print("prices", tpv.prices)
	print("balances", tpv.balances)
	val = 0
	for sym in tpv.balances:
		bal = tpv.balances[sym]
		if sym == "USD":
			val += bal
		else:
			val += bal * tpv.prices[sym + "USD"]
	tpv.total = val
	tpv.put()
	return True

def response():
	log("initializing mkswap office", important=True)
	swobj = config.ctab.obj()
	swoff = swobj["office"]
	tpvtick = int(swoff.pop("tpvtick"))
	tpvtick and timeout(tpvtick, ticktpv)
	presel = int(swoff.pop("index"))
	swobj.pop("mon")
	swapconfig.set(swobj)
	setStaging()
	setCredSet()
	config.ctab.sub("live").update("office", getOffice(presel))
	listen("orderFilled", filled)
	log("office initialized")

respond(response)