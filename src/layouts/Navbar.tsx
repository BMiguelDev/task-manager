import React from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./Layouts.module.scss";

interface PropTypes {
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    setIsHelpPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ isDarkMode, setIsDarkMode, setIsHelpPopupOpen }: PropTypes) {
    const location = useLocation();

    return (
        <div className={styles.navbar_container}>
            <Link
                to={"/task-manager"}
                className={`${styles.navbar_link} ${
                    location.pathname === "/task-manager" ? styles.navbar_link_hidden : ""
                }`}
            >
                <i className="fa-solid fa-left-long"></i>
                <p>Back to Projects</p>
            </Link>
            <span className={styles.heading}>Taskify</span>
            <div className={styles.support_buttons_container}>
                <div
                    className={styles.support_button_icon_container}
                    onClick={() => setIsHelpPopupOpen((prevIsHelpPopupOpen) => !prevIsHelpPopupOpen)}
                >
                    <i className="fa-solid fa-circle-info"></i>
                </div>
                <div
                    className={styles.support_button_icon_container}
                    onClick={() => setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode)}
                >
                    {isDarkMode ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
                </div>
            </div>
        </div>
    );
}
