import React, { useContext, useEffect, useRef, useState } from "react";

import { ProjectType } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";
import ProjectItem from "./ProjectItem";
import InputField from "../../components/InputField/InputField";

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

    function handleChangeProjectTitleInput(event: React.ChangeEvent<HTMLInputElement>) {
        projectTitleInput.length < 56
            ? setProjectTitleInput(event.target.value)
            : setProjectTitleInput(event.target.value.slice(0, 56));
    }

    function handleAddProject(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (projectTitleInput) {
            projectsDispatch({ type: "addProject", payload: { projectTitle: projectTitleInput } });
            projectTitleInputRef.current?.blur();
            setProjectTitleInput("");
        }
    }

    return (
        <main className={styles.home_container}>
            <h2 className={styles.home_projects_main_title}>My Projects</h2>
            <InputField inputText={projectTitleInput} inputRef={projectTitleInputRef} handleSubmitForm={handleAddProject} handleChangeInputText={handleChangeProjectTitleInput}/>
            <div className={styles.home_projects_container}>
                {projects.map((projectItem) => (
                    <ProjectItem key={projectItem.projectId} projectItem={projectItem} />
                ))}
            </div>
        </main>
    );
}
