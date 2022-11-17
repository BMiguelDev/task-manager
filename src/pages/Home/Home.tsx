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
    function handleAddProject(projectTitle: string = "hey") {
        console.log("here");
        projectsDispatch({ type: "addProject", payload: { projectTitle: projectTitle } });
    }

    return (
        <div className={styles.home_container}>
            {projects.map((projectItem) => (
                <Link
                    key={projectItem.projectId}
                    className={styles.home_project_container}
                    to={`/task-manager/project/${projectItem.projectId}`}
                    state={{ project: projectItem }}
                >
                    {projectItem.projectTitle}
                </Link>
            ))}
            <button onClick={() => handleAddProject("hey")}>Create project</button>
        </div>
    );
}
