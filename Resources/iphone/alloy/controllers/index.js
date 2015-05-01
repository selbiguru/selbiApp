function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function sayHello() {
        alert("fahd says hello");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    var __alloyId0 = [];
    $.__views.__alloyId2 = Ti.UI.createWindow({
        title: "Tab 1",
        id: "__alloyId2"
    });
    $.__views.__alloyId3 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "I am Window 1",
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "Tab 1",
        icon: "KS_nav_ui.png",
        id: "__alloyId1"
    });
    __alloyId0.push($.__views.__alloyId1);
    $.__views.__alloyId5 = Ti.UI.createWindow({
        title: "Tab 2",
        id: "__alloyId5"
    });
    $.__views.__alloyId6 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "I am Window 2",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.__alloyId4 = Ti.UI.createTab({
        window: $.__views.__alloyId5,
        title: "Tab 2",
        icon: "KS_nav_views.png",
        id: "__alloyId4"
    });
    __alloyId0.push($.__views.__alloyId4);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.login_page = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "login_page"
    });
    $.__views.login_page && $.addTopLevelView($.__views.login_page);
    sayHello ? $.__views.login_page.addEventListener("open", sayHello) : __defers["$.__views.login_page!open!sayHello"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.login_page.open();
    $.index.open();
    __defers["$.__views.login_page!open!sayHello"] && $.__views.login_page.addEventListener("open", sayHello);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;