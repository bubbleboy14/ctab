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
		abc.latest.set(this.sym, cans);
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