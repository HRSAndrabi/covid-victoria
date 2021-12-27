import template from "./template.json";

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
        result[obj["LGADisplay"]] = obj;
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
        return data;
    }
}

export async function fetchVicData() {
    const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9oKYNQhJ6v85dQ9qsybfMfc-eaJ9oKVDZKx-VGUr6szNoTbvsLTzpEaJ3oW_LZTklZbz70hDBUt-d/pub?gid=0&single=true&output=csv"
    );
    const result = await response.body.getReader().read();
    const decoder = new TextDecoder("utf-8");
    const csvData = await decoder.decode(result.value);
    const jsonData = await csvToJSON(csvData);
    const data = await updateTemplate(jsonData);

    return data;
}
