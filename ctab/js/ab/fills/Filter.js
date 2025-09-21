ab.fills.Filter = CT.Class({
	CLASSNAME: "ab.fills.Filter",
	_: {
		reasons: [],
		reason: function() {
			const _ = this._, oz = this.opts;
			CT.modal.choice({
				prompt: "what reason?",
				data: _.reasons,
				cb: function(sel) {
					oz.fills = oz.fills.filter(f => f.rationale && f.rationale.reason == sel);
					_.refresh("reason");
				}
			});
		},
		score: function() {
			const fs = this.score;
			fs.data || fs.calc();
			fs.prompt();
		},
		clear: function() {
			this.opts.fills = this.opts.allfills;
			this._.refresh();
		},
		refresh: function(filtered) {
			this._.filtered = filtered
			CT.dom.clear("ctmain");
			this.opts.refresher();
		}
	},
	score: {
		calc: function() {
			const oz = this.opts, data = this.score.data = {
			}, af = oz.allfills, prices = oz.prices;
			let score, pold, pnew, vold, vnew, reason;
			this.log("scoring", prices);
			CT.net.spinOn();
			af.forEach(function(fill) {
				// market, amount, price, side, fee
				reason = fill.rationale.reason;
				pnew = prices[fill.market];
				pold = fill.price;
				amount = fill.amount;
				vnew = amount * pnew;
				vold = amount * pold;
				if (fill.side == "buy")
					score = vnew - vold;
				else // sell
					score = vold - vnew;
				score -= fill.fee; // right?
				if ("total" in data) {
					data.total += score;
					data.volume += amount;
					data.min = Math.min(score, data.min);
					data.max = Math.max(score, data.max);
				} else {
					data.total = data.min = data.max = score;
					data.volume = amount;
				}
				if (reason in data) {
					data[reason].total += score;
					data[reason].volume += amount;
					data[reason].min = Math.min(score, data[reason].min);
					data[reason].max = Math.max(score, data[reason].max);
				} else {
					data[reason] = {};
					data[reason].volume = amount;
					data[reason].total = data[reason].min = data[reason].max = score;
				}
				fill.score = {
					prospective: fill.score,
					retrospective: score
				}
			});
			data.average = data.total / af.length;
			CT.net.spinOff();
			this.log("scored", data);
		},
		filt: function(direction, num) {
			if (direction == "above")
				return f => f.score.retrospective > num;
			return f => f.score.retrospective < num;
		},
		select: function(direction) {
			const _ = this._, oz = this.opts, s = this.score, data = s.data;
			CT.modal.prompt({
				prompt: "what cutoff?",
				style: "number",
				min: data.min,
				max: data.max,
				step: 0.001,
				initial: data.average,
				cb: function(num) {
					oz.fills = oz.fills.filter(s.filt(direction, num));
					_.refresh("score");
				}
			})
		},
		prompt: function() {
			CT.modal.choice({
				prompt: "what direction?",
				data: ["above", "below"],
				cb: this.score.select
			});
		},
		prices: function(prices) {
			this.opts.prices = prices;
			this.log("prices", prices);
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
		const _ = this._;
		let filts;
		return CT.dom.button("filter", function() {
			filts = ["reason", "score"];
			if (_.filtered) {
				CT.data.remove(filts, _.filtered);
				filts.push("clear");
			}
			CT.modal.choice({
				prompt: "what filter?",
				data: filts,
				cb: filt => _[filt]()
			})
		});
	},
	init: function(opts) {
		this.opts = opts;
		ab.util.req(this.score.prices, "prices");
	}
});