import React, { useReducer, useRef, useState, useEffect, createContext } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import InputField from "./components/InputField/InputField";
import { Actions, Todo, TodoListsType, SortingStatusType, tabSearchInputsType } from "./model";
import TodoList from "./components/TodosList/TodoList";
import Footer from "./components/Footer/Footer";
import "./App.scss";

// Local Storage Keys
const LOCAL_STORAGE_TODOLISTS_KEY = "TaskManagerApp.TodoLists";
const LOCAL_STORAGE_TODO_KEY = "TaskManagerApp.Todo";
const LOCAL_STORAGE_SORTING_STATUS_KEY = "TaskManagerApp.SortingStatus";
const LOCAL_STORAGE_TAB_SEARCH_INPUTS_KEY = "TaskManagerApp.TabSearchInputs";

/* useContext to pass dispatch function (from useReducer) to deep children */
export const TodoListsDispatchContext = createContext<React.Dispatch<Actions>>(() => {});

const App: React.FC = () => {
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
    const [todoLists, todoListsDispatch] = useReducer(
        todoListsReducer,
        { activeTodos: [], completedTodos: [] },
        reducerVariableInitializer
    );

    // Initializer function to initialize the <todoList> variable of useReducer with localStorage data
    function reducerVariableInitializer(): TodoListsType {
        // return JSON.parse(localStorage.getItem("LOCAL_STORAGE_TODOLIST_KEY") || "{[]}");
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TODOLISTS_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return { activeTodos: [], completedTodos: [] };
    }

    // Reducer function that conditionally changes <todoList> variable based on the parameters received
    function todoListsReducer(todoLists: TodoListsType, action: Actions): any {
        switch (action.type) {
            case "add":
                return {
                    ...todoLists,
                    activeTodos: [
                        ...todoLists.activeTodos,
                        { id: Date.now(), todo: action.payload.todo, isDone: false, isActive: true },
                    ],
                };

            case "remove":
                return action.payload.isActive
                    ? {
                          ...todoLists,
                          activeTodos: todoLists.activeTodos.filter((todo) => todo.id !== action.payload.id),
                      }
                    : {
                          ...todoLists,
                          completedTodos: todoLists.completedTodos.filter((todo) => todo.id !== action.payload.id),
                      };

            case "prioritize":
                if (action.payload.isActive) {
                    return {
                        ...todoLists,
                        activeTodos: todoLists.activeTodos.map((todo) => {
                            return todo.id === action.payload.id ? { ...todo, isPriority: !todo.isPriority } : todo;
                        }),
                    };
                } else {
                    return {
                        ...todoLists,
                        completedTodos: todoLists.completedTodos.map((todo) => {
                            return todo.id === action.payload.id ? { ...todo, isPriority: !todo.isPriority } : todo;
                        }),
                    };
                }
            case "edit":
                if (action.payload.isActive) {
                    return {
                        ...todoLists,
                        activeTodos: todoLists.activeTodos.map((todo) =>
                            todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
                        ),
                    };
                } else {
                    return {
                        ...todoLists,
                        completedTodos: todoLists.completedTodos.map((todo) =>
                            todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
                        ),
                    };
                }

            case "move":
                // Look for todo with provided id in <todoList>, move it to <completedTodoList> and remove it from <todoList>, or vice versa
                if (action.payload.isActive) {
                    const [todoToMove] = todoLists.activeTodos.filter((todo) => todo.id === action.payload.id);
                    todoToMove.isActive = !todoToMove.isActive;
                    let newCompletedTodos = todoLists.completedTodos.slice();
                    newCompletedTodos.splice(action.payload.destinationIndex, 0, todoToMove);

                    return {
                        activeTodos: todoLists.activeTodos.filter((todo) => todo.id !== action.payload.id),
                        completedTodos: newCompletedTodos,
                    };
                } else {
                    const [todoToMove] = todoLists.completedTodos.filter((todo) => todo.id === action.payload.id);
                    todoToMove.isActive = !todoToMove.isActive;
                    let newActiveTodos = todoLists.activeTodos.slice();
                    newActiveTodos.splice(action.payload.destinationIndex, 0, todoToMove);
                    return {
                        activeTodos: newActiveTodos,
                        completedTodos: todoLists.completedTodos.filter((todo) => todo.id !== action.payload.id),
                    };
                }

            case "moveInsideTab":
                const { sourceIndex, destinationIndex } = action.payload;

                if (action.payload.isActive) {
                    let newActiveTodos = todoLists.activeTodos.slice();
                    newActiveTodos.splice(destinationIndex, 0, newActiveTodos.splice(sourceIndex, 1)[0]);
                    return {
                        ...todoLists,
                        activeTodos: newActiveTodos,
                    };
                } else {
                    let newCompletedTodos = todoLists.completedTodos.slice();
                    newCompletedTodos.splice(destinationIndex, 0, newCompletedTodos.splice(sourceIndex, 1)[0]);
                    return {
                        ...todoLists,
                        completedTodos: newCompletedTodos,
                    };
                }

            case "sortAlphabetical":
                if (action.payload.tabName === "active") {
                    let newActiveTodos = todoLists.activeTodos.slice();
                    if (action.payload.direction === "ascending") {
                        newActiveTodos.sort((a, b) => (a.todo < b.todo ? -1 : a.todo > b.todo ? 1 : 0));
                        return {
                            ...todoLists,
                            activeTodos: newActiveTodos,
                        };
                    } else {
                        newActiveTodos.sort((a, b) => (a.todo < b.todo ? 1 : a.todo > b.todo ? -1 : 0));
                        return {
                            ...todoLists,
                            activeTodos: newActiveTodos,
                        };
                    }
                } else {
                    let newCompletedTodos = todoLists.completedTodos.slice();
                    if (action.payload.direction === "ascending") {
                        newCompletedTodos.sort((a, b) => (a.todo < b.todo ? -1 : a.todo > b.todo ? 1 : 0));
                        return {
                            ...todoLists,
                            completedTodos: newCompletedTodos,
                        };
                    } else {
                        newCompletedTodos.sort((a, b) => (a.todo < b.todo ? 1 : a.todo > b.todo ? -1 : 0));
                        return {
                            ...todoLists,
                            completedTodos: newCompletedTodos,
                        };
                    }
                }

            case "sortByPriority":
                if (action.payload.tabName === "active") {
                    let newActiveTodos = todoLists.activeTodos.slice();
                    if (action.payload.direction === "ascending") {
                        newActiveTodos.sort((a, b) => (a.isPriority ? -1 : b.isPriority ? 1 : 0));
                        return {
                            ...todoLists,
                            activeTodos: newActiveTodos,
                        };
                    } else {
                        newActiveTodos.sort((a, b) => (a.isPriority ? 1 : b.isPriority ? -1 : 0));
                        return {
                            ...todoLists,
                            activeTodos: newActiveTodos,
                        };
                    }
                } else {
                    let newCompletedTodos = todoLists.completedTodos.slice();
                    if (action.payload.direction === "ascending") {
                        newCompletedTodos.sort((a, b) => (a.isPriority ? -1 : b.isPriority ? 1 : 0));
                        return {
                            ...todoLists,
                            completedTodos: newCompletedTodos,
                        };
                    } else {
                        newCompletedTodos.sort((a, b) => (a.isPriority ? 1 : b.isPriority ? -1 : 0));
                        return {
                            ...todoLists,
                            completedTodos: newCompletedTodos,
                        };
                    }
                }

            case "set":
                return action.payload.isActive
                    ? { ...todoLists, activeTodos: action.payload.newTodoList }
                    : { ...todoLists, completedTodos: action.payload.newTodoList };

            default:
                throw new Error();
        }
    }

    //Save <todoLists> in local Storage each time it is modified
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TODOLISTS_KEY, JSON.stringify(todoLists));
    }, [todoLists]);

    // TODO: CHANGE INITIALIZATION OF STATE VARIABLE <sortingStatus> TO WHAT'S CURRENTLY IN THE LOCAL STORAGE
    // State variable <sortingStatus> holds the data relative to the latest sorting status
    const [sortingStatus, setSortingStatus] = useState<SortingStatusType>({ sortCondition: "", isAscending: false });

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
            todoListsDispatch({ type: "add", payload: { todo: inputTodo } });
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
            todoListsDispatch({
                type: "move",
                payload: {
                    id: Number(draggableId),
                    destinationIndex: destination.index,
                    isActive: source.droppableId === "active_todos" ? true : false,
                },
            });
        } else {
            // If a todo is dropped in same same tab but in a different index, change order of current tab accordingly
            todoListsDispatch({
                type: "moveInsideTab",
                payload: {
                    sourceIndex: source.index,
                    destinationIndex: destination.index,
                    isActive: source.droppableId === "active_todos" ? true : false,
                },
            });
        }
    }

    // Function that sorts todo items in a tab alphabetically, by calling the appropriate dispatcher function
    function handleSortAlphabetically(todoTabText: string) {
        // If previous sorting was alphabetical and ascending, sort alphabetically and descending
        if (sortingStatus.sortCondition === "alphabetical" && sortingStatus.isAscending) {
            todoListsDispatch({ type: "sortAlphabetical", payload: { tabName: todoTabText, direction: "descending" } });
            setSortingStatus({ ...sortingStatus, isAscending: false }); // Store latest sorting
        } else {
            // Else sort alphabetically and ascending
            todoListsDispatch({ type: "sortAlphabetical", payload: { tabName: todoTabText, direction: "ascending" } });
            setSortingStatus({ sortCondition: "alphabetical", isAscending: true }); // Store latest sorting
        }
    }

    // Function that sorts todo items in a tab by priority, by calling the appropriate dispatcher function
    function handleSortByPriority(todoTabText: string) {
        // If previous sorting was by priority and ascending, sort by priority and descending
        if (sortingStatus.sortCondition === "priority" && sortingStatus.isAscending) {
            todoListsDispatch({ type: "sortByPriority", payload: { tabName: todoTabText, direction: "descending" } });
            setSortingStatus({ ...sortingStatus, isAscending: false }); // Store latest sorting
        } else {
            // Else sort by priority and ascending
            todoListsDispatch({ type: "sortByPriority", payload: { tabName: todoTabText, direction: "ascending" } });
            setSortingStatus({ sortCondition: "priority", isAscending: true }); // Store latest sorting
        }
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
    // Make tabs draggable also
    // Add projects entity. Each project has its own set of tasks.

    return (
        <div className="App">
            <span className="heading">Taskify</span>
            <InputField
                inputRef={inputRef}
                inputTodo={inputTodo}
                setInputTodo={setInputTodo}
                handleSubmitTodoWithReducer={handleSubmitTodoWithReducer}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="main_content">
                    <Droppable droppableId="active_todos">
                        {(provided, snapshot) => (
                            <div
                                className={snapshot.isDraggingOver ? "active_tab dragging_over" : "active_tab"}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <div className="tab_top_row">
                                    <h3>Active Tasks</h3>
                                    <div className="tab_top_row_search_input_container">
                                        <input
                                            type="text"
                                            placeholder="Search for todo..."
                                            value={tabSearchInputs.activeTodosSearchInput}
                                            onChange={(e) => handleChangeTabSearchInputs(e, "active")}
                                        />
                                    </div>
                                    <div className="tab_top_row_sort_buttons">
                                        <div
                                            className="sort_button_container"
                                            onClick={() => handleSortAlphabetically("active")}
                                        >
                                            {sortingStatus.isAscending ? (
                                                sortingStatus.sortCondition === "alphabetical" ? (
                                                    <i className="fa-solid fa-arrow-down-a-z"></i>
                                                ) : (
                                                    <i className="fa-solid fa-arrow-down-z-a"></i>
                                                )
                                            ) : (
                                                <i className="fa-solid fa-arrow-down-z-a"></i>
                                            )}
                                        </div>
                                        <div
                                            className="sort_button_container"
                                            onClick={() => handleSortByPriority("active")}
                                        >
                                            {sortingStatus.isAscending ? (
                                                sortingStatus.sortCondition === "priority" ? (
                                                    <i className="fa-solid fa-arrow-down-1-9"></i>
                                                ) : (
                                                    <i className="fa-solid fa-arrow-down-9-1"></i>
                                                )
                                            ) : (
                                                <i className="fa-solid fa-arrow-down-9-1"></i>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <TodoListsDispatchContext.Provider value={todoListsDispatch}>
                                    {tabSearchInputs.activeTodosSearchInput ? (
                                        <TodoList
                                            todos={todoLists.activeTodos.filter((todoItem: Todo) =>
                                                todoItem.todo
                                                    .toLowerCase()
                                                    .includes(tabSearchInputs.activeTodosSearchInput)
                                            )}
                                        />
                                    ) : (
                                        <TodoList todos={todoLists.activeTodos} />
                                    )}
                                </TodoListsDispatchContext.Provider>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="completed_todos">
                        {(provided, snapshot) => (
                            <div
                                className={snapshot.isDraggingOver ? "completed_tab dragging_over" : "completed_tab"}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <div className="tab_top_row">
                                    <h3>Completed Tasks</h3>
                                    <div className="tab_top_row_search_input_container">
                                        <input
                                            type="text"
                                            placeholder="Search for todo..."
                                            value={tabSearchInputs.completedTodosSearchInput}
                                            onChange={(e) => handleChangeTabSearchInputs(e, "completed")}
                                        />
                                    </div>
                                    <div className="tab_top_row_sort_buttons">
                                        <div
                                            className="sort_button_container"
                                            onClick={() => handleSortAlphabetically("completed")}
                                        >
                                            {sortingStatus.isAscending ? (
                                                sortingStatus.sortCondition === "alphabetical" ? (
                                                    <i className="fa-solid fa-arrow-down-a-z"></i>
                                                ) : (
                                                    <i className="fa-solid fa-arrow-down-z-a"></i>
                                                )
                                            ) : (
                                                <i className="fa-solid fa-arrow-down-z-a"></i>
                                            )}
                                        </div>
                                        <div
                                            className="sort_button_container"
                                            onClick={() => handleSortByPriority("completed")}
                                        >
                                            {sortingStatus.isAscending ? (
                                                sortingStatus.sortCondition === "priority" ? (
                                                    <i className="fa-solid fa-arrow-down-1-9"></i>
                                                ) : (
                                                    <i className="fa-solid fa-arrow-down-9-1"></i>
                                                )
                                            ) : (
                                                <i className="fa-solid fa-arrow-down-9-1"></i>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <TodoListsDispatchContext.Provider value={todoListsDispatch}>
                                    {tabSearchInputs.completedTodosSearchInput ? (
                                        <TodoList
                                            todos={todoLists.completedTodos.filter((todoItem: Todo) =>
                                                todoItem.todo
                                                    .toLowerCase()
                                                    .includes(tabSearchInputs.completedTodosSearchInput)
                                            )}
                                        />
                                    ) : (
                                        <TodoList todos={todoLists.completedTodos} />
                                    )}
                                </TodoListsDispatchContext.Provider>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
            <Footer />
        </div>
    );
};
export default App;
