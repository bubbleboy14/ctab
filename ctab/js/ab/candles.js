CT.require("ab.candles.util");
CT.require("ab.candles.trans");
CT.require("ab.candles.latest");
CT.require("ab.candles.Manager");
CT.scriptImport("https://cdn.jsdelivr.net/npm/apexcharts");

ab.candles.init = function(opts) {
	const abc = ab.candles;
	abc.opts = opts = CT.merge(opts, {
		startWS: true,
		container: "ctmain"
	});
	abc.util.start();
};