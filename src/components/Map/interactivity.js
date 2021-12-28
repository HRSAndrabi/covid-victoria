import moment from "moment";

// 'Pops' cluster on click, and reveals underlying points
export function clusterClickHandler(event, dataset, layer, map) {
    var features = map.current.queryRenderedFeatures(event.point, {
        layers: [layer],
    });
    var clusterId = features[0].properties.cluster_id;
    map.current
        .getSource(dataset)
        .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return;
            map.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom + 2,
            });
        });
}

// Render drawer content for clusters (desktop only)
export function clusterMouseEnterHandler(event, hoveredStateId, map) {
    map.current.getCanvas().style.cursor = "pointer";
    if (hoveredStateId) {
        map.current.setFeatureState(
            {
                source: "regionBounds",
                sourceLayer: "VicUpdatedLGA-c07oek",
                id: hoveredStateId,
            },
            { hover: false }
        );
    }
    return (
        <div className="collapsible small">
            <div className="collapsible-inner">
                Multiple regions, click or zoom to expand
            </div>
        </div>
    );
}

// Renders drawer content for points, and highlights underlying LGA
export function mapClickHandler(event, hoveredStateId, map) {
    // Initialise output variables
    let drawerContent = null;
    let newHoveredStateId = null;
    let drawerOpen = false;

    // Find selected point and region
    const selectedPoint = map.current.queryRenderedFeatures(event.point, {
        layers: ["points"],
    });
    const selectedRegion = map.current.queryRenderedFeatures(event.point, {
        layers: ["region-fills"],
    });

    if (selectedPoint.length > 0 && selectedRegion.length > 0) {
        // If we've clicked on a point and a region, compute drawer content
        // and highlight relevant region
        if (event.type === "click") {
            map.current.flyTo({
                center: selectedPoint[0].geometry.coordinates,
                zoom: 11,
            });
        }

        const confirmedCases = selectedPoint[0].properties.confirmed_cases;
        const activeCases = selectedPoint[0].properties.active_cases;
        const newCases = selectedPoint[0].properties.new_cases;
        const lga = selectedPoint[0].properties.lga;
        const population = selectedPoint[0].properties.population;
        const lastUpdated = moment(
            selectedPoint[0].properties.last_updated,
            "YYYY-MM-DD"
        ).format("DD MMM, YYYY");
        // const area = selectedPoint[0].properties.area_km2;
        // const coordinates = selectedPoint[0].geometry.coordinates.slice();

        const confirmedCasesRate = Math.round(
            (confirmedCases * 1000) / population
        );
        const activeCasesRate = Math.round((activeCases * 1000) / population);
        const newCasesRate = Math.round((newCases * 1000) / population);
        // const confirmedCasesDensity = Math.round((confirmedCases * Math.PI) / area);
        // const activeCasesDensity = Math.round((activeCases * Math.PI) / area);
        // const newCasesDensity = Math.round((newCases * Math.PI) / area);

        drawerContent = (
            <div className="collapsible">
                <div className="collapsible-inner">
                    <div className="drawer__header">{lga}</div>
                    <div className="metadata">
                        <div>
                            <span className="key">Population:</span>{" "}
                            {population.toLocaleString()}
                        </div>
                        <div>
                            <span className="key">Updated:</span> {lastUpdated}
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th className="left">Metric</th>
                                <th className="right">Number</th>
                                <th className="right">Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="left">Confirmed cases:</td>
                                <td className="right">
                                    {confirmedCases.toLocaleString()}
                                </td>
                                <td className="right">
                                    {confirmedCasesRate} per 1,000
                                </td>
                            </tr>
                            <tr>
                                <td className="left">Active cases:</td>
                                <td className="right">
                                    {activeCases.toLocaleString()}
                                </td>
                                <td className="right">
                                    {activeCasesRate} per 1,000
                                </td>
                            </tr>
                            <tr>
                                <td className="left">New cases:</td>
                                <td className="right">
                                    {newCases.toLocaleString()}
                                </td>
                                <td className="right">
                                    {newCasesRate} per 1,000
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="drawer__footer">
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://www.coronavirus.vic.gov.au/where-get-tested-covid-19"
                        >
                            {`\u{1F52C}`} Testing
                        </a>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://covid-vaccine.healthdirect.gov.au/booking/"
                        >
                            {`\u{1F489}`} Vaccination
                        </a>
                    </div>
                </div>
            </div>
        );

        newHoveredStateId = selectedRegion[0].id;
        if (hoveredStateId) {
            map.current.setFeatureState(
                {
                    source: "regionBounds",
                    sourceLayer: "VicUpdatedLGA-c07oek",
                    id: hoveredStateId,
                },
                { hover: false }
            );
        }
        map.current.setFeatureState(
            {
                source: "regionBounds",
                sourceLayer: "VicUpdatedLGA-c07oek",
                id: newHoveredStateId,
            },
            { hover: true }
        );

        drawerOpen = true;
    } else {
        // If we've clicked outside a point or region, remove region highlights
        if (hoveredStateId) {
            map.current.setFeatureState(
                {
                    source: "regionBounds",
                    sourceLayer: "VicUpdatedLGA-c07oek",
                    id: hoveredStateId,
                },
                { hover: false }
            );
        }
    }

    return {
        drawerContent: drawerContent,
        drawerOpen: drawerOpen,
        hoveredStateId: newHoveredStateId,
    };
}
