ab.candles = {
	_: {
		charts: {},
		latest: {},
		lasters: ["ad", "obv", "vpt"],
		spans: ["inner", "short", "long", "outer"],
		gnode: function(can, stats) {
			return {
				x: new Date(can.timestamp),
				y: stats.map(s => can[s])
			};
		},
		chart: function(node, name, series) {
			const chart = new ApexCharts(node, {
				title: {
					text: name
				},
				xaxis: {
					type: "datetime"
				},
				chart: {
					type: "line",
					height: ab.candles.opts.height
				},
				series: series
			});
			chart.render();
			return chart;
		},
		span: function(candles, span, dataOnly) {
			const gnode = ab.candles._.gnode, d = {
				data: candles.map(c => gnode(c, [span]))
			};
			if (!dataOnly) {
				d.name = span;
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
		spans: function(candles, dataOnly) {
			const _ = ab.candles._;
			return _.spans.map(span => _.span(candles, span, dataOnly));
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
			}].concat(trans.spans(candles)));
			n.vpt = _.chart(vpts, sym + " VPTs", [{
				name: "vpt",
				type: "line",
				data: candles.map(trans.VPT)
			}]);
			n.stats = _.chart(stats, sym + " stats", [{
				name: "obv",
				type: "bar",
				data: candles.map(trans.OBV)
			}, {
				name: "ad",
				type: "line",
				data: candles.map(trans.AD)
			}]);
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
			}].concat(trans.spans(ups, true)));
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
		CT.dom.setContent(abc.opts.container, cnodes, "flex");
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
			height: 250,
			startWS: true,
			container: "ctmain"
		});
		abc.start();
	}
};