import React, { useEffect, useRef, useState } from "react";

import styles from "./Layouts.module.scss";

interface PropTypes {
    isHelpPopUpOpen: boolean;
    toggleIsHelpPopupOpen: (event: React.MouseEvent) => void;
}

export default function HelpPopUp({ isHelpPopUpOpen, toggleIsHelpPopupOpen }: PropTypes) {
    const [isRender, setIsRender] = useState<boolean>(isHelpPopUpOpen);

    useEffect(() => {
        if (isHelpPopUpOpen) setIsRender(true);
    }, [isHelpPopUpOpen]);

    const helpPopupContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkClickToExitHelp = (event: any) => {
            if (isHelpPopUpOpen) {
                if (helpPopupContainerRef.current && !helpPopupContainerRef.current?.contains(event.target)) {
                    toggleIsHelpPopupOpen(event);
                }
            }
        };

        window.addEventListener("click", checkClickToExitHelp);

        return () => {
            window.removeEventListener("click", checkClickToExitHelp);
        };
    }, [isHelpPopUpOpen, toggleIsHelpPopupOpen]);

    function handleAnimationEnd() {
        if (!isHelpPopUpOpen) setIsRender(false);
    }

    return isRender ? (
        <div className={styles.help_pop_up_wrapper}>
            <div
                ref={helpPopupContainerRef}
                className={`${styles.help_popup_container} ${isHelpPopUpOpen ? "" : styles.help_popup_container_hide}`}
                onAnimationEnd={handleAnimationEnd}
            >
                <h3 className={styles.help_popup_title}>How to Use</h3>
                <h6 className={styles.help_popup_subtitle}>Manage your projects and tasks!</h6>
                <ul className={styles.help_popup_description_list}>
                    <li>Create, edit and delete projects and tasks</li>
                    <li>Assign tasks with higher priority</li>
                    <li>Drag your tasks to reorder them or to move them between tabs</li>
                    <li>Sort your tasks alphabetically or by priority</li>
                    <li>Search for tasks inside each tab</li>
                </ul>
                <button className={styles.help_popup_exit_button} onClick={(e) => toggleIsHelpPopupOpen(e)}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    ) : (
        <div className={styles.help_pop_up_hidden} />
    );
}
