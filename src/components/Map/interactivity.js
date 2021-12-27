import moment from "moment";

// 'Pops' cluster on click, and reveals underlying points
export function clusterClickHandler(event, dataset, layer, map) {
    event.preventDefault();
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

// Render popup for points in 'clusters' layer
export function clusterMouseEnterHandler(event, map) {
    map.current.getCanvas().style.cursor = "pointer";

    return <p>Multiple regions, click or zoom to expand</p>;
}

export function pointClickHandler(event, map) {
    event.preventDefault();
    map.current.getCanvas().style.cursor = "pointer";

    const confirmedCases = event.features[0].properties.confirmed_cases;
    const activeCases = event.features[0].properties.active_cases;
    const newCases = event.features[0].properties.new_cases;
    const lga = event.features[0].properties.lga;
    const population = event.features[0].properties.population;
    const lastUpdated = moment(
        event.features[0].properties.last_updated,
        "YYYY-MM-DD"
    ).format("DD MMM, YYYY");
    // const area = event.features[0].properties.area_km2;
    // const coordinates = event.features[0].geometry.coordinates.slice();

    const confirmedCasesRate = Math.round((confirmedCases * 1000) / population);
    const activeCasesRate = Math.round((activeCases * 1000) / population);
    const newCasesRate = Math.round((newCases * 1000) / population);
    // const confirmedCasesDensity = Math.round((confirmedCases * Math.PI) / area);
    // const activeCasesDensity = Math.round((activeCases * Math.PI) / area);
    // const newCasesDensity = Math.round((newCases * Math.PI) / area);

    return (
        <>
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
                        <td className="right">{activeCasesRate} per 1,000</td>
                    </tr>
                    <tr>
                        <td className="left">New cases:</td>
                        <td className="right">{newCases.toLocaleString()}</td>
                        <td className="right">{newCasesRate} per 1,000</td>
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
        </>
    );
}
