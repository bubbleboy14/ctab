ab.dash = {
	_: {},
	init: function() {
		ab.dash._.dash = new ab.dash.Dash(core.config.ab.dash);
	}
};

ab.dash.Dash = CT.Class({
	CLASSNAME: "ab.dash.Dash",
	_: {
		nodes: {
			charts: CT.dom.div(),
			legend: CT.dom.div()
		},
		charts: function(data) {

		},
		leg: function(data) {
			var _ = this._;
			return Object.keys(data).map(function(d) {
				if (isNaN(data[d]))
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
		CT.dom.setMain([
			CT.dom.div("dash", "bigger"),
			this._.nodes.legend,
			this._.nodes.charts
		]);
	},
	update: function(message) {
		this.log(message);
		this._.legend(message.data);
		this._.charts(message.data);
	},
	load: function() {
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
})