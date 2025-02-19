CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("ab.util");
CT.require("ab.apex");
CT.require("ab.tpv");

CT.onload(function() {
    CT.initCore();
    ab.tpv.init();
});