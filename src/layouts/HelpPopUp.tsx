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
                <h3 className={styles.help_popup_title}>Help</h3>
                <ul className={styles.help_popup_description_list}>
                    <li>Manage your projects and project's tasks!</li>
                    <li>Create, edit and delete tasks</li>
                    <li>Move your tasks between the active tab and the completed tab</li>
                    <li>Sorts your tasks alphabetically or by priority</li>
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
