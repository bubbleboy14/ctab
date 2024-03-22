ab.util = {
	req: function(cb, action, params) {
		CT.net.post({
			path: "/_ab",
			params: CT.merge(params, {
				action: action || "curconf"
			}),
			cb: cb
		});
	},
	startWS: function(cb) {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, core.config.ctab.dash.port);
		CT.pubsub.set_cb("message", cb);
		CT.pubsub.subscribe("swapmon");
	}
};