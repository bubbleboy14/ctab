CT.require("ab.apex");
CT.require("ab.candles.util");
CT.require("ab.candles.latest");
CT.require("ab.candles.Manager");

ab.candles.init = function(opts) {
	const abc = ab.candles;
	abc.opts = opts = CT.merge(opts, {
		startWS: true,
		container: "ctmain"
	});
	abc.util.start();
};