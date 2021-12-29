const style = require("./style");

module.exports = {
    id: "clusters",
    type: "circle",
    source: "vic-cases",
    filter: ["all", ["has", "point_count"], [">", ["get", "active_cases"], 0]],
    layout: { visibility: "visible" },
    paint: style["circleStyling"],
};
