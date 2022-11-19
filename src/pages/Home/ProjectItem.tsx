import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { ProjectType } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";

import styles from "./Home.module.scss";

interface PropTypes {
    projectItem: ProjectType;
}

export default function ProjectItem({ projectItem }: PropTypes) {
    const [isProjectTitleEditMode, setIsProjectTitleEditMode] = useState<boolean>(false);
    const [projectEditedTitle, setProjectEditedTitle] = useState<string>(projectItem.projectTitle);

    const editTnputRef = useRef<HTMLInputElement>(null);

    // Get dispatch function using useContext
    const projectsDispatch = useContext(ProjectsDispatchContext);

    function handleToggleEditMode() {
        setIsProjectTitleEditMode((prevIsProjectTitleEditMode) => !prevIsProjectTitleEditMode);
        setProjectEditedTitle(projectItem.projectTitle);
    }

    useEffect(() => {
        editTnputRef.current?.focus();
    }, [isProjectTitleEditMode]);

    function handleEditTitleAndToggle(event: React.FormEvent): void {
        event.preventDefault();
        if (projectEditedTitle) {
            projectsDispatch({
                type: "editProject",
                payload: { projectId: projectItem.projectId, newProjectTitle: projectEditedTitle },
            });
            handleToggleEditMode();
        }
    }

    function handleDeleteProject() {
        projectsDispatch({ type: "removeProject", payload: { projectId: projectItem.projectId } });
    }

    return (
        <div className={styles.home_single_project_container}>
            {isProjectTitleEditMode ? (
                <form onSubmit={(e) => handleEditTitleAndToggle(e)}>
                    <input
                        type="text"
                        placeholder="Enter new project title"
                        value={projectEditedTitle}
                        onChange={(e) => setProjectEditedTitle(e.target.value)}
                        ref={editTnputRef}
                    />
                    <button type="submit">Go</button>
                </form>
            ) : (
                <Link
                    className={styles.home_single_project_link}
                    to={`/task-manager/project/${projectItem.projectId}`}
                    state={{
                        project: projectItem,
                    }}
                >
                    <h4 className={styles.project_title_text}>{projectItem.projectTitle}</h4>
                    <p className={styles.project_date_text}>{projectItem.projectCreationDate}</p>
                </Link>
            )}
            <div className={styles.project_buttons_container}>
                <div className={styles.project_button_container} onClick={handleToggleEditMode}>
                    <i className="fa-solid fa-pen"></i>
                </div>
                <div className={styles.project_button_container} onClick={handleDeleteProject}>
                    <i className="fa-solid fa-trash"></i>
                </div>
            </div>
        </div>
    );
}
