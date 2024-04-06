ab.apex.trans = {
	_: {
		syms: ["ETH", "BTC"],
		terms: ["small", "medium", "large"],
		stamped: function(item, y) {
			return {
				x: new Date(item.timestamp || item.created.slice(0, -3)),
				y: y
			};
		},
		b2f: function(bline, mult, usd) {
			const bparts = bline.slice(0, -1).split(" ($"),
				bpart = bparts[usd ? 1 : 0];
			return btotal = (mult || 1) * parseFloat(bpart);
		},
		bal: function(fill, sym, mult, usd) {
			const _ = ab.apex.trans._;
			return _.stamped(fill, _.b2f(fill.balances[sym], mult, usd));
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
	USD: function(fill) {
		const _ = ab.apex.trans._, bz = fill.balances;
		return _.stamped(fill, _.syms.map(s => _.b2f(bz[s], null, true)).reduce((a, b) => a + b));
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