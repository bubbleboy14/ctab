ab.candles.Manager = CT.Class({
	CLASSNAME: "ab.candles.Manager",
	_: {
		all: ["candles", "VPT", "MACD", "stats"],
		graphs: {},
		heights: {
			VPT: "20%",
			MACD: "25%",
			stats: "25%",
			candles: "27%"
		},
		gconf: {
			candles: {
				terms: true,
				name: "candles",
				parts: [{
					name: "candles",
					type: "candlestick"
				}, "emafast", "emaslow"]
			},
			VPT: {
				name: "VPT",
				terms: "VPT"
			},
			MACD: {
				name: "MACD", // macdhist?
				parts: ["macd", "macdsig"]
			},
			stats: {
				name: "stats",
				parts: [{
					name: "OBV",
					type: "bar"
				}, "AD", "OBVslope", "ADslope"]
			}
		},
		graph: function(opts, h) {
			const _ = this._, n = opts.name;
			return new ab.apex.Graph(CT.merge(opts, {
				type: "line",
				sym: this.sym,
				node: _.graphs[n],
				items: this.candles,
				height: h || _.heights[n]
			}));
		},
		parts: function(pstr) {
			const abc = ab.candles, mode = abc.util.mode(),
				parts = [pstr, "all"].concat(pstr.split(" ")).filter(p => p != mode);
			abc.opts.jumpers && parts.unshift("jump to " + pstr);
			return parts;
		},
		plink: function(part) {
			return CT.dom.link(part, () => ab.candles.util.mode(part),
				null, "big block pointer hoverglow");
		},
		linkify: function(node) {
			const _ = this._, tnode = node.getElementsByTagName("text")[0];
			if (!tnode) {
				//this.log("waiting for label...");
				return setTimeout(_.linkify, 2000, node);
			}
			tnode.classList.add("pointer");
			CT.hover.auto(tnode, _.parts(tnode.innerHTML).map(_.plink), null, null, true);
		},
		linx: function() {
			const _ = this._, gz = _.graphs;
			for (let name of _.active)
				_.linkify(gz[name]);
		}
	},
	set: function(mode) {
		const isNone = mode == "none";
		this.log("set(" + mode + ")");
		CT.dom[isNone ? "hide" : "show"](this.node);
		if (isNone)
			mode = [];
		else if (mode == "all")
			mode = null;
		else
			mode = [mode];
		this.build(mode);
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
		const _ = this._, n = this.node, h = active && "97%";
		_.active = active || _.all;
		for (let g of _.all) {
			if (n[g]) {
				n[g].destroy();
				CT.dom.clear(_.graphs[g]);
			}
			if (_.active.includes(g))
				n[g] = _.graph(_.gconf[g], h);
		}
		_.linx();
	},
	load: function() {
		const _ = this._, gz = _.graphs, cans = gz.candles = CT.dom.div(),
			stats = gz.stats = CT.dom.div(), vpts = gz.VPT = CT.dom.div(),
			macd = gz.MACD = CT.dom.div();
		this.node = CT.dom.div([cans, vpts, macd, stats], "w1 h1");
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {

		});
		this.candles = opts.candles;
		this.sym = opts.sym;
		this.load();
	}
});