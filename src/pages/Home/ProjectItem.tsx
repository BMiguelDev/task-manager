import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

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

    function handleChangeProjectEditedTitle(event: React.ChangeEvent<HTMLInputElement>) {
        projectEditedTitle.length < 56
            ? setProjectEditedTitle(event.target.value)
            : setProjectEditedTitle(event.target.value.slice(0, 56));
    }

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
                <form
                    className={styles.home_single_project_edit_container}
                    onSubmit={(e) => handleEditTitleAndToggle(e)}
                >
                    <input
                        type="text"
                        placeholder="Enter new project title"
                        className={styles.home_single_project_edit_input}
                        value={projectEditedTitle}
                        onChange={handleChangeProjectEditedTitle}
                        ref={editTnputRef}
                    />
                    <button type="submit" className={styles.home_single_project_edit_button}>
                        Go
                    </button>
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
                <Tooltip title="Edit" placement="left">
                    <div className={styles.project_button_container} onClick={handleToggleEditMode}>
                        <i className="fa-solid fa-pen"></i>
                    </div>
                </Tooltip>
                <Tooltip title="Delete" placement="right">
                    <div className={styles.project_button_container} onClick={handleDeleteProject}>
                        <i className="fa-solid fa-trash"></i>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
