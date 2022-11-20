import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { SortingStatusType, tabSearchInputsType, ProjectType } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";
import InputField from "../../components/InputField/InputField";
import TodosTab from "./TodosTab";

import styles from "./Project.module.scss";

// Local Storage Keys
const LOCAL_STORAGE_TODO_KEY = "TaskManagerApp.Todo";
const LOCAL_STORAGE_SORTING_STATUS_KEY = "TaskManagerApp.SortingStatus";
const LOCAL_STORAGE_TAB_SEARCH_INPUTS_KEY = "TaskManagerApp.TabSearchInputs";
interface PropTypes {
    projects: ProjectType[];
}

export default function Project({ projects }: PropTypes) {
    const { projId } = useParams();
    const projectId: number = Number(projId);
    let project: ProjectType = projects.find(project => project.projectId===projectId) || {projectId: 0, projectTitle: "placeholder", projectCreationDate: "01/01/1970", todoTabs: {activeTodos:[], completedTodos:[]}};

    // Get dispatch functions from great-great-grandparent (App) using useContext
    const projectsDispatch = useContext(ProjectsDispatchContext);

    const [inputTodo, setInputTodo] = useState<string>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TODO_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return "";
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(inputTodo));
    }, [inputTodo]);

    // UseRef hook with typescript
    const inputRef = useRef<HTMLInputElement>(null);

    // State variable <sortingStatus> holds the data relative to the latest sorting status
    const [sortingStatus, setSortingStatus] = useState<SortingStatusType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_SORTING_STATUS_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else
            return {
                activeTab: { sortCondition: "", isAscending: false },
                completedTab: { sortCondition: "", isAscending: false },
            };
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_SORTING_STATUS_KEY, JSON.stringify(sortingStatus));
    }, [sortingStatus]);

    const [tabSearchInputs, setTabSearchInputs] = useState<tabSearchInputsType>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TAB_SEARCH_INPUTS_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return { activeTodosSearchInput: "", completedTodosSearchInput: "" };
    });

    // Function to store new input text in local storage everytime <tabSearchInputs> changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TAB_SEARCH_INPUTS_KEY, JSON.stringify(tabSearchInputs));
    }, [tabSearchInputs]);

    // Function to add a inputTodo to the <todoList>
    function handleSubmitTodoWithReducer(e: React.FormEvent) {
        e.preventDefault();
        if (inputTodo) {
            projectsDispatch({ type: "addTodo", payload: { projectId: project.projectId, todo: inputTodo } });
            setInputTodo("");
        }
        inputRef.current?.blur();
    }

    // Function that computes what to do when a todo item is dropped (after dragging)
    function onDragEnd(result: DropResult) {
        const { source, destination, draggableId } = result;
        if (!destination) return; // If todo isn't dropped in a droppable area, do nothing
        // If a todo is dropped in the same spot, do nothing
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (source.droppableId !== destination.droppableId) {
            // If a todo is dropped in another tab, move it there
            projectsDispatch({
                type: "moveTodo",
                payload: {
                    projectId: project.projectId,
                    id: Number(draggableId),
                    destinationIndex: destination.index,
                    isActive: source.droppableId === "active_todos" ? true : false,
                },
            });
        } else {
            // If a todo is dropped in same same tab but in a different index, change order of current tab accordingly
            projectsDispatch({
                type: "moveTodoInsideTab",
                payload: {
                    projectId: project.projectId,
                    sourceIndex: source.index,
                    destinationIndex: destination.index,
                    isActive: source.droppableId === "active_todos" ? true : false,
                },
            });
        }
    }

    // Function that sorts todo items in a tab alphabetically, by calling the appropriate dispatcher function
    function handleSortAlphabetically(todoTabText: string) {
        if (todoTabText === "active") {
            // If previous sorting was alphabetical and ascending, sort alphabetically and descending
            if (sortingStatus.activeTab.sortCondition === "alphabetical" && sortingStatus.activeTab.isAscending) {
                projectsDispatch({
                    type: "sortTodosAlphabetical",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "descending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { ...sortingStatus.activeTab, isAscending: false } }); // Store latest sorting
            } else {
                // Else sort alphabetically and ascending
                projectsDispatch({
                    type: "sortTodosAlphabetical",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "ascending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { sortCondition: "alphabetical", isAscending: true } }); // Store latest sorting
            }
        } else if (todoTabText === "completed") {
            // If previous sorting was alphabetical and ascending, sort alphabetically and descending
            if (sortingStatus.completedTab.sortCondition === "alphabetical" && sortingStatus.completedTab.isAscending) {
                projectsDispatch({
                    type: "sortTodosAlphabetical",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "descending" },
                });
                setSortingStatus({
                    ...sortingStatus,
                    completedTab: { ...sortingStatus.completedTab, isAscending: false },
                }); // Store latest sorting
            } else {
                // Else sort alphabetically and ascending
                projectsDispatch({
                    type: "sortTodosAlphabetical",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "ascending" },
                });
                setSortingStatus({
                    ...sortingStatus,
                    completedTab: { sortCondition: "alphabetical", isAscending: true },
                }); // Store latest sorting
            }
        } else return;
    }

    // Function that sorts todo items in a tab by priority, by calling the appropriate dispatcher function
    function handleSortByPriority(todoTabText: string) {
        if (todoTabText === "active") {
            // If previous sorting was by priority and ascending, sort by priority and descending
            if (sortingStatus.activeTab.sortCondition === "priority" && sortingStatus.activeTab.isAscending) {
                projectsDispatch({
                    type: "sortTodosByPriority",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "descending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { ...sortingStatus.activeTab, isAscending: false } }); // Store latest sorting
            } else {
                // Else sort by priority and ascending
                projectsDispatch({
                    type: "sortTodosByPriority",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "ascending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { sortCondition: "priority", isAscending: true } }); // Store latest sorting
            }
        } else if (todoTabText === "completed") {
            // If previous sorting was by priority and ascending, sort by priority and descending
            if (sortingStatus.completedTab.sortCondition === "priority" && sortingStatus.completedTab.isAscending) {
                projectsDispatch({
                    type: "sortTodosByPriority",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "descending" },
                });
                setSortingStatus({
                    ...sortingStatus,
                    completedTab: { ...sortingStatus.completedTab, isAscending: false },
                }); // Store latest sorting
            } else {
                // Else sort by priority and ascending
                projectsDispatch({
                    type: "sortTodosByPriority",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "ascending" },
                });
                setSortingStatus({ ...sortingStatus, completedTab: { sortCondition: "priority", isAscending: true } }); // Store latest sorting
            }
        } else return;
    }

    // Function that sets <tabSearchInputs> variable according to which tab's search field was changed
    function handleChangeTabSearchInputs(event: React.ChangeEvent<HTMLInputElement>, tabChanged: string) {
        if (tabChanged === "active") {
            setTabSearchInputs((prevTabSearchInputs) => ({
                ...prevTabSearchInputs,
                activeTodosSearchInput: event.target.value.length<112 ? event.target.value : event.target.value.slice(0, 112)
            }));
        } else if (tabChanged === "completed") {
            setTabSearchInputs((prevTabSearchInputs) => ({
                ...prevTabSearchInputs,
                completedTodosSearchInput: event.target.value.length<112 ? event.target.value : event.target.value.slice(0, 112)
            }));
        } else return;
    }

    function handleChangeTodoInput(event: React.ChangeEvent<HTMLInputElement>) {
        inputTodo.length < 112
            ? setInputTodo(event.target.value)
            : setInputTodo(event.target.value.slice(0, 112));
    }

    // TODO:
    // Make app responsive
    // Improve styling (Improve Help Pop up style)
    // Make error page
    // Fix todo item animation on sorting
    // Fix Home page overflow cutting projects out of frame

    return (
        <div className={styles.project_container}>
            <p className={styles.project_main_title}>{project.projectTitle}</p>
            <InputField
                inputRef={inputRef}
                inputText={inputTodo}
                handleChangeInputText={handleChangeTodoInput}
                handleSubmitForm={handleSubmitTodoWithReducer}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.project_main_content}>
                    <TodosTab
                        projectId={project.projectId}
                        tabName={"active"}
                        tabTodoList={project.todoTabs.activeTodos}
                        tabSearchInput={tabSearchInputs.activeTodosSearchInput}
                        handleChangeTabSearchInputs={handleChangeTabSearchInputs}
                        tabSortingStatus={sortingStatus.activeTab}
                        handleSortAlphabetically={handleSortAlphabetically}
                        handleSortByPriority={handleSortByPriority}
                    />
                    <TodosTab
                        projectId={project.projectId}
                        tabName={"completed"}
                        tabTodoList={project.todoTabs.completedTodos}
                        tabSearchInput={tabSearchInputs.completedTodosSearchInput}
                        handleChangeTabSearchInputs={handleChangeTabSearchInputs}
                        tabSortingStatus={sortingStatus.completedTab}
                        handleSortAlphabetically={handleSortAlphabetically}
                        handleSortByPriority={handleSortByPriority}
                    />
                </div>
            </DragDropContext>
        </div>
    );
}
