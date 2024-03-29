ab.candles = {
	_: {
		charts: {},
		latest: {},
		lasters: ["ad", "obv", "vpt"],
		terms: ["small", "medium", "large"],
		gnode: function(can, stats) {
			return {
				x: new Date(can.timestamp),
				y: stats.map(s => can[s])
			};
		},
		term: function(candles, term, dataOnly) {
			const gnode = ab.candles._.gnode, d = {
				data: candles.map(c => gnode(c, [term]))
			};
			if (!dataOnly) {
				d.name = term;
				d.type = "line";
			}
			return d;
		}
	},
	trans: {
		can: function(can) {
			return ab.candles._.gnode(can, ["open", "high", "low", "close"]);
		},
		AD: function(can) {
			return ab.candles._.gnode(can, ["ad"]);
		},
		OBV: function(can) {
			return ab.candles._.gnode(can, ["obv"]);
		},
		VPT: function(can) {
			return ab.candles._.gnode(can, ["vpt"]);
		},
		terms: function(candles, dataOnly) {
			const _ = ab.candles._;
			return _.terms.map(term => _.term(candles, term, dataOnly));
		}
	},
	latest: function(sym, stat) {
		const latest = ab.candles._.latest;
		return latest[sym] && latest[sym][stat];
	},
	setLatest: function(sym, cans, isFirst) {
		const _ = ab.candles._, last = cans[cans.length - 1];
		if (isFirst)
			_.latest[sym] = {};
		for (let laster of _.lasters)
			_.latest[sym][laster] = last[laster];
	},
	manager: function(sym, candles) {
		const abc = ab.candles, man = abc._.charts[sym] = new abc.Manager({
			sym: sym,
			candles: candles
		});
		abc.setLatest(sym, candles, true);
		return man;
	},
	update: function(data) {
		const charts = ab.candles._.charts, cans = data.message.candles;
		for (let sym in cans)
			charts[sym].update(cans[sym]);
	},
	build: function(cans) {
		const abc = ab.candles,
			cmen = Object.keys(cans).map(sym => abc.manager(sym, cans[sym]));
		CT.dom.setContent(abc.opts.container, cmen.map(m => m.node), "flex h1");
		cmen.forEach(c => c.build());
	},
	load: function(candles) {
		const abc = ab.candles;
		if (candles.waiting) {
			CT.dom.setContent(abc.opts.container, "waiting for candles (retrying in 10 seconds)");
			return setTimeout(abc.start, 10000);
		}
		abc.build(candles);
		abc.opts.startWS && ab.util.startWS(abc.update);
	},
	start: function() {
		ab.util.req(ab.candles.load, "candles");
	},
	init: function(opts) {
		const abc = ab.candles;
		abc.log = CT.log.getLogger("candles");
		abc.opts = opts = CT.merge(opts, {
			startWS: true,
			container: "ctmain"
		});
		abc.start();
	}
};

ab.candles.Manager = CT.Class({
	CLASSNAME: "ab.candles.Manager",
	_: {
		charts: {},
		chart: function(node, name, series, height) {
			const chart = new ApexCharts(node, {
				title: {
					text: name
				},
				xaxis: {
					type: "datetime"
				},
				chart: {
					type: "line",
					height: height
				},
				series: series
			});
			chart.render();
			return chart;
		}
	},
	update: function(cans) {
		const abc = ab.candles, trans = abc.trans, n = this.node;
		if (!cans.length) return;
		this.log("updating", this.sym, cans);
		n.candles.appendData([{
			data: cans.map(trans.can)
		}].concat(trans.terms(cans, true)));
		n.vpt.appendData([{
			data: cans.map(trans.VPT)
		}]);
		n.stats.appendData([{
			data: cans.map(trans.OBV)
		}, {
			data: cans.map(trans.AD)
		}]);
		abc.setLatest(this.sym, cans);
	},
	build: function() {
		const _ = this._, cz = _.charts, trans = ab.candles.trans,
			n = this.node, sym = this.sym, candles = this.candles;
		n.candles = _.chart(cz.cans, sym + " candles", [{
			name: "candles",
			type: "candlestick",
			data: candles.map(trans.can)
		}].concat(trans.terms(candles)), "42%");
		n.vpt = _.chart(cz.vpts, sym + " VPTs", [{
			name: "vpt",
			type: "line",
			data: candles.map(trans.VPT)
		}], "25%");
		n.stats = _.chart(cz.stats, sym + " stats", [{
			name: "obv",
			type: "bar",
			data: candles.map(trans.OBV)
		}, {
			name: "ad",
			type: "line",
			data: candles.map(trans.AD)
		}], "30%");
	},
	load: function() {
		const _ = this._, cz = _.charts, cans = cz.cans = CT.dom.div(),
			stats = cz.stats = CT.dom.div(), vpts = cz.vpts = CT.dom.div();
		this.node = CT.dom.div([cans, vpts, stats], "w1");
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {

		});
		this.candles = opts.candles;
		this.sym = opts.sym;
		this.load();
	}
});

ab.candles.Graph = CT.Class({
	CLASSNAME: "ab.candles.Graph",
	_: {},
	init: function(opts) {

	}
});