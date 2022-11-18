import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";
import HelpPopUp from "./HelpPopUp";
import styles from "./Layouts.module.scss";

const LOCAL_STORAGE_IS_DARK_MODE_KEY = "TaskManagerApp.isDarkMode";
const LOCAL_STORAGE_IS_HELP_POPUP_OPEN_KEY = "TaskManagerApp.isHelpPopupOpen";

export default function PageLayout() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_IS_DARK_MODE_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else {
            // Set isDarkMode based on browser's settings
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false;
        }
    });

    const [isHelpPopupOpen, setIsHelpPopupOpen] = useState<boolean>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_IS_HELP_POPUP_OPEN_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return false;
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_IS_DARK_MODE_KEY, JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_IS_HELP_POPUP_OPEN_KEY, JSON.stringify(isHelpPopupOpen));
    }, [isHelpPopupOpen]);

    function toggleIsHelpPopupOpen (event: React.MouseEvent) {
      event.stopPropagation();
      setIsHelpPopupOpen(prevIsHelpPopUpOpen => !prevIsHelpPopUpOpen);
    }

    return (
        <div className={`${styles.app_container} ${isDarkMode ? styles.dark_mode : ""}`}>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsHelpPopupOpen={setIsHelpPopupOpen} />
            <Outlet />
            <Footer />
            <HelpPopUp isHelpPopUpOpen={isHelpPopupOpen} toggleIsHelpPopupOpen={toggleIsHelpPopupOpen}/>
        </div>
    );
}
