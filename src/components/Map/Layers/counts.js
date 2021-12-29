// const style = require("./style");

module.exports = {
    id: "counts",
    type: "symbol",
    source: "vic-cases",
    filter: [">", ["get", "active_cases"], 0],
    layout: {
        "text-field": `{${"active_cases"}}`,
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
        visibility: "visible",
    },
    paint: {
        "text-color": "#fff5f0",
    },
};
