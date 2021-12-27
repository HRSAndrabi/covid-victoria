const style = require("./style");

module.exports = {
    id: "region-borders",
    type: "line",
    source: "regionBounds",
    "source-layer": "VicUpdatedLGA-c07oek",
    paint: style.lgaBorders,
};
