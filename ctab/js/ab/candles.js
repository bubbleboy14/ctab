ab.candles = {
	_: {
		charts: {}
	},
	tranCan: function(can) {
		return {
			x: new Date(can.timestamp),
			y: [can.open, can.high, can.low, can.close]
		};
	},
	tranCanOBV: function(can) {
		return {
			x: new Date(can.timestamp),
			y: [can.obv]
		};
	},
	chart: function(sym, candles) {
		const abc = ab.candles, cans = CT.dom.div(), obvs = CT.dom.div(),
			n = abc._.charts[sym] = CT.dom.div([cans, obvs], "w1");
		abc.log("initializing", candles.length, sym, candles);
		n.build = function() {
			n.candles = new ApexCharts(cans, {
				title: {
					text: sym + " candles"
				},
				xaxis: {
					type: "datetime"
				},
				chart: {
					height: 350,
					type: "line",
					animations: {
						enabled: false
					}
				},
				series: [{
					name: sym,
					type: "candlestick",
					data: candles.map(abc.tranCan)
				}]
			});
			n.obvs = new ApexCharts(obvs, {
				title: {
					text: sym + " OBVs"
				},
				xaxis: {
					type: "datetime"
				},
				chart: {
					height: 350,
					type: "bar",
					animations: {
						enabled: false
					}
				},
				series: [{
					name: sym,
					type: "bar",
					data: candles.map(abc.tranCanOBV)
				}]
			});
			n.candles.render();
			n.obvs.render();
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
			charts[sym].obvs.appendData([{
				data: ups.map(abc.tranCanOBV)
			}]);
		}
	},
	build: function(cans) {
		const cnodes = Object.keys(cans).map(sym => ab.candles.chart(sym, cans[sym]));
		CT.dom.setMain(cnodes, "flex");
		cnodes.forEach(c => c.build());
	},
	load: function(candles) {
		const abc = ab.candles;
		if (candles.waiting) {
			CT.dom.setMain("waiting for candles (retrying in 10 seconds)");
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
			startWS: true
		});
		abc.start();
	}
};