module.exports = {
    circleStyling: {
        "circle-opacity": 0.6,
        "circle-stroke-width": 2,

        "circle-color": "#1a1a1a",
        "circle-stroke-opacity": 0.95,
    },
    lgaBorders: {
        "line-color": "#fff",
        "line-width": 0.5,
        "line-opacity": 0.1,
    },
    lgaFill: {
        "fill-color": "#a60006",
        "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.1,
            0,
        ],
    },
};
