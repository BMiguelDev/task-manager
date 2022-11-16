import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../models/model";

import styles from "./Home.module.scss";

const LOCAL_STORAGE_PROJECTS_KEY = "TaskManagerApp.Projects";

export default function Home() {
    const [projects, setProjects] = useState<Project[]>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return [];
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    }, [projects]);


    function handleAddProject() {
        const newProject: Project = {
          projectId: projects.length>0 ? (projects[projects.length-1].projectId+1) : 1,
          projectTitle:"Example",
          todoTabs: {
            activeTodos: [],
            completedTodos: []
          }
        }
        setProjects(prevProjects => [...prevProjects, newProject]);
    }

    return (
        <div className={styles.home_container}>
            {projects.map((projectItem) => (
                <Link
                    key={projectItem.projectId}
                    className={styles.home_project_container}
                    to={`/task-manager/project/${projectItem.projectId}`}
                >
                    {projectItem.projectTitle}
                </Link>
            ))}
            <button onClick={handleAddProject}>Create project</button>
        </div>
    );
}
