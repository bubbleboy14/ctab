ab.candles.Graph = CT.Class({
	CLASSNAME: "ab.candles.Graph",
	_: {
		chart: function(series) {
			const oz = this.opts, chart = new ApexCharts(this.node, {
				title: {
					text: this.sym + " " + this.name
				},
				xaxis: {
					type: "datetime"
				},
				chart: {
					type: "line",
					width: oz.width,
					height: oz.height
				},
				series: series
			});
			setTimeout(() => chart.render());
//			chart.render();
			return chart;
		},
		series: function(part, cans, dataOnly) {
			const dobj = { data: cans.map(ab.candles.trans[part.name]) };
			return dataOnly ? dobj : CT.merge(part, dobj, {
				type: this.opts.type
			});
		}
	},
	trans: function(cans, dataOnly) {
		const opts = this.opts;
		cans = cans || opts.candles;
		const parts = opts.parts.map(part => this._.series(part, cans, dataOnly));
		return opts.terms ? parts.concat(ab.candles.trans.terms(cans, dataOnly)) : parts;
	},
	update: function(cans) {
		this.chart.appendData(this.trans(cans, true));
	},
	setParts: function(parts) {
		parts = this.opts.parts = parts || this.opts.parts;
		for (let i = 0; i < parts.length; i++)
			if (!parts[i].name)
				parts[i] = { name: parts[i], type: "line" };
	},
	destroy: function() {
		this.chart.destroy();
	},
	init: function(opts) {
		opts.type = opts.type || "line";
		this.opts = opts = CT.merge(opts, {
			width: "100%",
			height: "100%",
			parts: [{ name: opts.name, type: opts.type }]
		});
		this.setParts();
		this.sym = opts.sym;
		this.name = opts.name;
		this.node = opts.node;
		this.chart = this._.chart(this.trans());
	}
});