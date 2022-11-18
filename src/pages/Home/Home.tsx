import React, { useContext, useEffect, useRef, useState } from "react";

import { ProjectType } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";
import ProjectItem from "./ProjectItem";

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
                    Add
                </button>
            </form>

            <div className={styles.home_projects_container}>
                {projects.map((projectItem) => (
                    <ProjectItem key={projectItem.projectId} projectItem={projectItem} />
                ))}
            </div>
        </div>
    );
}
