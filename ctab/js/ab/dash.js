ab.dash = {
	_: {
		chart1: ["USD", "ETH", "BTC", "USD actual", "ETH actual", "BTC actual"],
		chart2: ["diff", "dph", "diff actual", "dph actual"],
		noclix: ["staging", "stagish", "live", "network"],
		slice: 10
	},
	init: function() {
		ab.dash._.dash = new ab.dash.Dash(core.config.ctab.dash);
	}
};

var d_  = ab.dash._;
d_.charts = d_.chart1.concat(d_.chart2);

ab.dash.Dash = CT.Class({
	CLASSNAME: "ab.dash.Dash",
	_: {
		data: {},
		nodes: {},
		ab: function(cb, action, params) {
			CT.net.post({
				path: "/_ab",
				params: CT.merge(params, {
					action: action || "curconf"
				}),
				cb: cb
			});
		},
		charts: function() {
			var _ = this._;
			new Chartist.Line(_.nodes.chart1, {
				series: d_.chart1.map(k => _.data[k])
			});
			new Chartist.Line(_.nodes.chart2, {
				series: d_.chart2.map(k => _.data[k])
			});
		},
		counts: function(d) {
			return CT.dom.div("orders: " + d.approved + " approved; " + d.active + " active; "
				+ d.filled + " filled; " + d.cancelled + " cancelled", "up20 right");
		},
		tp2o: function(tpath, val) {
			var t, full = o = {};
			for (t of tpath.slice(0, -1))
				o = o[t] = {};
			o[tpath[tpath.length - 1]] = val;
			return full;
		},
		leg: function(data, colored, parenthetical, round, onclick, tpath) {
			if (!data) return "0";
			tpath = tpath || [];
			var _ = this._, cont, dnode, lab, labs = {}, d2n = function(d) {
				var val, vnode, isbool, mypath = tpath.slice();
				mypath.push(d);
				if (typeof data[d] == "object") {
					return CT.dom.div([
						CT.dom.div(d, "centered"),
						_.leg(data[d], colored, parenthetical && parenthetical[d], round, onclick, mypath)
					], "w1");
				}
				lab = CT.dom.span(d, "bold");
				cont = [lab, CT.dom.pad()];
				labs[d] = lab;
				val = data[d];
				isbool = typeof(val) == "boolean";
				if (round)
					val = _.rounder(val);
				else if (isbool)
					val = val.toString();
				else if (d == "outer")
					d_.slice = val;
				vnode = CT.dom.span(val);
				cont.push(vnode);
				if (parenthetical) {
					lab = CT.dom.span("actual", "bold");
					labs[d + " actual"] = lab;
					cont.push(CT.dom.pad());
					cont.push(lab);
					cont.push(CT.dom.pad());
					cont.push(CT.dom.span(parenthetical[d]));
				}
				dnode = CT.dom.div(cont, "slightlysmall p1");
				if (onclick && !d_.noclix.includes(d)) {
					dnode.onclick = function() {
						if (isbool) {
							val = (val == "true") ? "false" : "true";
							CT.dom.setContent(vnode, val);
							return onclick(_.tp2o(mypath, val == "true"));
						}
						CT.modal.prompt({
							prompt: "select a value for " + d,
							style: "number",
							initial: val,
							step: 1,
							max: 40,
							min: 1,
							cb: function(rval) {
								CT.dom.setContent(vnode, rval);
								if (d == "outer")
									d_.slice = rval;
								onclick(_.tp2o(mypath, rval));
							}
						});
					};
					dnode.classList.add("hoverglow");
					dnode.classList.add("pointer");
				}
				return dnode;
			}, n = CT.dom.flex(Object.keys(data).map(d2n), "bordered row jcbetween");
			colored && CT.dom.className("ct-line", _.nodes.charts).forEach(function(n, i) {
				labs[d_.charts[i]].style.color
					= window.getComputedStyle(n).getPropertyValue("stroke");
			});
			return n;
		},
		trades: function(data) {
			var nz = this._.nodes, proc = function(t, cname) {
				tnode = CT.dom.div(t.amount + " " + t.symbol + " @ " + t.price, cname);
				if (t.side == "sell")
					sells.push(tnode);
				else
					buys.push(tnode);
			}, sells = [], buys = [], trade, tnode;
			for (trade in data.actives)
				proc(data.actives[trade], "bold");
			for (trade of data.backlog)
				proc(trade, "yellow");
			CT.dom.setContent(nz.sells, sells);
			CT.dom.setContent(nz.buys, buys);
		},
		legend: function(data) {
			var _ = this._;
			CT.dom.setContent(_.nodes.legend, [
				_.counts(data.counts),
				_.leg(data.balances.theoretical, true, data.balances.actual),
				_.leg(data.strategists, false, null, true)
			]);
		},
		up: function(upd) {
			var k, v, d = this._.data;
			for (k in upd) {
				if (!d[k])
					d[k] = [];
				v = upd[k];
				if (isNaN(v))
					v = parseFloat(v.split(" $").pop());
				d[k].push(v);
				d[k] = d[k].slice(-d_.slice);
			}
		},
		rounder: function(val, factor) {
			factor = factor || 100000;
			return parseInt(val * factor) / factor;
		},
		round: function(bals) {
			var k, v, a, b, r = this._.rounder;
			for (k in bals) {
				v = bals[k];
				if (isNaN(v)) {
					[a, b] = v.slice(0, -1).split(" ($");
					v = r(a, 10000) + " $" + r(b, 100);
				} else
					v = r(v);
				bals[k] = v;
			}
		},
		balup: function(bals) {
			var k, all = {}, _ = this._;
			_.round(bals.theoretical);
			_.round(bals.actual);
			Object.assign(all, bals.theoretical);
			for (k in bals.actual)
				all[k + " actual"] = bals.actual[k];
//			this.log("updated balances:", Object.keys(all));
			_.up(all);
		},
		upConf: function(cobj) {
			this._.ab(() => this.log("conf updated!"), "setconf", {
				mod: cobj
			});
		},
		loadConf: function(curconf) {
			var _ = this._;
			_.curconf = curconf;
			_.nodes.conf = CT.dom.div();
			CT.dom.setContent(_.nodes.conf, _.leg(curconf,
				false, null, false, _.upConf));
		}
	},
	build: function(curconf) {
		var _ = this._, nz = _.nodes;
		_.loadConf(curconf);
		nz.legend = CT.dom.div();
		nz.chart1 = CT.dom.div(null, "w1-2");
		nz.chart2 = CT.dom.div(null, "w1-2");
		nz.sells = CT.dom.div(null, "scrolly red sidecol");
		nz.buys = CT.dom.div(null, "scrolly green sidecol");
		nz.charts = CT.dom.flex([nz.chart1, nz.chart2], "midcharts");
		CT.dom.setMain(CT.dom.flex([
			nz.sells,
			CT.dom.div([
				nz.conf,
				nz.charts,
				nz.legend
			], "maincol"),
			nz.buys
		]));
	},
	update: function(data) {
		var _ = this._, m = data.message;
//		this.log(data);
		_.balup(m.balances);
		_.trades(m);
		_.charts();
		_.legend(m);
	},
	load: function() {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, this.opts.port);
		CT.pubsub.set_cb("message", this.update);
		CT.pubsub.subscribe("swapmon");
		this._.ab(this.build);
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {

		});
		this.load();
	}
});