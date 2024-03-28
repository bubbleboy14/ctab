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
	chart: function(sym, candles) {
		const abc = ab.candles, _ = abc._, trans = abc.trans,
			cans = CT.dom.div(), stats = CT.dom.div(), vpts = CT.dom.div(),
			n = _.charts[sym] = CT.dom.div([cans, vpts, stats], "w1");
		abc.log("initializing", candles.length, sym, candles);
		abc.setLatest(sym, candles, true);
		n.build = function() {
			n.candles = _.chart(cans, sym + " candles", [{
				name: "candles",
				type: "candlestick",
				data: candles.map(trans.can)
			}].concat(trans.terms(candles)), "42%");
			n.vpt = _.chart(vpts, sym + " VPTs", [{
				name: "vpt",
				type: "line",
				data: candles.map(trans.VPT)
			}], "25%");
			n.stats = _.chart(stats, sym + " stats", [{
				name: "obv",
				type: "bar",
				data: candles.map(trans.OBV)
			}, {
				name: "ad",
				type: "line",
				data: candles.map(trans.AD)
			}], "30%");
		};
		return n;
	},
	update: function(data) {
		const abc = ab.candles, charts = abc._.charts,
			cans = data.message.candles, trans = abc.trans;
		let sym, ups;
		for (sym in cans) {
			ups = cans[sym];
			if (!ups.length) continue;
			abc.log("updating", sym, ups);
			charts[sym].candles.appendData([{
				data: ups.map(trans.can)
			}].concat(trans.terms(ups, true)));
			charts[sym].vpt.appendData([{
				data: ups.map(trans.VPT)
			}]);
			charts[sym].stats.appendData([{
				data: ups.map(trans.OBV)
			}, {
				data: ups.map(trans.AD)
			}]);
			abc.setLatest(sym, ups);
		}
	},
	build: function(cans) {
		const abc = ab.candles,
			cnodes = Object.keys(cans).map(sym => abc.chart(sym, cans[sym]));
		CT.dom.setContent(abc.opts.container, cnodes, "flex h1");
		cnodes.forEach(c => c.build());
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