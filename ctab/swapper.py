from mkswap.base import setUnspammed
from mkswap import presets, getOffice
from mkswap.accountant import setCapped
from mkswap.backend import setStaging, setRealDie
from mkswap.office import setVerbose, setStagish
from mkswap.comptroller import setLive, setActives, setPruneLimit
from mkswap.strategy.base import setInner, setOuter, setLong, setLoud
from mkswap.harvester import setSkim, setBatch, setBottom, setBalance, setNetwork
from mkswap.strategy.slosh import setOneSwap, setVolatilityMult, setVolatilityCutoff
from mkswap.strategy.rsi import setSize, setPeriod
from cantools.web import respond
from cantools.util import log
from cantools import config

tcfg = config.ctab

def s2b(cfg, key):
	v = cfg[key]
	if v == "False":
		cfg.update(key, False)
	elif v == "True":
		cfg.update(key, True)

def s2i(cfg, key):
	cfg[key] and cfg.update(key, int(cfg[key]))

def s2f(cfg, key):
	cfg[key] and cfg.update(key, float(cfg[key]))

def prep():
	s2b(tcfg.base, "unspammed")
	s2b(tcfg.office, "verbose")
	s2b(tcfg.office, "stagish")
	s2b(tcfg.backend, "staging")
	s2b(tcfg.backend, "realdie")
	s2b(tcfg.accountant, "capped")
	s2b(tcfg.comptroller, "live")
	s2b(tcfg.harvester, "skim")
	s2b(tcfg.harvester, "balance")
	s2b(tcfg.strategy.base, "loud")
	s2b(tcfg.strategy.slosh, "oneswap")
	s2i(tcfg.comptroller, "actives")
	s2i(tcfg.strategy.slosh, "vmult")
	s2i(tcfg.strategy.base, "inner")
	s2i(tcfg.strategy.base, "outer")
	s2i(tcfg.strategy.base, "long")
	s2i(tcfg.strategy.rsi, "period")
	s2i(tcfg.strategy.rsi, "size")
	s2i(tcfg.harvester, "batch")
	s2i(tcfg.harvester, "bottom")
	s2i(tcfg.office, "index")
	s2f(tcfg.comptroller, "prunelimit")
	s2f(tcfg.strategy.slosh, "vcutoff")

def setem():
	setLive(tcfg.comptroller.live)
	setVerbose(tcfg.office.verbose)
	setStagish(tcfg.office.stagish)
	setStaging(tcfg.backend.staging)
	setRealDie(tcfg.backend.realdie)
	setCapped(tcfg.accountant.capped)
	setUnspammed(tcfg.base.unspammed)
	setSkim(tcfg.harvester.skim)
	setBatch(tcfg.harvester.batch)
	setBottom(tcfg.harvester.bottom)
	setBalance(tcfg.harvester.balance)
	setNetwork(tcfg.harvester.network)
	setActives(tcfg.comptroller.actives)
	setInner(tcfg.strategy.base.inner)
	setOuter(tcfg.strategy.base.outer)
	setLong(tcfg.strategy.base.long)
	setLoud(tcfg.strategy.base.loud)
	setSize(tcfg.strategy.rsi.size)
	setPeriod(tcfg.strategy.rsi.period)
	setPruneLimit(tcfg.comptroller.prunelimit)
	setOneSwap(tcfg.strategy.slosh.oneswap)
	setVolatilityMult(tcfg.strategy.slosh.vmult)
	setVolatilityCutoff(tcfg.strategy.slosh.vcutoff)

def response():
	log("initializing mkswap office", important=True)
	prep()
	setem()
	config.ctab.sub("live").update("office", getOffice(**presets[int(tcfg.office.index)]))
	log("office initialized")

respond(response)