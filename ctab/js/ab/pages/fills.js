CT.require("CT.all");
CT.require("core");
CT.require("user.core");
CT.require("ab.util");
CT.require("ab.apex");
CT.require("ab.fills");

CT.onload(function() {
    CT.initCore();
    ab.fills.init();
});