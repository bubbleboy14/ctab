ab.fills = {
	_: {
		syms: ["ETH", "BTC"]
	},
	build: function(fills) {
		const syms = ab.fills._.syms;
		this.graph = new ab.apex.Graph({
			sym: syms.join("/"),
			name: "totals",
			type: "bar",
			items: fills,
			chartopts: {
				type: "bar",
				stacked: true
			},
			parts: syms.map(function(s) {
				return { name: s, type: "bar" };
			})
		})
	},
	init: function(opts) {
		ab.fills.opts = opts;
		CT.db.get("fill", ab.fills.build, 1000);
	}
};