ab.fills = {
	_: {
		syms: ["ETH", "BTC"],
		all: ["USD", "ETH", "BTC"],
		units: {
			ETH: "x100",
			BTC: "x3000"
		},
		reasons: ["all"],
		graph: function() {
			const _ = ab.fills._, syms = _.syms;
			new ab.apex.Graph({
				sym: syms.map(s => s + " (" + _.units[s]  + ")").join(" / "),
				items: _.fills,
				name: "totals",
				height: "85%",
				type: "bar",
				chartopts: {
					type: "bar",
					stacked: true
				},
				graphopts: {
					stroke: {
						width: 5
					},
					yaxis: [{
						opposite: true,
						seriesName: "USD",
						title: {
							text: "USD balance"
						}
					}, {
						title: {
							text: "native balances"
						}
					}],
					tooltip: {
						custom: _.tooltip
					}
				},
				parts: [{ name: "USD", type: "line" }].concat(syms.map(function(s) {
					return { name: s, type: "bar" };
				}))
			});
		},
		labcol: function(lab) {
			return lab.parentNode.firstElementChild.firstElementChild.firstElementChild.getAttribute("fill");
		},
		pline: function(f) {
			return "<div><b>" + f.side + "</b> " + f.amount + " <b>"
				+ f.market + "</b> @ <b>" + f.price + "</b></div>";
		},
		pair: function(k, v, color) {
			return "<div><span style='color: " + color + ";'>" + k + "</span> <b>" + v + "</b></div>";
		},
		point: function(series, index, labels) {
			const _ = ab.fills._;
			return series.map((s, i) => _.pair(_.all[i], s[index],
				_.labcol(labels[i]))).reduce((a, b) => a + b);
		},
		cluster: function(cluster, sub) {
			const _ = ab.fills._, lines = [];
			let k, v;
			cluster = cluster[sub];
			if (!cluster || !Object.keys(cluster).length) return "(no " + sub + ")";
			for (k in cluster) {
				v = cluster[k];
				if (typeof(v) == "object")
					lines.push(k + "<div class='lpadded'>" + _.cluster(cluster, k) + "</div>");
				else
					lines.push(_.pair(k, v));
			}
			return lines.join("");
		},
		tooltip: function({series, seriesIndex, dataPointIndex, w}) {
			const _ = ab.fills._, gz = w.globals, tt = gz.tooltip,
				title = tt.tooltipTitle.outerHTML,
				balances = _.point(series, dataPointIndex, tt.legendLabels),
				f = _.fills[dataPointIndex];
			return title + _.pline(f) + balances + _.cluster(f, "metrics") + _.cluster(f, "rationale");
//			return w.globals.labels[dataPointIndex] + ": " + series[seriesIndex][dataPointIndex];
		},
		filt: function(f) {
			const reason = f.rationale && f.rationale.reason;
			reason && CT.data.append(ab.fills._.reasons, reason);
			if ("waiting" in f.balances || !Object.keys(f.balances).length)
				return CT.log("skipping fill with no balances");
			return true;
		},
		ratbutt: function() {
			const _ = ab.fills._;
			return CT.dom.button("reason filter", function() {
				CT.modal.choice({
					prompt: "which reason?",
					data: _.reasons,
					cb: function(sel) {
						_.fills = _.allfills;
						if (sel != "all")
							_.fills = _.fills.filter(f => f.rationale && f.rationale.reason == sel);
						CT.dom.clear("ctmain");
						_.graph();
					}
				});
			});
		}
	},
	build: function(fills) {
		const _ = ab.fills._;
		_.fills = _.allfills = fills.filter(_.filt);
		_.graph();
	},
	init: function(opts) {
		const af = ab.fills;
		ab.popper.build("fill", af.build, af._.ratbutt);
	}
};