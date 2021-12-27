import React from "react";
import "./Drawer.scss";

const Drawer = (props) => {
    return (
        <div id="drawer" className={`drawer ${props.open ? "open" : ""}`}>
            <div className="drawer-inner">{props.content}</div>
        </div>
    );
};

export default Drawer;
