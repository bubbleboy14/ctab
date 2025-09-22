ab.apex.trans = {
	_: {
		syms: ["ETH", "BTC", "USD"],
		terms: ["small", "medium", "large", "jumbo"],
		stamped: function(item, y, xprop) {
			const x = xprop ? item[xprop] : new Date(item.timestamp || item.created.slice(0, -3));
			return {
				x: x,
				y: y
			};
		},
		b2f: function(bline, mult, usd) {
			mult = mult || 1;
			if (typeof bline == "number")
				return mult * bline;
			const bparts = bline.slice(0, -1).split(" ($"),
				bpart = bparts[usd ? 1 : 0];
			return btotal = mult * parseFloat(bpart);
		},
		bal: function(fill, sym, mult, usd) {
			const _ = ab.apex.trans._;
			return _.stamped(fill, _.b2f(fill.balances[sym], mult, usd));
		},
		gnode: function(can, stats, xprop) {
			return ab.apex.trans._.stamped(can, stats.map(s => can[s]), xprop);
		},
		term: function(candles, term, dataOnly, tpref) {
			const gnode = ab.apex.trans._.gnode, d = {
				data: candles.map(c => gnode(c, [(tpref || "") + term]))
			};
			if (!dataOnly) {
				d.name = term;
				d.type = "line";
			}
			return d;
		}
	},
	ETH: function(fill) {
		return ab.apex.trans._.bal(fill, "ETH", 100);
	},
	BTC: function(fill) {
		return ab.apex.trans._.bal(fill, "BTC", 3000);
	},
	USD: function(fill) {
		const _ = ab.apex.trans._, bz = fill.balances;
		return _.stamped(fill, _.syms.map(s => _.b2f(bz[s], null, true)).reduce((a, b) => a + b));
	},
	candles: function(can) {
		return ab.apex.trans._.gnode(can, ["open", "high", "low", "close"]);
	},
	transer: function(prop, xprop) {
		const trans = ab.apex.trans;
		if (prop in trans)
			return trans[prop];
		return can => trans._.gnode(can, [prop], xprop);
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
	terms: function(candles, dataOnly, tpref) {
		const _ = ab.apex.trans._;
		return _.terms.map(term => _.term(candles, term, dataOnly, tpref));
	}
};