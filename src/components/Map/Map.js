import "./Map.scss";
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import ControlPanel from "../UI/ControlPanel/ControlPanel";
import { fetchVicData } from "../../data/data";

mapboxgl.accessToken =
    "pk.eyJ1IjoiaGFzc2RhZGR5MyIsImEiOiJjazhmY3JyaW8wMzB0M3RuejQ4bnVvdzA5In0.jQj5RVAoLo-Rsht5-zi_Ig";

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const Style = require("./Style");

    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/hassdaddy3/ckxlo17dgc4s414udisy27lev",
            center: [133.354, -28.141],
            zoom: 4.2,
            maxBounds: [
                [145.5 - 7, -40], // Southwest coordinates
                [145.5 + 5.5, -33], // Northeast coordinates
            ],
        });

        map.current.on("load", function () {
            map.current.addSource("regionBounds", {
                type: "vector",
                url: "mapbox://hassdaddy3.8h1ha029",
            });
        });

        async function loadData() {
            const data = await fetchVicData();
            map.current.addSource("vic-cases", {
                type: "geojson",
                data: data,
                cluster: true,
                clusterMaxZoom: 9, // Max zoom to cluster points on
                clusterRadius: 65, // Radius of each cluster when clustering points (defaults to 50)
                clusterProperties: {
                    confirmed_cases: ["+", ["get", "confirmed_cases"]],
                    new_cases: ["+", ["get", "new_cases"]],
                    active_cases: ["+", ["get", "active_cases"]],
                    rate: ["+", ["get", "rate"]],
                    density: ["+", ["get", "area_km2"]],
                    maxCases: ["max", ["get", "confirmed_cases"]],
                    lga: ["concat", ["get", "lga"]],
                },
            });

            // Clustered points
            map.current.addLayer({
                id: "clusters",
                type: "circle",
                source: "vic-cases",
                filter: [
                    "all",
                    ["has", "point_count"],
                    [">", ["get", "confirmed_cases"], 0],
                ],
                layout: { visibility: "visible" },
                paint: Style["circleStyling"],
            });

            // Unclustered points
            map.current.addLayer({
                id: "points",
                type: "circle",
                source: "vic-cases",
                filter: [
                    "all",
                    ["!", ["has", "point_count"]],
                    [">", ["get", "confirmed_cases"], 0],
                ],
                layout: { visibility: "visible" },
                paint: Style["circleStyling"],
            });

            // Text for clustered/unclustered points
            map.current.addLayer({
                id: "cluster-counts",
                type: "symbol",
                source: "vic-cases",
                filter: [">", ["get", "confirmed_cases"], 0],
                layout: {
                    "text-field": `{${"confirmed_cases"}}`,
                    "text-font": [
                        "DIN Offc Pro Medium",
                        "Arial Unicode MS Bold",
                    ],
                    "text-size": 12,
                    visibility: "visible",
                },
                paint: {
                    "text-color": "#fff5f0",
                },
            });
        }
        loadData();
    });

    const displayVariableChangeHandler = (newDisplayVariable) => {
        // Setting properties as opposed to state to avoid
        // re-rendering
        map.current.setFilter("clusters", [
            "all",
            ["has", "point_count"],
            [">", ["get", newDisplayVariable], 0],
        ]);
        map.current.setFilter("points", [
            "all",
            ["!", ["has", "point_count"]],
            [">", ["get", newDisplayVariable], 0],
        ]);
        map.current.setFilter("cluster-counts", [
            ">",
            ["get", newDisplayVariable],
            0,
        ]);
        map.current.setLayoutProperty(
            "cluster-counts",
            "text-field",
            `{${newDisplayVariable}}`
        );
    };

    return (
        <>
            <ControlPanel
                onDisplayVariableChange={displayVariableChangeHandler}
            />
            <div ref={mapContainer} className="map-container" />;
        </>
    );
}

export default Map;
