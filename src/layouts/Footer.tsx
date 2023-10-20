import React from "react";
import styles from "./Layouts.module.scss";

export default function Footer() {
    const date = new Date();
    let currentYear = date.getFullYear();

    return (
        <footer className={styles.footer_container}>
            <div className={styles.footer_text}>
                <p>Copyright © {currentYear} Bruno Miguel</p>
            </div>
            <div className={styles.footer_icon_container}>
                <a href="https://github.com/BMiguelDev/task-manager" target="_blank" rel="noreferrer">
                    <i className="fa-solid fa-code"></i>
                </a>
                <a href="https://bmigueldev.github.io/brunomiguel/" target="_blank" rel="noreferrer">
                    <i className="fa-solid fa-desktop"></i>
                </a>
                <a href="https://github.com/BMiguelDev" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/miguel--bruno/" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-linkedin"></i>
                </a>
            </div>
        </footer>
    );
}
