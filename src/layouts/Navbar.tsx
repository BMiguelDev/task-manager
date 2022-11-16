import React from "react";
import { Link } from "react-router-dom";

import styles from "./Layouts.module.scss";

export default function Navbar() {
    return (
        <div className={styles.navbar_container}>
            <Link to={'/task-manager'} className={styles.navbar_link}>Projects</Link>
            <span className={styles.heading}>Taskify</span>
            <div className={styles.support_buttons_container}>
                <div className={styles.help_button_container}>Help</div>
                <div className={styles.dark_mode_button_container}>Dark Mode</div>
            </div>
        </div>
    );
}
