import React, { /* useEffect,*/ useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { ProjectType } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";
import styles from "./Home.module.scss";

const LOCAL_STORAGE_PROJECT_TITLE_INPUT_KEY = "TaskManagerApp.projectTitleInput";
interface PropTypes {
    projects: ProjectType[];
}

export default function Home({ projects }: PropTypes) {
    const [projectTitleInput, setProjectTitleInput] = useState(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_PROJECT_TITLE_INPUT_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return "";
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_PROJECT_TITLE_INPUT_KEY, JSON.stringify(projectTitleInput));
    }, [projectTitleInput]);

    const projectTitleInputRef = useRef<HTMLInputElement>(null);

    const projectsDispatch = useContext(ProjectsDispatchContext);

    function handleAddProject(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (projectTitleInput) {
            projectsDispatch({ type: "addProject", payload: { projectTitle: projectTitleInput } });
            projectTitleInputRef.current?.blur();
            setProjectTitleInput("");
        }
    }

    function handleEditProject(projectId: number, newProjectTitle: string) {
        projectsDispatch({ type: "editProject", payload: { projectId: projectId, newProjectTitle: newProjectTitle } });
    }

    function handleDeleteProject(projectId: number) {
        projectsDispatch({ type: "removeProject", payload: { projectId: projectId } });
    }

    return (
        <div className={styles.home_container}>
            <form className={styles.home_project_input_form} onSubmit={(e) => handleAddProject(e)}>
                <input
                    type="input"
                    value={projectTitleInput}
                    onChange={(e) => setProjectTitleInput(e.target.value)}
                    placeholder="Enter a project title"
                    className={styles.home_project_input_field}
                    ref={projectTitleInputRef}
                />
                <button type="submit" className={styles.home_project_input_button}>
                    Create project
                </button>
            </form>

            <div className={styles.home_projects_container}>
                {projects.map((projectItem) => (
                    <div key={projectItem.projectId} className={styles.home_single_project_container}>
                        <Link
                            className={styles.home_single_project_link}
                            to={`/task-manager/project/${projectItem.projectId}`}
                            state={{ project: projectItem }}
                        >
                            {projectItem.projectTitle}
                        </Link>
                        <p className={styles.project_date_text}>{projectItem.projectCreationDate}</p>
                        <div className={styles.project_buttons_container}>
                            <div
                                className={styles.project_button_container}
                                onClick={() => handleEditProject(projectItem.projectId, "hey2")}
                            >
                                <i className="fa-solid fa-pen"></i>
                            </div>
                            <div
                                className={styles.project_button_container}
                                onClick={() => handleDeleteProject(projectItem.projectId)}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
