import React from "react";
import { useState } from "react";
import "./Drawer.scss";
import { BsDashLg } from "react-icons/bs";

const Drawer = (props) => {
    let open = props.open;
    const toggleOpen = () => {
        open = false;
    };

    return (
        <div id="drawer" className={`drawer ${open ? "open" : ""}`}>
            <div className="drawer-inner">
                <div className="drawer__control">
                    <BsDashLg onClick={toggleOpen} />
                </div>
                {props.content}
            </div>
        </div>
    );
};

export default Drawer;
