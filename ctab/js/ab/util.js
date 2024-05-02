ab.util = {
	_: {
		jump: function(url) {
			window.location = url;
		}
	},
	req: function(cb, action, params) {
		CT.net.post({
			path: "/_ab",
			params: CT.merge(params, {
				action: action || "curconf"
			}),
			cb: cb
		});
	},
	linkize: function(node, cb, href) {
		node.onclick = cb || (() => ab.util._.jump(href));
		node.classList.add("pointer");
		node.classList.add("hoverglow");
	},
	jump2graph: function(mode) {
		ab.util._.jump("/ab/candles.html#" + encodeURI(mode));
	},
	startWS: function(cb) {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, core.config.ctab.dash.port);
		CT.pubsub.set_cb("message", cb);
		CT.pubsub.subscribe("swapmon");
	}
};