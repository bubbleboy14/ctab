ab.dash = {
	_: {},
	init: function() {
		ab.dash._.dash = new ab.dash.Dash(core.config.ab.dash);
	}
};

ab.dash.Dash = CT.Class({
	CLASSNAME: "ab.dash.Dash",
	load: function() {
		CT.dom.setMain([



		]);
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {

		});
		this.load();
	}
})