ab.fills = {
	_: {
		syms: ["ETH", "BTC"],
		all: ["USD", "ETH", "BTC"],
		units: {
			ETH: "mwei",
			BTC: "finney"
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
		metrics: function(metrics) {
			const _ = ab.fills._, lines = [];
			let k, v;
			if (!metrics || !Object.keys(metrics).length) return "(no metrics)";
			for (k in metrics) {
				v = metrics[k];
				if (typeof(v) == "object")
					lines.push(k + "<div class='lpadded'>" + _.metrics(v) + "</div>");
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
			return title + _.pline(f) + balances + _.metrics(f.metrics);
//			return w.globals.labels[dataPointIndex] + ": " + series[seriesIndex][dataPointIndex];
		}
	},
	build: function(fills) {
		const _ = ab.fills._, syms = _.syms;
		_.fills = fills.filter(f => Object.keys(f.balances).length);
		this.graph = new ab.apex.Graph({
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
	init: function(opts) {
		ab.popper.build("fill", ab.fills.build);
	}
};