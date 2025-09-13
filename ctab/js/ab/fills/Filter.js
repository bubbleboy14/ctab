ab.fills.Filter = CT.Class({
	CLASSNAME: "ab.fills.Filter",
	_: {
		reasons: ["all"],
		ratbutt: function() {
			const _ = this._, oz = this.opts;
			return CT.dom.button("reason filter", function() {
				CT.modal.choice({
					prompt: "which reason?",
					data: _.reasons,
					cb: function(sel) {
						oz.fills = oz.allfills;
						if (sel != "all")
							oz.fills = oz.fills.filter(f => f.rationale && f.rationale.reason == sel);
						CT.dom.clear("ctmain");
						oz.refresher();
					}
				});
			});
		}
	},
	balanced: function(f) {
		const reason = f.rationale && f.rationale.reason;
		reason && CT.data.append(this._.reasons, reason);
		if ("waiting" in f.balances || !Object.keys(f.balances).length)
			return CT.log("skipping fill with no balances");
		return true;
	},
	filters: function() {
		return this._.ratbutt();
	},
	init: function(opts) {
		this.opts = opts;
	}
});