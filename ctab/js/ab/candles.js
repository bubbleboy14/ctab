ab.candles = {
	tranCan: function(can) {
		return {
			x: new Date(can.timestamp),
			y: [can.open, can.high, can.low, can.close]
		};
	},
	chart: function(sym, candles) {
		const n = CT.dom.div();
		n.build = function() {
			n.chart = new ApexCharts(n, {
				xaxis: {
					type: "datetime"
				},
				chart: {
					height: 350,
					type: "line"
				},
				series: [{
					name: sym,
					type: "candlestick",
					data: candles.map(ab.candles.tranCan)
				}]
			});
			n.chart.render();
		};
		return n;
	},
	update: function(data) {
		const abc = ab.candles, cans = data.message.candles;
		if (!cans)
			return CT.dom.setMain("waiting for candles");
		const cnodes = Object.keys(cans).map(sym => abc.chart(sym, cans[sym]));
		CT.dom.setMain(cnodes);
		cnodes.forEach(c => c.build());
	},
	start: function() {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, core.config.ctab.dash.port);
		CT.pubsub.set_cb("message", ab.candles.update);
		CT.pubsub.subscribe("swapmon");
	},
	init: function(opts) {
		const abc = ab.candles;
		abc.log = CT.log.getLogger("candles");
		abc.opts = opts = CT.merge(opts, {
			startWS: true
		});
		opts.startWS && abc.start();
	}
};