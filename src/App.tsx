import React, { createContext, useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Actions, ProjectType } from "./models/model";
import PageLayout from "./layouts/PageLayout";
import Project from "./pages/Project/Project";
import Home from "./pages/Home/Home";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { projectArray } from "./data/Projects";
import "./App.scss";

const LOCAL_STORAGE_PROJECTS_KEY = "TaskManagerApp.Projects";

/* useContext to pass dispatch function (from useReducer) to deep children */
export const ProjectsDispatchContext = createContext<React.Dispatch<Actions>>(() => {});

const App: React.FC = () => {
    // const [todos, setTodos] = useState<Todo[]>([]);  // replaced by useReducer
    // const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

    /* Instead of using useState for the todos (todo list), we can use useReducer.
      useReducer allows us to have a state variable, just like useState, but also
      several different functions to modify the state, based on parameters. */
    const [projects, projectsDispatch] = useReducer(projectsReducer, [], reducerVariableInitializer);

    // Initializer function to initialize the <todoList> variable of useReducer with localStorage data
    function reducerVariableInitializer(): ProjectType[] {
        // return JSON.parse(localStorage.getItem("LOCAL_STORAGE_TODOLIST_KEY") || "{[]}");
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return projectArray;
    }

    // Reducer function that conditionally changes <todoList> variable based on the parameters received
    function projectsReducer(projects: ProjectType[], action: Actions): ProjectType[] {
        switch (action.type) {
            case "addProject": {
                const todayDate = new Date();
                const todayYear = todayDate.getFullYear();
                let todayMonth: number | string = todayDate.getMonth() + 1;
                let todayDay: number | string = todayDate.getDate();
                if (todayDay < 10) todayDay = "0" + todayDay;
                if (todayMonth < 10) todayMonth = "0" + todayMonth;
                const formattedTodayDate = todayDay + "/" + todayMonth + "/" + todayYear;

                const newProject: ProjectType = {
                    projectId: Date.now(),
                    projectTitle: action.payload.projectTitle,
                    projectCreationDate: formattedTodayDate,
                    todoTabs: {
                        activeTodos: [],
                        completedTodos: [],
                    },
                };
                return [...projects, newProject];
            }

            case "editProject": {
                const targetProjectIndex = projects.findIndex(
                    (project) => project.projectId === action.payload.projectId
                );
                let newProjects = [...projects];
                newProjects[targetProjectIndex].projectTitle = action.payload.newProjectTitle;
                return newProjects;
            }

            case "removeProject": {
                let newProjects = [...projects];
                return newProjects.filter((project) => project.projectId !== action.payload.projectId);
            }

            case "addTodo":
                console.log("IM IN addTodo function");
                const targetProjectIndex = projects.findIndex(
                    (project) => project.projectId === action.payload.projectId
                );
                console.log(targetProjectIndex);
                let newProjects = [...projects];
                console.log(newProjects);
                newProjects[targetProjectIndex].todoTabs.activeTodos.push({
                    id: Date.now(),
                    todo: action.payload.todo,
                    isPriority: false,
                    isActive: true,
                });
                console.log(newProjects);
                return newProjects;

            case "removeTodo":
                if (action.payload.isActive) {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.activeTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.activeTodos.filter((todo) => todo.id !== action.payload.id);
                    return newProjects;
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.completedTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.completedTodos.filter((todo) => todo.id !== action.payload.id);
                    return newProjects;
                }

            case "prioritizeTodo":
                if (action.payload.isActive) {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.activeTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.activeTodos.map((todo) => {
                        return todo.id === action.payload.id ? { ...todo, isPriority: !todo.isPriority } : todo;
                    });
                    return newProjects;
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.completedTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.completedTodos.map((todo) => {
                        return todo.id === action.payload.id ? { ...todo, isPriority: !todo.isPriority } : todo;
                    });
                    return newProjects;
                }
            case "editTodo":
                if (action.payload.isActive) {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.activeTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.activeTodos.map((todo) =>
                        todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
                    );
                    return newProjects;
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.completedTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.completedTodos.map((todo) =>
                        todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
                    );
                    return newProjects;
                }

            case "moveTodo":
                // Look for todo with provided id in <todoList>, move it to <completedTodoList> and remove it from <todoList>, or vice versa
                if (action.payload.isActive) {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    const [todoToMove] = newProjects[targetProjectIndex].todoTabs.activeTodos.filter(
                        (todo) => todo.id === action.payload.id
                    );
                    todoToMove.isActive = !todoToMove.isActive;
                    let newCompletedTodos = newProjects[targetProjectIndex].todoTabs.completedTodos.slice();
                    newCompletedTodos.splice(action.payload.destinationIndex, 0, todoToMove);

                    newProjects[targetProjectIndex].todoTabs.activeTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.activeTodos.filter((todo) => todo.id !== action.payload.id);
                    newProjects[targetProjectIndex].todoTabs.completedTodos = newCompletedTodos;
                    return newProjects;
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    const [todoToMove] = newProjects[targetProjectIndex].todoTabs.completedTodos.filter(
                        (todo) => todo.id === action.payload.id
                    );
                    todoToMove.isActive = !todoToMove.isActive;
                    let newActiveTodos = newProjects[targetProjectIndex].todoTabs.activeTodos.slice();
                    newActiveTodos.splice(action.payload.destinationIndex, 0, todoToMove);

                    newProjects[targetProjectIndex].todoTabs.completedTodos = newProjects[
                        targetProjectIndex
                    ].todoTabs.completedTodos.filter((todo) => todo.id !== action.payload.id);
                    newProjects[targetProjectIndex].todoTabs.activeTodos = newActiveTodos;
                    return newProjects;
                }

            case "moveTodoInsideTab":
                const { sourceIndex, destinationIndex } = action.payload;

                if (action.payload.isActive) {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    let newActiveTodos = newProjects[targetProjectIndex].todoTabs.activeTodos.slice();
                    newActiveTodos.splice(destinationIndex, 0, newActiveTodos.splice(sourceIndex, 1)[0]);

                    newProjects[targetProjectIndex].todoTabs.activeTodos = newActiveTodos;
                    return newProjects;
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    let newCompletedTodos = newProjects[targetProjectIndex].todoTabs.completedTodos.slice();
                    newCompletedTodos.splice(destinationIndex, 0, newCompletedTodos.splice(sourceIndex, 1)[0]);

                    newProjects[targetProjectIndex].todoTabs.completedTodos = newCompletedTodos;
                    return newProjects;
                }

            case "sortTodosAlphabetical":
                const sortAlphabetical = (a: string, b: string, direction: string): number => {
                    if (direction === "ascending") return a < b ? -1 : a > b ? 1 : 0;
                    else if (direction === "descending") return a < b ? 1 : a > b ? -1 : 0;
                    else return 0;
                };
                if (action.payload.tabName === "active") {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    let newActiveTodos = newProjects[targetProjectIndex].todoTabs.activeTodos.slice();
                    newActiveTodos.sort((a, b) =>
                        sortAlphabetical(a.todo.toLowerCase(), b.todo.toLowerCase(), action.payload.direction)
                    );

                    newProjects[targetProjectIndex].todoTabs.activeTodos = newActiveTodos;
                    return newProjects;
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    let newCompletedTodos = newProjects[targetProjectIndex].todoTabs.completedTodos.slice();
                    newCompletedTodos.sort((a, b) =>
                        sortAlphabetical(a.todo.toLowerCase(), b.todo.toLowerCase(), action.payload.direction)
                    );

                    newProjects[targetProjectIndex].todoTabs.completedTodos = newCompletedTodos;
                    return newProjects;
                }

            case "sortTodosByPriority":
                if (action.payload.tabName === "active") {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    let newActiveTodos = newProjects[targetProjectIndex].todoTabs.activeTodos.slice();

                    if (action.payload.direction === "ascending") {
                        newActiveTodos.sort((a, b) => (a.isPriority ? -1 : b.isPriority ? 1 : 0));
                        newProjects[targetProjectIndex].todoTabs.activeTodos = newActiveTodos;
                        return newProjects;
                    } else {
                        newActiveTodos.sort((a, b) => (a.isPriority ? 1 : b.isPriority ? -1 : 0));
                        newProjects[targetProjectIndex].todoTabs.activeTodos = newActiveTodos;
                        return newProjects;
                    }
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    let newCompletedTodos = newProjects[targetProjectIndex].todoTabs.completedTodos.slice();

                    if (action.payload.direction === "ascending") {
                        newCompletedTodos.sort((a, b) => (a.isPriority ? -1 : b.isPriority ? 1 : 0));
                        newProjects[targetProjectIndex].todoTabs.completedTodos = newCompletedTodos;
                        return newProjects;
                    } else {
                        newCompletedTodos.sort((a, b) => (a.isPriority ? 1 : b.isPriority ? -1 : 0));
                        newProjects[targetProjectIndex].todoTabs.completedTodos = newCompletedTodos;
                        return newProjects;
                    }
                }

            case "setTodoTab":
                if (action.payload.isActive) {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.activeTodos = action.payload.newTodoList;
                    return newProjects;
                } else {
                    const targetProjectIndex = projects.findIndex(
                        (project) => project.projectId === action.payload.projectId
                    );
                    let newProjects = [...projects];
                    newProjects[targetProjectIndex].todoTabs.completedTodos = action.payload.newTodoList;
                    return newProjects;
                }

            default:
                throw new Error();
        }
    }

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    }, [projects]);

    console.log("App projects", projects);

    return (
        <BrowserRouter>
            <ProjectsDispatchContext.Provider value={projectsDispatch}>
                <Routes>
                    <Route path="/task-manager" element={<PageLayout />}>
                        <Route index element={<Home projects={projects} />} />
                        <Route path="/task-manager/project/:projId" element={<Project projects={projects} />} />
                        <Route path="/task-manager/*" element={<ErrorPage />} />
                    </Route>
                </Routes>
            </ProjectsDispatchContext.Provider>
        </BrowserRouter>
    );
};
export default App;
