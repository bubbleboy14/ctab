CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("ab.util");
CT.require("ab.candles");
CT.scriptImport("https://cdn.jsdelivr.net/npm/apexcharts");

CT.onload(function() {
        CT.initCore();
        ab.candles.init();
});