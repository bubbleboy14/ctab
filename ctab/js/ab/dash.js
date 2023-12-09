ab.dash = {
	_: {},
	init: function() {
		ab.dash._.dash = new ab.dash.Dash(core.config.ctab.dash);
	}
};

ab.dash.Dash = CT.Class({
	CLASSNAME: "ab.dash.Dash",
	_: {
		nodes: {},
		charts: function(data) {

		},
		leg: function(data) {
			var _ = this._;
			return Object.keys(data).map(function(d) {
				if (typeof data[d] == "object")
					return [d, _.leg(data[d])];
				return d + ": " + data[d];
			});
		},
		legend: function(data) {
			var _ = this._;
			CT.dom.setContent(_.nodes.legend, [
				CT.dom.div("legend", "big"),
				_.leg(data)
			]);
		}
	},
	build: function() {
		var nz = this._.nodes;
		nz.charts = CT.dom.div();
		nz.legend = CT.dom.div();
		CT.dom.setMain([
			CT.dom.div("dash", "bigger"),
			nz.legend,
			nz.charts
		]);
	},
	update: function(data) {
		this.log(data);
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