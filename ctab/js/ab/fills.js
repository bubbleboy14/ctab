CT.require("ab.apex");
CT.require("ab.fills.Filler");
CT.require("ab.fills.Filter");

ab.fills.init = function(opts) {
	ab.fills.filler = new ab.fills.Filler(opts);
};