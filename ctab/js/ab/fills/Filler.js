ab.fills.Filler = CT.Class({
	CLASSNAME: "ab.fills.Filler",
	_: {
		syms: ["ETH", "BTC"],
		all: ["USD", "ETH", "BTC"],
		units: {
			ETH: "x100",
			BTC: "x3000"
		},
		graph: function() {
			const _ = this._, syms = _.syms, fills = this.opts.fills;
			new ab.apex.Graph({
				sym: syms.map(s => s + " (" + _.units[s]  + ")").join(" / "),
				items: fills,
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
			const _ = this._;
			return series.map((s, i) => _.pair(_.all[i], s[index],
				_.labcol(labels[i]))).reduce((a, b) => a + b);
		},
		cluster: function(cluster, sub) {
			const _ = this._, lines = [];
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
		score: function(f) {
			const _ = this._;
			if (typeof f.score == "number")
				return _.pair("score (prospective)", f.score);
			return _.cluster(f, "score");
		},
		tooltip: function({series, seriesIndex, dataPointIndex, w}) {
			const _ = this._, gz = w.globals, tt = gz.tooltip,
				title = tt.tooltipTitle.outerHTML,
				balances = _.point(series, dataPointIndex, tt.legendLabels),
				f = this.opts.fills[dataPointIndex];
			return title + _.pline(f) + balances + _.cluster(f, "metrics") + _.score(f) + _.cluster(f, "rationale");
//			return w.globals.labels[dataPointIndex] + ": " + series[seriesIndex][dataPointIndex];
		}
	},
	build: function(fills) {
		const oz = this.opts;
		oz.fills = oz.allfills = fills.filter(this.filter.balanced);
		this._.graph();
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {
			refresher: this._.graph
		});
		this.filter = new ab.fills.Filter(opts);
		ab.popper.build("fill", this.build, this.filter.filters);
	}
});