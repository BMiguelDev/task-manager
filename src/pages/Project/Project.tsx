import React, { useReducer, useRef, useState, useEffect, createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { Actions, TodoListsType, SortingStatusType, tabSearchInputsType, ProjectType } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";
//import { ProjectsDispatchContext } from "../Home/Home";
import InputField from "./InputField";
import TodosTab from "./TodosTab";

import styles from "./Project.module.scss";

// Local Storage Keys
//const LOCAL_STORAGE_TODOLISTS_KEY = "TaskManagerApp.TodoLists";
const LOCAL_STORAGE_TODO_KEY = "TaskManagerApp.Todo";
const LOCAL_STORAGE_SORTING_STATUS_KEY = "TaskManagerApp.SortingStatus";
const LOCAL_STORAGE_TAB_SEARCH_INPUTS_KEY = "TaskManagerApp.TabSearchInputs";

// /* useContext to pass dispatch function (from useReducer) to deep children */
// export const TodoListsDispatchContext = createContext<React.Dispatch<Actions>>(() => {});

interface PropTypes {
    projects: ProjectType[];
}

export default function Project({ projects }: PropTypes) {
    const { projId } = useParams();
    const projectId: number = Number(projId);
    let project: ProjectType = projects.find(project => project.projectId===projectId) || {projectId: 0, projectTitle: "placeholder", projectCreationDate: "01/01/1970", todoTabs: {activeTodos:[], completedTodos:[]}};

    // Get dispatch functions from grandparent using useContext
    //const todoListsDispatchWithContext = useContext(TodoListsDispatchContext);
    const projectsDispatch = useContext(ProjectsDispatchContext);


    const [inputTodo, setInputTodo] = useState<string>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TODO_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return "";
    });

    // const [todos, setTodos] = useState<Todo[]>([]);  // replaced by useReducer
    // const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(inputTodo));
    }, [inputTodo]);

    // UseRef hook with typescript
    const inputRef = useRef<HTMLInputElement>(null);

    /* Instead of using useState for the todos (todo list), we can use useReducer.
      useReducer allows us to have a state variable, just like useState, but also
      several different functions to modify the state, based on parameters. */
    // const [todoLists, todoListsDispatch] = useReducer(
    //     todoListsReducer,
    //     { activeTodos: [], completedTodos: [] },
    //     reducerVariableInitializer
    // );

    // Initializer function to initialize the <todoList> variable of useReducer with localStorage data
    // function reducerVariableInitializer(): TodoListsType {
    //     // return JSON.parse(localStorage.getItem("LOCAL_STORAGE_TODOLIST_KEY") || "{[]}");
    //     const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TODOLISTS_KEY);
    //     if (localStorageItem) return JSON.parse(localStorageItem);
    //     else return { activeTodos: [], completedTodos: [] };
    // }

    // // Reducer function that conditionally changes <todoList> variable based on the parameters received
    // function todoListsReducer(todoLists: TodoListsType, action: Actions): any {
    //     switch (action.type) {
    //         case "add":
    //             return {
    //                 ...todoLists,
    //                 activeTodos: [
    //                     ...todoLists.activeTodos,
    //                     { id: Date.now(), todo: action.payload.todo, isDone: false, isActive: true },
    //                 ],
    //             };

    //         case "remove":
    //             return action.payload.isActive
    //                 ? {
    //                       ...todoLists,
    //                       activeTodos: todoLists.activeTodos.filter((todo) => todo.id !== action.payload.id),
    //                   }
    //                 : {
    //                       ...todoLists,
    //                       completedTodos: todoLists.completedTodos.filter((todo) => todo.id !== action.payload.id),
    //                   };

    //         case "prioritize":
    //             if (action.payload.isActive) {
    //                 return {
    //                     ...todoLists,
    //                     activeTodos: todoLists.activeTodos.map((todo) => {
    //                         return todo.id === action.payload.id ? { ...todo, isPriority: !todo.isPriority } : todo;
    //                     }),
    //                 };
    //             } else {
    //                 return {
    //                     ...todoLists,
    //                     completedTodos: todoLists.completedTodos.map((todo) => {
    //                         return todo.id === action.payload.id ? { ...todo, isPriority: !todo.isPriority } : todo;
    //                     }),
    //                 };
    //             }
    //         case "edit":
    //             if (action.payload.isActive) {
    //                 return {
    //                     ...todoLists,
    //                     activeTodos: todoLists.activeTodos.map((todo) =>
    //                         todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
    //                     ),
    //                 };
    //             } else {
    //                 return {
    //                     ...todoLists,
    //                     completedTodos: todoLists.completedTodos.map((todo) =>
    //                         todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
    //                     ),
    //                 };
    //             }

    //         case "move":
    //             // Look for todo with provided id in <todoList>, move it to <completedTodoList> and remove it from <todoList>, or vice versa
    //             if (action.payload.isActive) {
    //                 const [todoToMove] = todoLists.activeTodos.filter((todo) => todo.id === action.payload.id);
    //                 todoToMove.isActive = !todoToMove.isActive;
    //                 let newCompletedTodos = todoLists.completedTodos.slice();
    //                 newCompletedTodos.splice(action.payload.destinationIndex, 0, todoToMove);

    //                 return {
    //                     activeTodos: todoLists.activeTodos.filter((todo) => todo.id !== action.payload.id),
    //                     completedTodos: newCompletedTodos,
    //                 };
    //             } else {
    //                 const [todoToMove] = todoLists.completedTodos.filter((todo) => todo.id === action.payload.id);
    //                 todoToMove.isActive = !todoToMove.isActive;
    //                 let newActiveTodos = todoLists.activeTodos.slice();
    //                 newActiveTodos.splice(action.payload.destinationIndex, 0, todoToMove);
    //                 return {
    //                     activeTodos: newActiveTodos,
    //                     completedTodos: todoLists.completedTodos.filter((todo) => todo.id !== action.payload.id),
    //                 };
    //             }

    //         case "moveInsideTab":
    //             const { sourceIndex, destinationIndex } = action.payload;

    //             if (action.payload.isActive) {
    //                 let newActiveTodos = todoLists.activeTodos.slice();
    //                 newActiveTodos.splice(destinationIndex, 0, newActiveTodos.splice(sourceIndex, 1)[0]);
    //                 return {
    //                     ...todoLists,
    //                     activeTodos: newActiveTodos,
    //                 };
    //             } else {
    //                 let newCompletedTodos = todoLists.completedTodos.slice();
    //                 newCompletedTodos.splice(destinationIndex, 0, newCompletedTodos.splice(sourceIndex, 1)[0]);
    //                 return {
    //                     ...todoLists,
    //                     completedTodos: newCompletedTodos,
    //                 };
    //             }

    //         case "sortAlphabetical":
    //             const sortAlphabetical = (a: string, b: string, direction: string): number => {
    //                 if (direction === "ascending") return a < b ? -1 : a > b ? 1 : 0;
    //                 else if (direction === "descending") return a < b ? 1 : a > b ? -1 : 0;
    //                 else return 0;
    //             };
    //             if (action.payload.tabName === "active") {
    //                 let newActiveTodos = todoLists.activeTodos.slice();
    //                 newActiveTodos.sort((a, b) =>
    //                     sortAlphabetical(a.todo.toLowerCase(), b.todo.toLowerCase(), action.payload.direction)
    //                 );
    //                 return {
    //                     ...todoLists,
    //                     activeTodos: newActiveTodos,
    //                 };
    //             } else {
    //                 let newCompletedTodos = todoLists.completedTodos.slice();
    //                 newCompletedTodos.sort((a, b) =>
    //                     sortAlphabetical(a.todo.toLowerCase(), b.todo.toLowerCase(), action.payload.direction)
    //                 );
    //                 return {
    //                     ...todoLists,
    //                     completedTodos: newCompletedTodos,
    //                 };
    //             }

    //         case "sortByPriority":
    //             if (action.payload.tabName === "active") {
    //                 let newActiveTodos = todoLists.activeTodos.slice();
    //                 if (action.payload.direction === "ascending") {
    //                     newActiveTodos.sort((a, b) => (a.isPriority ? -1 : b.isPriority ? 1 : 0));
    //                     return {
    //                         ...todoLists,
    //                         activeTodos: newActiveTodos,
    //                     };
    //                 } else {
    //                     newActiveTodos.sort((a, b) => (a.isPriority ? 1 : b.isPriority ? -1 : 0));
    //                     return {
    //                         ...todoLists,
    //                         activeTodos: newActiveTodos,
    //                     };
    //                 }
    //             } else {
    //                 let newCompletedTodos = todoLists.completedTodos.slice();
    //                 if (action.payload.direction === "ascending") {
    //                     newCompletedTodos.sort((a, b) => (a.isPriority ? -1 : b.isPriority ? 1 : 0));
    //                     return {
    //                         ...todoLists,
    //                         completedTodos: newCompletedTodos,
    //                     };
    //                 } else {
    //                     newCompletedTodos.sort((a, b) => (a.isPriority ? 1 : b.isPriority ? -1 : 0));
    //                     return {
    //                         ...todoLists,
    //                         completedTodos: newCompletedTodos,
    //                     };
    //                 }
    //             }

    //         case "set":
    //             return action.payload.isActive
    //                 ? { ...todoLists, activeTodos: action.payload.newTodoList }
    //                 : { ...todoLists, completedTodos: action.payload.newTodoList };

    //         default:
    //             throw new Error();
    //     }
    // }

    // Save <todoLists> in local Storage each time it is modified
    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_TODOLISTS_KEY, JSON.stringify(todoLists));
    // }, [todoLists]);

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

            //todoListsDispatch({ type: "add", payload: { todo: inputTodo } });
            console.log("IMI HANDLING INPUT");
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
            // todoListsDispatch({
            //     type: "move",
            //     payload: {
            //         id: Number(draggableId),
            //         destinationIndex: destination.index,
            //         isActive: source.droppableId === "active_todos" ? true : false,
            //     },
            // });

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
            // todoListsDispatch({
            //     type: "moveInsideTab",
            //     payload: {
            //         sourceIndex: source.index,
            //         destinationIndex: destination.index,
            //         isActive: source.droppableId === "active_todos" ? true : false,
            //     },
            // });

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
                // todoListsDispatch({
                //     type: "sortAlphabetical",
                //     payload: { tabName: todoTabText, direction: "descending" },
                // });
                projectsDispatch({
                    type: "sortTodosAlphabetical",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "descending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { ...sortingStatus.activeTab, isAscending: false } }); // Store latest sorting
            } else {
                // Else sort alphabetically and ascending
                // todoListsDispatch({
                //     type: "sortAlphabetical",
                //     payload: { tabName: todoTabText, direction: "ascending" },
                // });
                projectsDispatch({
                    type: "sortTodosAlphabetical",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "ascending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { sortCondition: "alphabetical", isAscending: true } }); // Store latest sorting
            }
        } else if (todoTabText === "completed") {
            // If previous sorting was alphabetical and ascending, sort alphabetically and descending
            if (sortingStatus.completedTab.sortCondition === "alphabetical" && sortingStatus.completedTab.isAscending) {
                // todoListsDispatch({
                //     type: "sortAlphabetical",
                //     payload: { tabName: todoTabText, direction: "descending" },
                // });
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
                // todoListsDispatch({
                //     type: "sortAlphabetical",
                //     payload: { tabName: todoTabText, direction: "ascending" },
                // });
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
                // todoListsDispatch({
                //     type: "sortByPriority",
                //     payload: { tabName: todoTabText, direction: "descending" },
                // });
                projectsDispatch({
                    type: "sortTodosByPriority",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "descending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { ...sortingStatus.activeTab, isAscending: false } }); // Store latest sorting
            } else {
                // Else sort by priority and ascending
                // todoListsDispatch({
                //     type: "sortByPriority",
                //     payload: { tabName: todoTabText, direction: "ascending" },
                // });
                projectsDispatch({
                    type: "sortTodosByPriority",
                    payload: { projectId: project.projectId, tabName: todoTabText, direction: "ascending" },
                });
                setSortingStatus({ ...sortingStatus, activeTab: { sortCondition: "priority", isAscending: true } }); // Store latest sorting
            }
        } else if (todoTabText === "completed") {
            // If previous sorting was by priority and ascending, sort by priority and descending
            if (sortingStatus.completedTab.sortCondition === "priority" && sortingStatus.completedTab.isAscending) {
                // todoListsDispatch({
                //     type: "sortByPriority",
                //     payload: { tabName: todoTabText, direction: "descending" },
                // });
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
                // todoListsDispatch({
                //     type: "sortByPriority",
                //     payload: { tabName: todoTabText, direction: "ascending" },
                // });
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
                activeTodosSearchInput: event.target.value,
            }));
        } else if (tabChanged === "completed") {
            setTabSearchInputs((prevTabSearchInputs) => ({
                ...prevTabSearchInputs,
                completedTodosSearchInput: event.target.value,
            }));
        } else return;
    }

    // TODO:
    // Make main state variable an array of more (possibly) more than 2 tabs. Add button to add new tab.
    // Make button in each todo to move to other tab
    // Make app responsive
    // Improve styling
    // Refactor most state into Home component

    return (
        <div className={styles.project_container}>
            {/* <h1>{projectId}</h1> */}
            <p>{project.projectId}</p>
            <InputField
                inputRef={inputRef}
                inputTodo={inputTodo}
                setInputTodo={setInputTodo}
                handleSubmitTodoWithReducer={handleSubmitTodoWithReducer}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.main_content}>
                    <TodosTab
                        projectId={project.projectId}
                        tabName={"active"}
                        //TodoListsDispatchContext={TodoListsDispatchContext}
                        //ProjectsDispatchContext={ProjectsDispatchContext}
                        // tabTodoList={todoLists.activeTodos}
                        tabTodoList={project.todoTabs.activeTodos}
                        //tabTodoList={[]}
                        // todoListsDispatch={todoListsDispatch}
                        //projectsDispatch={projectsDispatch}
                        tabSearchInput={tabSearchInputs.activeTodosSearchInput}
                        handleChangeTabSearchInputs={handleChangeTabSearchInputs}
                        tabSortingStatus={sortingStatus.activeTab}
                        handleSortAlphabetically={handleSortAlphabetically}
                        handleSortByPriority={handleSortByPriority}
                    />
                    <TodosTab
                        projectId={project.projectId}
                        tabName={"completed"}
                        //TodoListsDispatchContext={TodoListsDispatchContext}
                        //ProjectsDispatchContext={ProjectsDispatchContext}
                        // tabTodoList={todoLists.completedTodos}
                        tabTodoList={project.todoTabs.completedTodos}
                        //tabTodoList={[]}
                        // todoListsDispatch={todoListsDispatch}
                        //projectsDispatch={projectsDispatch}
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
