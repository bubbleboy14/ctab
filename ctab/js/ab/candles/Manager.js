ab.candles.Manager = CT.Class({
	CLASSNAME: "ab.candles.Manager",
	_: {
		graphs: {},
		heights: {
			VPT: "25%",
			stats: "30%",
			candles: "42%"
		},
		graph: function(opts) {
			const _ = this._, n = opts.name;
			return new ab.candles.Graph(CT.merge(opts, {
				type: "line",
				sym: this.sym,
				node: _.graphs[n],
				height: _.heights[n],
				candles: this.candles
			}));
		}
	},
	update: function(cans) {
		const n = this.node;
		if (!cans.length) return;
		this.log("updating", this.sym, cans);
		ab.candles.latest.set(this.sym, cans);
		n.candles.update(cans);
		n.stats.update(cans);
		n.vpt.update(cans);
	},
	build: function() {
		const _ = this._, n = this.node;
		n.candles = _.graph({
			terms: true,
			name: "candles",
			type: "candlestick"
		});
		n.vpt = _.graph({
			name: "VPT"
		});
		n.stats = _.graph({
			name: "stats",
			parts: [{
				name: "OBV",
				type: "bar"
			}, "AD"]
		});
	},
	load: function() {
		const _ = this._, gz = _.graphs, cans = gz.candles = CT.dom.div(),
			stats = gz.stats = CT.dom.div(), vpts = gz.VPT = CT.dom.div();
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