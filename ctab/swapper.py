from mkswap.base import setUnspammed
from mkswap import presets, getOffice
from mkswap.backend import setStaging
from mkswap.office import setVerbose, setStagish
from mkswap.comptroller import setLive, setActives
from mkswap.strategy.base import setInner, setOuter, setLoud
from mkswap.harvester import setBatch, setBalance, setNetwork
from mkswap.strategy.slosh import setVolatilityMult
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

def prep():
	s2b(tcfg.base, "unspammed")
	s2b(tcfg.office, "verbose")
	s2b(tcfg.office, "stagish")
	s2b(tcfg.backend, "staging")
	s2b(tcfg.comptroller, "live")
	s2b(tcfg.harvester, "balance")
	s2b(tcfg.strategy.base, "loud")
	s2i(tcfg.comptroller, "actives")
	s2i(tcfg.strategy.slosh, "vmult")
	s2i(tcfg.strategy.base, "inner")
	s2i(tcfg.strategy.base, "outer")
	s2i(tcfg.strategy.rsi, "period")
	s2i(tcfg.strategy.rsi, "size")
	s2i(tcfg.harvester, "batch")
	s2i(tcfg.office, "index")

def setem():
	setLive(tcfg.comptroller.live)
	setVerbose(tcfg.office.verbose)
	setStagish(tcfg.office.stagish)
	setStaging(tcfg.backend.staging)
	setUnspammed(tcfg.base.unspammed)
	setBatch(tcfg.harvester.batch)
	setBalance(tcfg.harvester.balance)
	setNetwork(tcfg.harvester.network)
	setActives(tcfg.comptroller.actives)
	setLoud(tcfg.strategy.base.loud)
	setInner(tcfg.strategy.base.inner)
	setOuter(tcfg.strategy.base.outer)
	setPeriod(tcfg.strategy.rsi.period)
	setSize(tcfg.strategy.rsi.size)
	setVolatilityMult(tcfg.strategy.slosh.vmult)

def response():
	log("initializing mkswap office", important=True)
	prep()
	setem()
	config.update("office", getOffice(**presets[int(tcfg.office.index)]))
	log("office initialized")

respond(response)