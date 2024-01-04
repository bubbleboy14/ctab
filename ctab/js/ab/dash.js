ab.dash = {
	_: {
		counts: { // now unused
			orders: ["approved", "active", "filled", "cancelled", "fees"],
			harvester: ["hauls", "harvest", "refills"]
		},
		csides: { // now unused
			orders: "right",
			harvester: "left"
		},
		scols: {
			cancels: "yellow",
			fills: "green",
			warnings: "red"
		},
		tables: {
			symbol: { // TODO: meh configurize better
				head: ["symbol", "quote", "actual", "theoretical"],
				rows: ["USD", "ETH", "BTC"]
			},
			metric: {
				head: ["metric", "actual", "theoretical"],
				rows: ["diff", "dph"]
			}
		},
		chart1: ["USD", "ETH", "BTC", "USD actual", "ETH actual", "BTC actual"],
		chart2: ["diff", "dph", "diff actual", "dph actual"],
		noclix: ["staging", "stagish", "live", "network", "capped"],
		ofloro: ["strategy", "comptroller"],
		floats: ["prunelimit", "vcutoff"],
		streams: ["cancels", "fills", "warnings"],
		slice: 10,
		loud: false
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
		colors: {},
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
		tab: function(data, mode) {
			var col, sym, colnode, cols = {}, colors = this._.colors,
				params = d_.tables[mode], head = params.head, rows = params.rows,
				c = d => CT.dom.div(d, "w1 bordered smallpadded");
			for (col of head)
				cols[col] = [c("<b>" + col + "</b>")];
			for (sym of rows) {
				colnode = c("<b>" + sym + "</b>");
				colnode.style.color = colors[sym];
				cols[mode].push(colnode);
				if (mode == "symbol")
					cols.quote.push(c(data.prices[sym + "USD"] || 1));
				cols.actual.push(c(data.balances.actual[sym]));
				cols.theoretical.push(c(data.balances.theoretical[sym]));
			}
			return CT.dom.flex(head.map(h => cols[h]), "bordered row jcbetween");
		},
		counts: function(data, prop, round) { // now unused
			var d = data[prop], cname = "up20 small " + d_.csides[prop], r = this._.rounder,
				parts = d_.counts[prop].map(p => (round ? r(d[p]) : d[p]) + " " + p);
			return CT.dom.div(prop + ": " + parts.join("; "), cname);
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
			var _ = this._, cont, dnode, lname, lab, labs = {}, popts, d2n = function(d) {
				var val, vtype, vnode, isbool, mypath = tpath.slice();
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
				vtype = typeof(val);
				isbool = vtype == "boolean";
				if (round && vtype == "number")
					val = _.rounder(val, 10000000);
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
						popts = {
							prompt: "select a value for " + d,
							style: "number",
							initial: val,
							step: 1,
							min: 1,
							max: 200,
							classname: "w400p",
							cb: function(rval) {
								CT.dom.setContent(vnode, rval);
								if (d == "outer")
									d_.slice = rval;
								onclick(_.tp2o(mypath, rval));
							}
						};
						d_.floats.includes(d) && Object.assign(popts, {
							max: 3,
							min: 0.1,
							step: 0.1
						});
						CT.modal.prompt(popts);
					};
					dnode.classList.add("hoverglow");
					dnode.classList.add("pointer");
				}
				return dnode;
			}, n = CT.dom.flex(Object.keys(data).map(d2n), "bordered row jcbetween");
			colored && CT.dom.className("ct-line", _.nodes.charts).forEach(function(n, i) {
				lname = d_.charts[i];
				labs[lname].style.color = _.colors[lname]
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
			var _ = this._, strats = _.leg(data.strategists, false, null, true);
			strats.classList.add("fwrap");
			CT.dom.setContent(_.nodes.prices, [
				_.leg(data.balances.theoretical, true, data.balances.actual),
				CT.dom.flex([
					_.tab(data, "symbol"), _.tab(data, "metric")
				], "bordered row jcbetween")
			]);
			CT.dom.setContent(_.nodes.legend, [
				_.leg({ orders: data.orders, harvester: data.harvester }),
				strats,
				_.leg(data.gem)
			]);
		},
		snode: function(data, sec) {
			var _ = this._, n = CT.dom.div(data.msg,
				"bordered padded margined round hoverglow pointer");
			n.onclick = () => CT.modal.modal([
				CT.dom.div(sec + ": " + data.msg, "bigger bold centered"),
				_.leg(data.data)
			]);
			return n;
		},
		streams: function(data) {
			var _ = this._, sec, d;
			for (sec of d_.streams)
				for (d of data[sec])
					CT.dom.addContent(_.nodes[sec], _.snode(d, sec));
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
			d_.loud && this.log("updated balances:", Object.keys(all));
			_.up(all);
		},
		upConf: function(cobj) {
			this._.ab(() => this.log("conf updated!"), "setconf", {
				mod: cobj
			});
		},
		loadConf: function(curconf) {
			var _ = this._, prop, row2 = {};
			for (prop of d_.ofloro) {
				row2[prop] = curconf[prop];
				delete curconf[prop];
			}
			_.nodes.conf = CT.dom.div();
			CT.dom.setContent(_.nodes.conf, [
				_.leg(curconf, false, null, false, _.upConf),
				_.leg(row2, false, null, false, _.upConf)
			]);
		},
		setStreams: function() {
			var _ = this._, nz = _.nodes;
			nz.streams = CT.dom.flex(d_.streams.map(function(name) {
				nz[name] = CT.dom.div(null, "hm100p scrolly");
				return CT.dom.div([
					CT.dom.div(name, "centered bold"),
					nz[name]
				], "w1 " + d_.scols[name]);
			}), "bordered row");
		}
	},
	build: function(curconf) {
		var _ = this._, nz = _.nodes;
		_.setStreams();
		_.loadConf(curconf);
		nz.prices = CT.dom.div();
		nz.legend = CT.dom.div();
		nz.chart1 = CT.dom.div(null, "w1-2");
		nz.chart2 = CT.dom.div(null, "w1-2");
		nz.sells = CT.dom.div(null, "scrolly red sidecol");
		nz.buys = CT.dom.div(null, "scrolly green sidecol");
		nz.charts = CT.dom.flex([nz.chart1, nz.chart2], "midcharts fgrow");
		CT.dom.setMain(CT.dom.flex([
			nz.sells,
			CT.dom.flex([
				nz.conf,
				nz.charts,
				nz.prices,
				nz.streams,
				nz.legend
			], "maincol h1 col"),
			nz.buys
		], "h1 row"));
	},
	update: function(data) {
		var _ = this._, m = data.message;
		d_.loud && this.log(data);
		_.balup(m.balances);
		_.trades(m);
		_.charts();
		_.legend(m);
		_.streams(m);
	},
	load: function() {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, this.opts.port);
		CT.pubsub.set_cb("message", this.update);
		CT.pubsub.subscribe("swapmon");
		this._.ab(this.build);
	},
	setLoud: function(isloud) {
		d_.loud = isloud;
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {

		});
		this.load();
	}
});