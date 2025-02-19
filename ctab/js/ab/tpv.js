ab.tpv = {
	_: {
	},
	build: function(tpvs) {
		const _ = ab.tpv._;
		this.graph = new ab.apex.Graph({
			sym: "TPV",
			items: tpvs,
			name: "total",
			height: "85%"
		});
	},
	init: function(opts) {
		const h = location.hash.slice(1),
			p = parseInt(h), c = isNaN(p) ? 100 : p;
		CT.db.get("tpv", ab.tpv.build, c, null, "-created");
	}
}