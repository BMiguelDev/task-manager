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

    console.log(location);

    return (
        <header className={styles.navbar_container}>
            <span className={styles.heading}>Task Manager</span>
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
            <Link
                to={"/task-manager"}
                className={`${styles.navbar_link} ${
                    RegExp('/task-manager/project/[0-9]+').test(location.pathname) ? "" : styles.navbar_link_hidden
                }`}
            >
                <i className="fa-solid fa-left-long"></i>
                <p>Back to Projects</p>
            </Link>
        </header>
    );
}
