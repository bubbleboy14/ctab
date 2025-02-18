ab.candles.latest = {
	_: {
		latest: {},
		lasters: ["ad", "obv", "vpt", "OBVslope", "ADslope", "mfi", "ADX"]
	},
	get: function(sym, stat) {
		const latest = ab.candles.latest._.latest;
		return latest[sym] && latest[sym][stat];
	},
	set: function(sym, cans, isFirst) {
		const _ = ab.candles.latest._, last = cans[cans.length - 1];
		if (isFirst)
			_.latest[sym] = {};
		for (let laster of _.lasters)
			_.latest[sym][laster] = last[laster];
	}
};