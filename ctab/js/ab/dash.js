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
			cancels: "yellow fgrow",
			refills: "blue fgrow2",
			fills: "green fgrow2",
			warnings: "red fgrow"
		},
		tables: {
			symbol: { // TODO: meh configurize symbol/market better
				head: ["symbol", "quote", "actual", "theoretical"],
				rows: ["USD", "ETH", "BTC"]
			},
			market: {
				head: ["market", "ask", "bid", "asks", "bids", "volume"],
				rows: ["ETHBTC", "ETHUSD", "BTCUSD"]
			},
			metric: {
				head: ["metric", "actual", "theoretical"],
				rows: ["diff", "dph"]
			}
		},
		chart1: ["USD", "ETH", "BTC", "USD actual", "ETH actual", "BTC actual",
			"ETH ask", "BTC ask", "ETH bid", "BTC bid"],
		chart2: ["diff", "dph", "diff actual", "dph actual",
			"diff ask", "dph ask", "diff bid", "dph bid"],
		noclix: ["staging", "stagish", "live", "network", "capped", "credset"],
		streams: ["fills", "cancels", "warnings", "refills"],
		floats: ["prunelimit", "vcutoff", "nmult"],
		ofloro: ["backend", "strategy", "ndx"],
		balsubs: ["ask", "bid", "actual"],
		tribools: ["oneswap", "nudge"],
		littles: ["randlim"],
		rounders: ["fees"],
		sliceSpan: "short",
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
		cancelAll: function() {
			confirm("are you sure?") && confirm("really?") && this._.ab(function() {
				alert("ok!");
			}, "cancelall");
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
		tab: function(data, mode, sub) {
			var col, sym, colnode, fnode, cols = {}, _ = this._, colors = _.colors,
				params = d_.tables[mode], head = params.head, rows = params.rows,
				c = d => CT.dom.div(d, "w1 bordered smallpadded nowrap"), bals = data.balances;
			for (col of head)
				cols[col] = [c("<b>" + col + "</b>")];
			for (sym of rows) {
				colnode = c("<b>" + sym + "</b>");
				cols[mode].push(colnode);
				if (mode == "market") {
					cols.volume.push(c(_.rounder(data.volumes[sym], 1000)));
					cols.ask.push(c(data.orders[sym].ask));
					cols.bid.push(c(data.orders[sym].bid));
					cols.asks.push(c(data.totals[sym].ask));
					cols.bids.push(c(data.totals[sym].bid));
				} else {
					colnode.style.color = colors[sym];
					if (mode == "symbol")
						cols.quote.push(c(data.prices[sym + "USD"] || 1));
					cols.actual.push(c(bals.waiting ? "waiting" : bals.actual[sym]));
					cols.theoretical.push(c(bals.waiting ? "waiting" : bals.theoretical[sym]));
				}
			}
			fnode = CT.dom.flex(head.map(h => cols[h]), "bordered row jcbetween");
			return sub ? CT.dom.div([
				fnode,
				_.leg(data[sub], false, null, true, null, null, true, "big")
			]) : fnode;
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
		leg: function(data, colored, subbers, round, onclick, tpath, forceBreak, withClass) {
			if (!data) return "0";
			tpath = tpath || [];
			var _ = this._, cont, dnode, lname, lab, labs = {}, popts, subber, sval, srow, d2n = function(d) {
				var val, vtype, vnode, isbool, mypath = tpath.slice();
				mypath.push(d);
				if (typeof data[d] == "object") {
					return CT.dom.div([
						CT.dom.div(d, "centered"),
						_.leg(data[d], colored, subbers && subbers[d], round, onclick, mypath)
					], "w1");
				}

				if (forceBreak) {
					lab = CT.dom.div(d, "bold");
					cont = [lab];
				} else {
					lab = CT.dom.span(d, "bold");
					cont = [lab, CT.dom.pad()];
				}

				labs[d] = lab;
				val = data[d];
				vtype = typeof(val);
				isbool = vtype == "boolean";
				round = round || d_.rounders.includes(d);
				if (round && vtype == "number")
					val = _.rounder(val, 1000000);
				else if (isbool)
					val = val.toString();
				else if (d == d_.sliceSpan)
					d_.slice = val;
				vnode = CT.dom.span(val);
				cont.push(vnode);
				if (subbers) {
					for (subber of subbers.names) {
						if (d == "USD" && ["ask", "bid"].includes(subber))
							continue;
						srow = [];
						sval = subbers.set[subber][d];
						lab = CT.dom.span(subber, "bold");
						labs[d + " " + subber] = lab;
						srow.push(lab);
						srow.push(CT.dom.pad());
						srow.push(CT.dom.span(sval));
						cont.push(srow);
					}
				}
				dnode = CT.dom.div(cont, "small p1");
				if (onclick && !d_.noclix.includes(d)) {
					dnode.onclick = function() {
						if (d_.tribools.includes(d)) {
							if (val == "auto")
								val = true;
							else if (val == true)
								val = false;
							else // false...
								val = "auto";
							CT.dom.setContent(vnode, val.toString());
							return onclick(_.tp2o(mypath, val));
						}
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
								if (d == d_.sliceSpan)
									d_.slice = rval;
								onclick(_.tp2o(mypath, rval));
							}
						};
						if (d_.floats.includes(d)) {
							Object.assign(popts, {
								max: 4,
								min: 0.1,
								step: 0.05
							});
						} else if (d_.littles.includes(d)) {
							Object.assign(popts, {
								max: 0.1,
								min: 0.001,
								step: 0.001
							});
						}
						CT.modal.prompt(popts);
					};
					dnode.classList.add("hoverglow");
					dnode.classList.add("pointer");
				}
				return dnode;
			}, n = CT.dom.flex(Object.keys(data).map(d2n), "bordered row jcbetween");
			colored && CT.dom.className("ct-line", _.nodes.charts).forEach(function(n, i) {
				lname = d_.charts[i];
				if (lname in labs)
					labs[lname].style.color = _.colors[lname]
						= window.getComputedStyle(n).getPropertyValue("stroke");
				else
					CT.log("can't find " + lname + " to color!");
			});
			withClass && n.classList.add(withClass);
			return n;
		},
		trades: function(data) {
			var _ = this._, nz = _.nodes, trade, tnode, tsig, tclass, sells = [
			], buys = [], proc = function(t, cname) {
				tsig = t.amount + " " + t.symbol + " @ " + t.price;
				tclass = "pointer hoverglow " + cname;
				tnode = CT.hover.auto(CT.dom.div(tsig, tclass), [
					CT.dom.div(t.score, "big"),
					t.status,
					t.client_order_id,
					t.order_id
				]);
				tnode.onclick = () => CT.modal.modal(_.leg(t));
				if (t.side == "sell")
					sells.push(tnode);
				else
					buys.push(tnode);
			};
			for (trade in data.actives)
				proc(data.actives[trade], "bold");
			for (trade of data.backlog)
				proc(trade, "yellow");
			CT.dom.setContent(nz.sells, sells);
			CT.dom.setContent(nz.buys, buys);
		},
		legend: function(data) {
			var _ = this._, bals = data.balances,
				strats = _.leg(data.strategists, false, null, true);
			strats.classList.add("fwrap");
			CT.dom.setContent(_.nodes.prices, [
				bals.waiting ? _.leg(bals, false, null, false, null, null, true,
					"centered") : _.leg(bals.theoretical, true, {
						set: bals,
						names: d_.balsubs
					}),
				CT.dom.flex([
					_.tab(data, "symbol"),
					_.tab(data, "metric", "ndx")
				], "bordered row jcbetween"),
				_.tab(data, "market")
			]);
			CT.dom.setContent(_.nodes.legend, [
				_.leg({ orders: data.accountant, harvester: data.harvester }),
				strats,
				_.leg(data.gem)
			]);
		},
		snode: function(data, sec) {
			var _ = this._, n = CT.hover.auto(CT.dom.div(data.msg,
				"bordered padded margined round hoverglow pointer"),
				(data.timestampms ? new Date(data.timestampms) : new Date()).toLocaleString());
			n.onclick = () => CT.modal.modal([
				CT.dom.div(sec + ": " + data.msg, "bigger bold centered"),
				_.leg(data.data)
			]);
			CT.trans.glow(n);
			return n;
		},
		streams: function(data) {
			var _ = this._, sec, d;
			for (sec of d_.streams) {
				for (d of data[sec])
					CT.dom.addContent(_.nodes[sec], _.snode(d, sec));
				data[sec].length && _.nodes[sec].lastChild.scrollIntoView({
					alignToTop: false,
					behavior: "smooth"
				});
			}
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
			var s, k, all = {}, _ = this._;
			_.round(bals.theoretical);
			Object.assign(all, bals.theoretical);
			for (s of d_.balsubs) {
				_.round(bals[s]);
				for (k in bals[s])
					all[k + " " + s] = bals[s][k];
			}
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
				nz[name] = CT.dom.div(null, "hm150p scrolly");
				return CT.dom.div([
					CT.dom.div(name, "centered bold"),
					nz[name]
				], d_.scols[name]);
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
		nz.cancelAll = CT.dom.button("Cancel All Orders", _.cancelAll, "abs b0 l0");
		CT.dom.setMain(CT.dom.flex([
			nz.sells,
			CT.dom.flex([
				nz.conf,
				nz.charts,
				nz.prices,
				nz.streams,
				nz.legend
			], "maincol h1 col"),
			nz.buys,
			nz.cancelAll
		], "h1 row"));
	},
	update: function(data) {
		var _ = this._, m = data.message;
		d_.loud && this.log(data);
		if (m.waiting)
			return this.log("waiting!", m.waiting);
		if (!m.balances.waiting) {
			_.balup(m.balances);
			_.charts();
		}
		_.trades(m);
		_.legend(m);
		_.streams(m);
	},
	start: function() {
		CT.pubsub.set_autohistory(true);
		CT.pubsub.connect(location.hostname, this.opts.port);
		CT.pubsub.set_cb("message", this.update);
		CT.pubsub.subscribe("swapmon");
	},
	load: function(curconf) {
		this.build(curconf);
		this.start();
	},
	setLoud: function(isloud) {
		d_.loud = isloud;
	},
	init: function(opts) {
		this.opts = opts = CT.merge(opts, {

		});
		this._.ab(this.load);
	}
});