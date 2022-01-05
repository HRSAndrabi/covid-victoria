/* eslint import/no-webpack-loader-syntax: off */
import "./Map.scss";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import ClipLoader from "react-spinners/ClipLoader";
import ControlPanel from "../UI/ControlPanel/ControlPanel";
import Drawer from "../UI/Drawer/Drawer";
import { fetchVicData } from "../../data/data";
import {
    clusterClickHandler,
    clusterMouseEnterHandler,
    mapClickHandler,
} from "./interactivity";

const { REACT_APP_MAPBOX_API_TOKEN } = process.env;
mapboxgl.accessToken = REACT_APP_MAPBOX_API_TOKEN;

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [summaryStatistics, setSummaryStatistics] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerContent, setDrawerContent] = useState(null);
    let displayVariable = "active_cases";

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
            attributionControl: false,
        });

        map.current.dragRotate.disable();
        map.current.touchZoomRotate.disableRotation();

        map.current.on("load", function () {
            map.current.resize();
        });

        async function loadLayers() {
            const data = await fetchVicData();
            setSummaryStatistics(data.summaryStatistics);
            setIsLoading(false);
            map.current.addSource("regionBounds", {
                type: "vector",
                url: "mapbox://hassdaddy3.8h1ha029",
            });
            map.current.addSource("vic-cases", {
                type: "geojson",
                data: data.mapData,
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

            map.current.addLayer(require("./layers/clusters"));
            map.current.addLayer(require("./layers/points"));
            map.current.addLayer(require("./layers/counts"));
            map.current.addLayer(require("./layers/regionBorders"));
            map.current.addLayer(require("./layers/regionFills"));
            updateLayer("points", "active_cases", data.summaryStatistics);
            updateLayer("clusters", "active_cases", data.summaryStatistics);
        }
        loadLayers();

        // Interactivity
        let hoveredStateId = null;
        let drawerContent = null;
        map.current.on("click", "clusters", function (event) {
            clusterClickHandler(event, "vic-cases", "clusters", map);
            setDrawerOpen(false);
        });
        map.current.on("mouseenter", "clusters", function (event) {
            drawerContent = clusterMouseEnterHandler(
                event,
                hoveredStateId,
                map
            );
            setDrawerContent(drawerContent);
            setDrawerOpen(true);
        });
        map.current.on("mouseenter", "points", function (event) {
            map.current.getCanvas().style.cursor = "pointer";
            let results = mapClickHandler(
                event,
                drawerContent,
                hoveredStateId,
                map
            );
            setDrawerContent(results.drawerContent);
            drawerContent = results.drawerContent;
            setDrawerOpen(results.drawerOpen);
            hoveredStateId = results.hoveredStateId;
        });
        map.current.on("click", function (event) {
            let results = mapClickHandler(
                event,
                drawerContent,
                hoveredStateId,
                map
            );
            setDrawerContent(results.drawerContent);
            drawerContent = results.drawerContent;
            setDrawerOpen(results.drawerOpen);
            hoveredStateId = results.hoveredStateId;
        });
        map.current.on("mouseleave", "clusters", function (event) {
            map.current.getCanvas().style.cursor = "grab";
        });
        map.current.on("mouseleave", "points", function (event) {
            map.current.getCanvas().style.cursor = "grab";
        });

        // Clean up on unmount
        return () => map.remove();
    }, [displayVariable]);

    const updateLayer = (layerID, displayVariable, summaryStatistics) => {
        // Updates the paint properties of "points" and "clusters" layers
        // so that the circles are styled based on the selected layer,
        // i.e. active, confirmed, or new cases
        if (layerID !== "points" && layerID !== "clusters") {
            return;
        }

        let maxVal = 0;
        if (displayVariable === "active_cases") {
            maxVal = summaryStatistics.maxActive;
        } else if (displayVariable === "confirmed_cases") {
            maxVal = summaryStatistics.maxConfirmed;
        } else if (displayVariable === "new_cases") {
            maxVal = summaryStatistics.maxNew;
        }

        map.current.setPaintProperty(layerID, "circle-stroke-color", [
            "step",
            ["get", displayVariable],
            "#d700ff",
            maxVal / 50,
            "#f20df6",
            maxVal / 25,
            "#ff00e0",
            maxVal / 10,
            "#f301b3",
            maxVal / 5,
            "#dd1c77",
            maxVal / 2,
            "#ff0074",
            maxVal * 0.9,
            "#ff003f",
        ]);
        map.current.setPaintProperty(layerID, "circle-radius", [
            "interpolate",
            ["linear"],
            ["get", displayVariable],
            0,
            10,
            maxVal / 50,
            15,
            maxVal,
            30,
        ]);
    };

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
        map.current.setFilter("counts", [">", ["get", newDisplayVariable], 0]);
        map.current.setLayoutProperty(
            "counts",
            "text-field",
            `{${newDisplayVariable}}`
        );
        updateLayer("points", newDisplayVariable, summaryStatistics);
        updateLayer("clusters", newDisplayVariable, summaryStatistics);
        displayVariable = newDisplayVariable;
    };

    return (
        <>
            <ControlPanel
                onDisplayVariableChange={displayVariableChangeHandler}
                data={summaryStatistics}
            />
            <Drawer open={drawerOpen} content={drawerContent} />
            {isLoading && (
                <div className="loading">
                    <ClipLoader color="#1e90ff" size={30} /> Loading ...
                </div>
            )}
            <div ref={mapContainer} className="map-container" />
        </>
    );
}

export default Map;
