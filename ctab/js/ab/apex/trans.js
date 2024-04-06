ab.apex.trans = {
	_: {
		terms: ["small", "medium", "large"],
		stamped: function(item, y) {
			return {
				x: new Date(item.timestamp || item.created.slice(0, -3)),
				y: y
			};
		},
		bal: function(fill, sym, mult) {
			return ab.apex.trans._.stamped(fill,
				(mult || 1) * parseFloat(fill.balances[sym].split(" ").shift()));
		},
		gnode: function(can, stats) {
			return ab.apex.trans._.stamped(can, stats.map(s => can[s]));
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
	ETH: function(fill) {
		return ab.apex.trans._.bal(fill, "ETH", 1000000);
	},
	BTC: function(fill) {
		return ab.apex.trans._.bal(fill, "BTC", 10000000);
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