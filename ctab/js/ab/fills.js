ab.fills = {
	_: {
		syms: ["ETH", "BTC"],
		units: {
			ETH: "mwei",
			BTC: "finney"
		}
	},
	build: function(fills) {
		const _ = ab.fills._, syms = _.syms;
		this.graph = new ab.apex.Graph({
			sym: syms.map(s => s + " (" + _.units[s]  + ")").join(" / "),
			items: fills.filter(f => Object.keys(f.balances).length),
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
				}]
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