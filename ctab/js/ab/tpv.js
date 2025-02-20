ab.tpv = {
	_: {
		kvblock: function(obj, key) {
			const lines = [key + ":"], d = obj[key];
			for (let k in d)
				lines.push("<span>" + k + ": <b>" + d[k] + "</b></span>");
			return lines.join("") + "<br>";
		},
		dstring: function(d) {
			const _ = ab.tpv._;
			return _.kvblock(d, "prices") + _.kvblock(d, "balances") + "total: " + d.total;
		},
		tooltip: function({series, seriesIndex, dataPointIndex, w}) {
			const _ = ab.tpv._, ttt = w.globals.tooltip.tooltipTitle;
			return ttt.outerHTML + _.dstring(_.tpvs[dataPointIndex]);
		}
	},
	build: function(tpvs) {
		const _ = ab.tpv._;
		_.tpvs = tpvs;
		this.graph = new ab.apex.Graph({
			sym: "TPV",
			items: tpvs,
			name: "total",
			height: "85%",
			graphopts: {
				tooltip: {
					custom: _.tooltip
				}
			}
		});
	},
	init: function(opts) {
		ab.popper.build("tpv", ab.tpv.build);
	}
}