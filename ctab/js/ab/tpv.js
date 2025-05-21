ab.tpv = {
	_: {
		bals: ["total", "usd", "eth", "btc", "adjusted"],
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
			const aprices = ab.tpv._.aprices;
			let sym, slo, uname;
			d.usdbals = {};
			d.adjusted = 0;
			for (sym in d.balances) {
				slo = sym.toLowerCase();
				d[slo] = d.balances[sym];
				if (sym == "USD")
					d.adjusted += d[slo];
				else {
					uname = sym + "USD";
					d.adjusted += d[slo] * aprices[uname];
					d[slo] *= d.prices[uname];
					d.usdbals[sym] = d[slo];
				}
			}
		},
		balbutt: function() {
			const _ = ab.tpv._, doshow = function(tindex) {
				_.aprices = _.tpvs[tindex].prices;
				_.tpvs.forEach(_.baller);
				_.gropts.parts = _.bals;
				CT.data.append(_.secs, "usdbals");
				CT.dom.clear("ctmain");
				b.remove();
				_.graph();
			}, b = CT.dom.button("show all balances", function() {
				CT.modal.choice({
					prompt: "adjust totals to which price set?",
					data: ["latest", "select"],
					cb: function(sel) {
						const tmax = _.tpvs.length - 1;
						if (sel == "latest")
							return doshow(tmax);
						CT.modal.prompt({
							prompt: "please select a snapshot",
							style: "number",
							min: 0,
							max: tmax,
							value: tmax,
							cb: doshow
						});
					}
				});
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