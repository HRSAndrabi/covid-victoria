module.exports = {
    circleStyling: {
        "circle-stroke-color": [
            "step",
            ["get", "confirmed_cases"],
            "#d700ff",
            7,
            "#f20df6",
            25,
            "#ff00e0",
            50,
            "#f301b3",
            70,
            "#dd1c77",
            150,
            "#ff0074",
            400,
            "#ff003f",
        ],

        "circle-radius": [
            "step",
            ["get", "confirmed_cases"],
            10,
            10,
            20,
            300,
            25,
        ],

        "circle-opacity": 0.6,
        "circle-stroke-width": 2,

        "circle-color": "#1a1a1a",
        "circle-stroke-opacity": 0.95,
    },
};
