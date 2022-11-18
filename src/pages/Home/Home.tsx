import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Actions, ProjectType } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";
import styles from "./Home.module.scss";

interface PropTypes {
    projects: ProjectType[];
}

export default function Home({ projects }: PropTypes) {
    const projectsDispatch = useContext(ProjectsDispatchContext);

    // TODO: remove projectTitle as having a value by default and pass the desired one
    function handleAddProject(projectTitle: string) {
        console.log("here");
        projectsDispatch({ type: "addProject", payload: { projectTitle: projectTitle } });
    }

    function handleEditProject(projectId: number,  newProjectTitle: string) {
        projectsDispatch({ type: "editProject", payload: { projectId: projectId, newProjectTitle: newProjectTitle } });
    }

    function handleDeleteProject(projectId: number) {
        projectsDispatch({ type: "removeProject", payload: { projectId: projectId } });
    }

    return (
        <div className={styles.home_container}>
            <button className={styles.home_add_button} onClick={() => handleAddProject("heya")}>Create project</button>
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
