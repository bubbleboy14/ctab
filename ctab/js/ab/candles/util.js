ab.candles.util = {
	_: {
		mode: "all",
		managers: {}
	},
	mode: function(mode) {
		const abc = ab.candles, _ = abc.util._, mans = _.managers,
			isMan = mode in mans, isAll = mode == "all", isDub = mode && mode.includes(" ");
		let m, man, isMode;
		if (!mode)
			return _.mode;
		if (mode.startsWith("jump to "))
			return ab.util.jump2graph(mode.slice(8));
		_.mode = mode;
		for (m in mans) {
			man = mans[m];
			if (isAll)
				man.set("all");
			else {
				isMode = mode.startsWith(m);
				if (isMan)
					man.set(isMode ? "all" : "none");
				else
					man.set((isMode || !isDub) ? mode.split(" ").pop() : "none");
			}
		}
	},
	manager: function(sym, candles) {
		const abc = ab.candles, man = abc.util._.managers[sym] = new abc.Manager({
			sym: sym,
			candles: candles
		});
		abc.latest.set(sym, candles, true);
		return man;
	},
	upman: function(sym, candles) {
		const abc = ab.candles, abcu = abc.util, managers = abcu._.managers;
		if (sym in managers)
			return managers[sym].update(candles);
		const man = managers[sym] = abcu.manager(sym, candles);
		CT.dom.addContent(abc.opts.container, man.node);
		man.build();
	},
	update: function(data) {
		const abcu = ab.candles.util, cans = data.message.candles;
		for (let sym in cans)
			abcu.upman(sym, cans[sym]);
	},
	build: function(cans) {
		const abc = ab.candles,
			cmen = Object.keys(cans).map(sym => abc.util.manager(sym, cans[sym]));
		CT.dom.setContent(abc.opts.container, cmen.map(m => m.node), "flex h1 w1");
		cmen.forEach(c => c.build());
	},
	load: function(candles) {
		const abc = ab.candles, abcu = abc.util, opts = abc.opts;
		if (candles.waiting) {
			CT.dom.setContent(opts.container, "waiting for candles (retrying in 10 seconds)");
			return setTimeout(abcu.start, 10000);
		}
		abcu.build(candles);
		opts.startWS && ab.util.startWS(abcu.update);
		opts.mode && setTimeout(abcu.mode, 1000, opts.mode);
	},
	start: function() {
		const c = CT.info.query.count;
		ab.util.req(ab.candles.util.load, "candles", c && { count: c });
	}
};