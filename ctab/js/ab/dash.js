ab.dash = {
	_: {},
	init: function() {
		ab.dash._.dash = new ab.dash.Dash(core.config.ctab.dash);
	}
};

ab.dash.Dash = CT.Class({
	CLASSNAME: "ab.dash.Dash",
	_: {
		data: {},
		nodes: {},
		chart2: ["diff", "dph"],
		charts: function() {
			var _ = this._;
			new Chartist.Line(_.nodes.chart1, {
				series: Object.keys(_.data).filter(k => !_.chart2.includes(k)).map(k => _.data[k])
			});
			new Chartist.Line(_.nodes.chart2, {
				series: _.chart2.map(k => _.data[k])
			});
		},
		counts: function(d) {
			return CT.dom.div("orders: " + d.approved + " approved; " + d.filled
				+ " filled; " + d.cancelled + " cancelled", "up20 right");
		},
		leg: function(data, colored) {
			if (!data) return "0";
			var _ = this._, labs = [], lab, n = CT.dom.flex(Object.keys(data).map(function(d) {
				if (typeof data[d] == "object") {
					return CT.dom.div([
						CT.dom.div(d, "centered"),
						_.leg(data[d])
					], "w1");
				}
				lab = CT.dom.span(d, "bold");
				labs.push(lab);
				return CT.dom.div([lab, CT.dom.pad(), CT.dom.span(data[d])], "p1");
			}), "bordered row jcbetween");
			colored && CT.dom.className("ct-line", _.nodes.charts).forEach(function(n, i) {
				labs[i].style.color
					= window.getComputedStyle(n).getPropertyValue("stroke");
			});
			return n;
		},
		legend: function(data) {
			var _ = this._;
			CT.dom.setContent(_.nodes.legend, [
				_.counts(data.counts),
				_.leg(data.balances, true),
				_.leg(data.strategists)
			]);
		},
		up: function(upd) {
			var k, v, d = this._.data;
			for (k in upd) {
				if (!d[k])
					d[k] = [];
				v = upd[k];
				if (isNaN(v))
					v = parseFloat(v.slice(0, -1).split(" ($").pop());
				d[k].push(v);
				d[k] = d[k].slice(-10);
			}
		}
	},
	build: function() {
		var nz = this._.nodes;
		nz.legend = CT.dom.div();
		nz.chart1 = CT.dom.div(null, "w1-2");
		nz.chart2 = CT.dom.div(null, "w1-2");
		nz.charts = CT.dom.flex([nz.chart1, nz.chart2]);
		nz.charts.style.height = "calc(100vh - 220px)";
		CT.dom.setMain([
			nz.charts,
			nz.legend
		]);
	},
	update: function(data) {
		this.log(data);
		this._.up(data.message.balances);
		this._.charts();
		this._.legend(data.message);
	},
	load: function() {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, this.opts.port);
		CT.pubsub.set_cb("message", this.update);
		CT.pubsub.subscribe("swapmon");
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {

		});
		this.load();
		this.build();
	}
});