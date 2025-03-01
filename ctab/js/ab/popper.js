ab.popper = {
	_: {
		mod: 0,
		count: 100,
		order: "-created",
		ranges: {
			mod: {
				step: 10,
				min: 0,
				max: 1440
			},
			count: {
				step: 50,
				min: 50,
				max: 1000
			}
		},
		filts: function() {
			const _ = ab.popper._;
			if (!_.mod) return;
			return {
				index: {
					value: _.mod,
					comparator: "mod"
				}
			};
		},
		refresh: function() {
			const pop = ab.popper, _ = pop._;
			location.hash = "#count=" + _.count + "&mod=" + _.mod;
			CT.dom.clear("ctmain");
			CT.modal.close();
			pop.pop();
			pop.picker();
			pop.log("refreshed");
		},
		tweak: function(prop) {
			const _ = ab.popper._;
			CT.modal.prompt(CT.merge({
				prompt: prop + " is " + _[prop] + " - change?",
				style: "number",
				initial: _[prop],
				classname: "w400p",
				cb: function(val) {
					_[prop] = val;
					_.refresh();
				}
			}, _.ranges[prop]));
		},
		tweaker: function(prop) {
			const _ = ab.popper._;
			return CT.dom.link(prop + ": " + _[prop],
				() => _.tweak(prop), null, "hoverglow block");
		}
	},
	log: function(msg) {
		const _ = ab.popper._;
		CT.log("popper(" + _.count + "%" + _.mod + ") " + msg);
	},
	parse: function() {
		const pop = ab.popper, _ = pop._,
			h = location.hash.slice(1), p = parseInt(h);
		let pair, prop, val;
		if (!isNaN(p)) {
			_.count = p;
		} else if (h.includes("=")) {
			for (pair of h.split("&")) {
				[prop, val] = pair.split("=");
				if (prop == "count")
					_.count = parseInt(val);
				else if (prop == "mod")
					_.mod = parseInt(val);
			}
		}
	},
	pop: function() {
		const pop = ab.popper, _ = pop._;
		CT.db.get(_.model, function(items) {
			pop.log("found " + items.length + " items");
			_.builder(items);
		}, _.count, 0, _.order, _.filts());
	},
	picker: function() {
		const _ = ab.popper._, tweax = [
			_.tweaker("count"),
			_.tweaker("mod")
		];
		_.extra && tweax.push(_.extra);
		CT.modal.modal(tweax, null, {
			center: false,
			noClose: true,
			transition: "slide",
			slide: {
				origin: "topleft"
			}
		});
	},
	build: function(model, builder, extra) {
		const pop = ab.popper, _ = pop._;
		_.builder = builder;
		_.model = model;
		_.extra = extra;
		pop.parse();
		pop.pop();
		pop.picker();
		pop.log("initialized");
	},
};