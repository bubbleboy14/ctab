ab.fills = {
	_: {
		syms: ["ETH", "BTC"],
		all: ["USD", "ETH", "BTC"],
		units: {
			ETH: "mwei",
			BTC: "finney"
		},
		pair: function(k, v, color) {
			return "<div><span style='color: " + color + ";'>" + k + "</span> <b>" + v + "</b></div>";
		},
		point: function(series, index, labels) {
			const _ = ab.fills._;
			return series.map((s, i) => _.pair(_.all[i], s[index],
				labels[i].previousElementSibling.style.color)).reduce((a, b) => a + b);
		},
		tooltip: function({series, seriesIndex, dataPointIndex, w}) {
			const _ = ab.fills._, gz = w.globals, tt = gz.tooltip,
				title = tt.tooltipTitle.outerHTML,
				body = _.point(series, dataPointIndex, tt.legendLabels),
				f = _.fills[dataPointIndex];
			return title + body + f.side + " " + f.amount + " " + f.market + " @ " + f.price;
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
		})
	},
	init: function(opts) {
		CT.db.get("fill", ab.fills.build, 1000);
	}
};