import template from "./template.json";
import moment from "moment";

function csvToJSON(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j];
        }
        if (obj["LGADisplay"]) {
            result[obj["LGADisplay"]] = obj;
        } else {
            result[obj["LGA"]] = obj;
        }
    }
    return result;
}

async function updateTemplate(data) {
    try {
        template["features"] = template["features"].map((element) => {
            const lga = element["properties"]["lga"];
            return {
                ...element,
                properties: {
                    ...element.properties,
                    confirmed_cases: parseInt(data[lga]["cases"]),
                    active_cases: parseInt(data[lga]["active"]),
                    new_cases: parseInt(data[lga]["new"]),
                    last_updated: data[lga]["file_processed_date"],
                },
            };
        });
        return template;
    } catch (error) {
        const data = await fetchVicData();
        return data.mapData;
    }
}

async function getSummaryStatistics(data) {
    const summary_statistics = {};
    summary_statistics["totalConfirmed"] = Object.values(data).reduce(
        (total, obj) => parseInt(obj.cases) + total,
        0
    );
    summary_statistics["totalActive"] = Object.values(data).reduce(
        (total, obj) => parseInt(obj.active) + total,
        0
    );
    summary_statistics["totalNew"] = Object.values(data).reduce(
        (total, obj) => parseInt(obj.new) + total,
        0
    );
    summary_statistics["lastUpdated"] = moment(
        Object.values(data)[0].file_processed_date,
        "YYYY-MM-DD"
    ).format("dddd, DD MMM YYYY");
    // Recursive solution to getting back NaNs
    if (
        summary_statistics.totalConfirmed !== summary_statistics.totalConfirmed
    ) {
        const newData = await fetchVicData();
        return newData.summaryStatistics;
    }
    return summary_statistics;
}

export async function fetchVicData() {
    const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9oKYNQhJ6v85dQ9qsybfMfc-eaJ9oKVDZKx-VGUr6szNoTbvsLTzpEaJ3oW_LZTklZbz70hDBUt-d/pub?gid=0&single=true&output=csv"
    );
    const result = await response.body.getReader().read();
    const decoder = new TextDecoder("utf-8");
    const csvData = await decoder.decode(result.value);
    const jsonData = await csvToJSON(csvData);
    const mapData = await updateTemplate(jsonData);
    const summaryStatistics = await getSummaryStatistics(jsonData);

    const data = {
        mapData: mapData,
        summaryStatistics: summaryStatistics,
    };

    return data;
}
