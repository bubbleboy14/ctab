import rel
from cantools import config, pubsub
from cantools.util import log
from cantools.web import fetch

wcfg = config.web

class SwapMon(pubsub.Bob):
	def __init__(self, server, channel, name="SwapMon"): # only one SwapMon..
		pubsub.Bot.__init__(self, server, channel, name)
		rel.timeout(config.ctab.mon.interval, self._tick)

	def _tick(self):
		data = fetch(wcfg.host, "/_ab", wcfg.port, True, protocol=wcfg.protocol)
		log(data)
		self.pub(data)