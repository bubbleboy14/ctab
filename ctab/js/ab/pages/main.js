CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("ab.dash");
CT.scriptImport("https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js");
CT.dom.addStyle(null, "https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css");

CT.onload(function() {
        CT.initCore();
        ab.dash.init();
});