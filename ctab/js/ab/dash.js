ab.dash = {
	_: {},
	init: function() {
		ab.dash._.dash = new ab.dash.Dash(core.config.ab.dash);
	}
};

ab.dash.Dash = CT.Class({
	CLASSNAME: "ab.dash.Dash",
	build: function() {
		CT.dom.setMain([

			"[dash]"

		]);
	},
	update: function(message) {
		this.log(message);
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