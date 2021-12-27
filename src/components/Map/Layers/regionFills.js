const style = require("./style");

module.exports = {
    id: "region-fills",
    type: "fill",
    source: "regionBounds",
    "source-layer": "VicUpdatedLGA-c07oek",
    layout: {},
    paint: style.lgaFill,
};
