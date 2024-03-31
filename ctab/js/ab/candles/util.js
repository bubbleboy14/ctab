ab.candles.util = {
	_: {
		managers: {}
	},
	manager: function(sym, candles) {
		const abc = ab.candles, man = abc.util._.managers[sym] = new abc.Manager({
			sym: sym,
			candles: candles
		});
		abc.latest.set(sym, candles, true);
		return man;
	},
	update: function(data) {
		const managers = ab.candles.util._.managers, cans = data.message.candles;
		for (let sym in cans)
			managers[sym].update(cans[sym]);
	},
	build: function(cans) {
		const abc = ab.candles,
			cmen = Object.keys(cans).map(sym => abc.util.manager(sym, cans[sym]));
		CT.dom.setContent(abc.opts.container, cmen.map(m => m.node), "flex h1 w1");
		cmen.forEach(c => c.build());
	},
	load: function(candles) {
		const abc = ab.candles;
		if (candles.waiting) {
			CT.dom.setContent(abc.opts.container, "waiting for candles (retrying in 10 seconds)");
			return setTimeout(abc.util.start, 10000);
		}
		abc.util.build(candles);
		abc.opts.startWS && ab.util.startWS(abc.util.update);
	},
	start: function() {
		ab.util.req(ab.candles.util.load, "candles");
	}
};