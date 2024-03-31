ab.candles.Manager = CT.Class({
	CLASSNAME: "ab.candles.Manager",
	_: {
		all: ["candles", "VPT", "stats"],
		graphs: {},
		heights: {
			VPT: "25%",
			stats: "30%",
			candles: "42%"
		},
		gconf: {
			candles: {
				terms: true,
				name: "candles",
				type: "candlestick"
			},
			VPT: {
				name: "VPT"
			},
			stats: {
				name: "stats",
				parts: [{
					name: "OBV",
					type: "bar"
				}, "AD"]
			}
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
		},
		plink: function(part) {
			return CT.dom.link(part, () => ab.candles.util.mode(part),
				null, "big block pointer hoverglow");
		},
		linkify: function(node) {
			const tnode = node.getElementsByTagName("text")[0],
				parts = tnode.innerHTML.split(" ");
			tnode.classList.add("pointer");
			CT.hover.auto(tnode, parts.map(this._.plink), null, null, true);
		},
		linx: function() {
			const _ = this._, gz = _.graphs;
			for (let name of _.active)
				_.linkify(gz[name]);
		}
	},
	set: function(mode) {
		this.log("set(" + mode + ")");

	},
	update: function(cans) {
		const _ = this._, n = this.node;
		if (!cans.length) return;
		this.candles = this.candles.concat(cans);
		ab.candles.latest.set(this.sym, cans);
		this.log("updating", this.sym, cans);
		for (let name of _.active)
			n[name].update(cans);
		_.linx();
	},
	build: function(active) {
		const _ = this._, n = this.node;
		_.active = active || _.all;
		for (let g of _.active)
			n[g] = _.graph(_.gconf[g]);
		_.linx();
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