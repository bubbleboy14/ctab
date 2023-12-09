import rel
from cantools import config, pubsub
from cantools.util import log
from cantools.web import fetch

wcfg = config.web

class SwapMon(pubsub.Bot):
	def __init__(self, server, channel, name="SwapMon"): # only one SwapMon..
		pubsub.Bot.__init__(self, server, channel, name)
		rel.timeout(config.ctab.mon.interval, self._tick)
		log("SwapMon initialized!")

	def _tick(self):
		log("SwapMon tick!")
		data = fetch(wcfg.host, "/_ab", wcfg.port, protocol=wcfg.protocol, ctjson=True)
		log(data)
		self.pub(data)