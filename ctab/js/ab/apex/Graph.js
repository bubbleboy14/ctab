ab.apex.Graph = CT.Class({
	CLASSNAME: "ab.apex.Graph",
	_: {
		chart: function(series) {
			const oz = this.opts, chart = new ApexCharts(this.node, CT.merge(oz.graphopts, {
				title: {
					text: this.sym + " " + this.name
				},
				xaxis: {
					type: "datetime",
					labels: {
						format: "d MMM H:mm"
					}
				},
				chart: CT.merge(oz.chartopts, {
					type: "line",
					width: oz.width,
					height: oz.height
				}),
				series: series
			}));
			setTimeout(() => chart.render());
//			chart.render();
			return chart;
		},
		series: function(part, items, dataOnly) {
			const transer = ab.apex.trans.transer(part.name),
				dobj = { data: items.map(transer) };
			return dataOnly ? dobj : CT.merge(part, dobj, {
				type: this.opts.type
			});
		}
	},
	trans: function(items, dataOnly) {
		const opts = this.opts;
		items = items || opts.items;
		const parts = opts.parts.map(part => this._.series(part, items, dataOnly));
		return opts.terms ? parts.concat(ab.apex.trans.terms(items,
			dataOnly, typeof opts.terms == 'string' && opts.terms)) : parts;
	},
	update: function(items) {
		this.chart.appendData(this.trans(items, true));
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
		this.node = opts.node || CT.dom.id("ctmain");
		this.chart = this._.chart(this.trans());
	}
});