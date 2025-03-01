ab.tpv = {
	_: {
		bals: ["total", "usd", "eth", "btc"],
		secs: ["prices", "balances"],
		gropts: {
			sym: "TPV",
			name: "total",
			height: "85%"
		},
		graph: function() {
			const _ = ab.tpv._;
			new ab.apex.Graph(CT.merge({
				items: _.tpvs,
				graphopts: {
					tooltip: {
						custom: _.tooltip
					}
				}
			}, _.gropts));
		},
		baller: function(d) {
			let sym, slo;
			d.usdbals = {};
			for (sym in d.balances) {
				slo = sym.toLowerCase();
				d[slo] = d.balances[sym];
				if (sym != "USD") {
					d[slo] *= d.prices[sym + "USD"];
					d.usdbals[sym] = d[slo];
				}
			}
		},
		balbutt: function() {
			const _ = ab.tpv._, b = CT.dom.button("show all balances", function() {
				_.tpvs.forEach(_.baller);
				_.gropts.parts = _.bals;
				_.secs.push("usdbals");
				CT.dom.clear("ctmain");
				b.remove();
				_.graph();
			});
			return b;
		},
		kvblock: function(obj, key) {
			const lines = [key + ":"], d = obj[key];
			for (let k in d)
				lines.push("<span>" + k + ": <b>" + d[k] + "</b></span>");
			return lines.join("");
		},
		dstring: function(d) {
			const _ = ab.tpv._;
			return _.secs.map(s => _.kvblock(d, s)).concat(["total: " + d.total]).join("<br>");
		},
		tooltip: function({series, seriesIndex, dataPointIndex, w}) {
			const _ = ab.tpv._, ttt = w.globals.tooltip.tooltipTitle;
			return ttt.outerHTML + _.dstring(_.tpvs[dataPointIndex]);
		}
	},
	build: function(tpvs) {
		const _ = ab.tpv._;
		_.tpvs = tpvs;
		_.graph();
	},
	init: function(opts) {
		ab.popper.build("tpv", ab.tpv.build, ab.tpv._.balbutt());
	}
}