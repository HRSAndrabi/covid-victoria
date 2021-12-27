import React from "react";
import { useState } from "react";
import "./ControlPanel.scss";

const ControlPanel = (props) => {
    const [selected, setSelected] = useState("confirmed_cases");

    const clickHandler = (event) => {
        const value = event.target.dataset.value;
        setSelected(value);
        props.onDisplayVariableChange(value);
    };

    return (
        <div className="control-panel">
            <div className="control-panel__header">COVID-19 in Victoria</div>
            <ul className="pills">
                <li
                    className={`display-variable ${
                        selected === "confirmed_cases" ? "selected" : ""
                    }`}
                    data-value="confirmed_cases"
                    onClick={clickHandler}
                >
                    Confirmed
                </li>
                <li
                    className={`display-variable ${
                        selected === "active_cases" ? "selected" : ""
                    }`}
                    data-value="active_cases"
                    onClick={clickHandler}
                >
                    Active
                </li>
                <li
                    className={`display-variable ${
                        selected === "new_cases" ? "selected" : ""
                    }`}
                    data-value="new_cases"
                    onClick={clickHandler}
                >
                    New
                </li>
            </ul>
            <table className="summary-table">
                <tbody>
                    <tr>
                        <td className="left">Total confirmed:</td>
                        <td className="right">10</td>
                    </tr>
                    <tr>
                        <td className="left">Total active:</td>
                        <td className="right">10</td>
                    </tr>
                    <tr>
                        <td className="left">New cases:</td>
                        <td className="right">+10</td>
                    </tr>
                    <tr>
                        <td className="left">{`\u{1F3E1} Overseas`}</td>
                        <td className="right">+10</td>
                    </tr>
                    <tr>
                        <td className="left">{`\u{1F30D} Overseas:`}</td>
                        <td className="right">+10</td>
                    </tr>
                </tbody>
            </table>
            <div className="attribution">
                {" "}
                Visualized by{" "}
                <a
                    href="https://twitter.com/hrs_andrabi"
                    target="_blank"
                    rel="noreferrer"
                >
                    @hrs_andrabi
                </a>
                . Available on{" "}
                <a
                    href="https://github.com/cheeaun/exploretrees-sg"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>
                . <br /> Data from{" "}
                <a
                    href="https://www.dhhs.vic.gov.au/"
                    target="_blank"
                    rel="noreferrer"
                >
                    dhhs.vic.gov.au
                </a>
                ,{" "}
                <a href="https://data.gov.au/" target="_blank" rel="noreferrer">
                    data.gov.au
                </a>
                . <br />
                Mapping{" "}
                <a
                    href="https://www.mapbox.com/about/maps/"
                    target="_blank"
                    rel="noreferrer"
                >
                    © Mapbox
                </a>{" "}
                <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                >
                    © OpenStreetMap.
                </a>{" "}
            </div>
        </div>
    );
};

export default ControlPanel;
