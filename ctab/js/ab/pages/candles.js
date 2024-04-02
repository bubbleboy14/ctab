CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("ab.util");
CT.require("ab.candles");

CT.onload(function() {
        CT.initCore();
        ab.candles.init();
});