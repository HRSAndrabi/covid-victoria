import React from "react";

const Clusters = (props) => {
    return {
        id: "clusters",
        type: "circle",
        source: "vic-cases",
        filter: [
            "all",
            ["has", "point_count"],
            [">", ["get", props.displayVariable], 0],
        ],
        layout: { visibility: "visible" },
        paint: props.style,
    };
};

export default Clusters;
