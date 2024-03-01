import rel
from cantools import config, pubsub
from cantools.util import log
from cantools.web import fetch

wcfg = config.web
mcfg = config.ctab.mon
for ikey in ["interval", "timeout"]:
	if type(mcfg[ikey]) is not int:
		mcfg.update(ikey, int(mcfg[ikey]))

class SwapMon(pubsub.Bot):
	def __init__(self, server, channel, name="SwapMon"): # only one SwapMon..
		pubsub.Bot.__init__(self, server, channel, name)
		rel.timeout(mcfg.interval, self._tick)

	def _tick(self):
		try:
			data = fetch(wcfg.host, "/_ab", wcfg.port, timeout=mcfg.timeout, protocol=wcfg.protocol, ctjson=True)
		except:
			log("fetch failed!")
			return True
		log(data)
		self.pub(data)
		return True