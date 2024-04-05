ab.apex.trans = {
	_: {
		terms: ["small", "medium", "large"],
		gnode: function(can, stats) {
			return {
				x: new Date(can.timestamp),
				y: stats.map(s => can[s])
			};
		},
		term: function(candles, term, dataOnly) {
			const gnode = ab.apex.trans._.gnode, d = {
				data: candles.map(c => gnode(c, [term]))
			};
			if (!dataOnly) {
				d.name = term;
				d.type = "line";
			}
			return d;
		}
	},
	candles: function(can) {
		return ab.apex.trans._.gnode(can, ["open", "high", "low", "close"]);
	},
	AD: function(can) {
		return ab.apex.trans._.gnode(can, ["ad"]);
	},
	OBV: function(can) {
		return ab.apex.trans._.gnode(can, ["obv"]);
	},
	VPT: function(can) {
		return ab.apex.trans._.gnode(can, ["vpt"]);
	},
	terms: function(candles, dataOnly) {
		const _ = ab.apex.trans._;
		return _.terms.map(term => _.term(candles, term, dataOnly));
	}
};