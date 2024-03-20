ab.candles = {
	_: {},
	tranCan: function(can) {
		return {
			x: new Date(can.timestamp),
			y: [can.open, can.high, can.low, can.close]
		};
	},
	update: function(data) {
		const chart = new ApexCharts(CT.dom.id("ctmain"), {
			series: [{
				name: "candle",
				type: "candlestick",
				data: data.candles.map(ab.candles.tranCan)
			}]
		});
		chart.render();
	},
	start: function() {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, this.opts.port);
		CT.pubsub.set_cb("message", this.update);
		CT.pubsub.subscribe("swapmon");
	},
	init: function(opts) {
		const abc = ab.candles;
		abc._.opts = opts = CT.merge(opts, {
			startWS: true
		});
		opts.startWS && abc.start();
	}
};