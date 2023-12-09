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
		charts: function(data) {
			var _ = this._;
			new Chartist.Line(_.nodes.charts, {
				series: Object.values(_.data)
			});
		},
		leg: function(data) {
			var _ = this._;
			return CT.dom.flex(Object.keys(data).map(function(d) {
				if (typeof data[d] == "object")
					return [d, _.leg(data[d])];
				return "<b>" + d + "</b>: " + data[d];
			}), "bordered row");
		},
		legend: function(data) {
			var _ = this._;
			CT.dom.setContent(_.nodes.legend, [
				_.leg(data.balances),
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
				d[k].push(v)
			}
		}
	},
	build: function() {
		var nz = this._.nodes;
		nz.charts = CT.dom.div();
		nz.legend = CT.dom.div();
		CT.dom.setMain([
			nz.charts,
			nz.legend
		]);
	},
	update: function(data) {
		this.log(data);
		this._.up(data.message.balances);
		this._.legend(data.message);
		this._.charts(data.message);
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