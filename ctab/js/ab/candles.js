ab.candles = {
	_: {
		charts: {},
		latest: {},
		lasters: ["ad", "obv"],
		gnode: function(can, stats) {
			return {
				x: new Date(can.timestamp),
				y: stats.map(s => can[s])
			};
		}
	},
	tranCan: function(can) {
		return ab.candles._.gnode(can, ["open", "high", "low", "close"]);
	},
	tranAD: function(can) {
		return ab.candles._.gnode(can, ["ad"]);
	},
	tranOBV: function(can) {
		return ab.candles._.gnode(can, ["obv"]);
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
		const abc = ab.candles, _ = abc._, cans = CT.dom.div(), stats = CT.dom.div(),
			n = _.charts[sym] = CT.dom.div([cans, stats], "w1"), h = abc.opts.height;
		abc.log("initializing", candles.length, sym, candles);
		abc.setLatest(sym, candles, true);
		n.build = function() {
			n.candles = new ApexCharts(cans, {
				title: {
					text: sym + " candles"
				},
				xaxis: {
					type: "datetime"
				},
				chart: {
					height: h,
					type: "line"
				},
				series: [{
					name: sym,
					type: "candlestick",
					data: candles.map(abc.tranCan)
				}]
			});
			n.stats = new ApexCharts(stats, {
				title: {
					text: sym + " stats"
				},
				xaxis: {
					type: "datetime"
				},
				chart: {
					height: h,
					type: "line"
				},
				series: [{
					name: "obv",
					type: "bar",
					data: candles.map(abc.tranOBV)
				}, {
					name: "ad",
					type: "line",
					data: candles.map(abc.tranAD)
				}]
			});
			n.candles.render();
			n.stats.render();
		};
		return n;
	},
	update: function(data) {
		const abc = ab.candles, charts = abc._.charts, cans = data.message.candles;
		let sym, ups;
		for (sym in cans) {
			ups = cans[sym];
			if (!ups.length) continue;
			abc.log("updating", sym, ups);
			charts[sym].candles.appendData([{
				data: ups.map(abc.tranCan)
			}]);
			charts[sym].stats.appendData([{
				data: ups.map(abc.tranOBV)
			}, {
				data: ups.map(abc.tranAD)
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
			height: 350,
			startWS: true,
			container: "ctmain"
		});
		abc.start();
	}
};