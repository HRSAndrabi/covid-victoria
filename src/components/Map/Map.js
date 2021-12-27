/* eslint import/no-webpack-loader-syntax: off */
import "./Map.scss";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import ControlPanel from "../UI/ControlPanel/ControlPanel";
import Drawer from "../UI/Drawer/Drawer";
import { fetchVicData } from "../../data/data";
import {
    clusterClickHandler,
    clusterMouseEnterHandler,
    pointClickHandler,
} from "./interactivity";

mapboxgl.accessToken =
    "pk.eyJ1IjoiaGFzc2RhZGR5MyIsImEiOiJjazhmY3JyaW8wMzB0M3RuejQ4bnVvdzA5In0.jQj5RVAoLo-Rsht5-zi_Ig";

function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    let displayVariable = "confirmed_cases";
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerContent, setDrawerContent] = useState(null);

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

        map.current.on("load", function () {
            map.current.resize();
        });

        async function loadLayers() {
            const data = await fetchVicData();
            map.current.addSource("regionBounds", {
                type: "vector",
                url: "mapbox://hassdaddy3.8h1ha029",
            });
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
            map.current.addLayer(require("./layers/clusters"));
            map.current.addLayer(require("./layers/points"));
            map.current.addLayer(require("./layers/counts"));
        }
        loadLayers();

        // Interactivity
        map.current.on("click", "clusters", function (event) {
            clusterClickHandler(event, "vic-cases", "clusters", map);
            setDrawerOpen(false);
        });
        map.current.on("mouseenter", "clusters", function (event) {
            setDrawerContent(clusterMouseEnterHandler(event, map));
            setDrawerOpen(true);
        });
        map.current.on("mouseenter", "points", function (event) {
            setDrawerContent(pointClickHandler(event, map));
            setDrawerOpen(true);
        });
        map.current.on("click", "points", function (event) {
            setDrawerContent(pointClickHandler(event, map));
            setDrawerOpen(true);
        });
        map.current.on("mouseleave", "clusters", function (event) {
            map.current.getCanvas().style.cursor = "grab";
        });
        map.current.on("mouseleave", "points", function (event) {
            map.current.getCanvas().style.cursor = "grab";
        });
        // map.current.on("preclick", function (event) {
        //     setDrawerOpen(!drawerOpen);
        // });
        map.current.on("click", function (event) {
            if (event.defaultPrevented === false) {
                setDrawerOpen(false);
            }
        });

        // Clean up on unmount
        return () => map.remove();
    }, [displayVariable]);

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
        displayVariable = newDisplayVariable;
    };

    return (
        <>
            <ControlPanel
                onDisplayVariableChange={displayVariableChangeHandler}
            />
            <Drawer open={drawerOpen} content={drawerContent} />
            <div ref={mapContainer} className="map-container" />;
        </>
    );
}

export default Map;