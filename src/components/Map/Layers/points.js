const style = require("./style");

module.exports = {
    id: "points",
    type: "circle",
    source: "vic-cases",
    filter: [
        "all",
        ["!", ["has", "point_count"]],
        [">", ["get", "confirmed_cases"], 0],
    ],
    layout: { visibility: "visible" },
    paint: style["circleStyling"],
};
