import React, { useReducer, useRef, useState, useEffect, createContext } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import InputField from "./components/InputField/InputField";
import { Todo, Actions } from "./model";
import TodoList from "./components/TodosList/TodoList";
import Footer from "./components/Footer/Footer";
import "./App.scss";

// Local Storage Keys
const LOCAL_STORAGE_TODOLISTS_KEY = "TaskManagerApp.TodoLists";
const LOCAL_STORAGE_TODO_KEY = "TaskManagerApp.Todo";

/* useContext to pass dispatch function (from useReducer) to deep children */
export const TodoListsDispatchContext = createContext<React.Dispatch<Actions>>(() => {});

const App: React.FC = () => {
    const [todo, setTodo] = useState<string>(() => {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TODO_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return "";
    });

    // const [todos, setTodos] = useState<Todo[]>([]);  // replaced by useReducer
    //const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(todo));
    }, [todo]);

    // UseRef hook with typescript
    const inputRef = useRef<HTMLInputElement>(null);

    /* Instead of using useState for the todos (todo list), we can use useReducer.
        useReducer allows us to have a state variable, just like useState, but also
        several different functions to modify the state, based on parameters. */
    const [todoLists, todoListsDispatch] = useReducer(
        todoListsReducer,
        { activeTodos: [], completedTodos: [] },
        reducerVariableInitializer1
    );

    // Initializer function to initialize the <todoList> variable of useReducer with localStorage data
    function reducerVariableInitializer1(): todoListsType {
        // return JSON.parse(localStorage.getItem("LOCAL_STORAGE_TODOLIST_KEY") || "{[]}");
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TODOLISTS_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return { activeTodos: [], completedTodos: [] };
    }

    // <TodoListActions> defines the several types that the reducer's action can take
    type Actions =
        | { type: "set"; payload: { newTodoList: Todo[]; isActive: boolean } }
        | { type: "add"; payload: { todo: string } }
        | { type: "remove"; payload: { id: number; isActive: boolean } }
        | { type: "complete"; payload: { id: number; isActive: boolean } }
        | { type: "edit"; payload: { id: number; newText: string; isActive: boolean } }
        | { type: "move"; payload: { id: number; destinationIndex: number; isActive: boolean } }
        | {
              type: "moveInsideTab";
              payload: { sourceIndex: number; destinationIndex: number; isActive: boolean };
          };

    interface todoListsType {
        activeTodos: Todo[];
        completedTodos: Todo[];
    }

    // Reducer function that conditionally changes <todoList> variable based on the parameters received
    function todoListsReducer(todoLists: todoListsType, action: Actions): any {
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

            case "complete":
                if (action.payload.isActive) {
                    return {
                        ...todoLists,
                        activeTodos: todoLists.activeTodos.map((todo) => {
                            return todo.id === action.payload.id ? { ...todo, isDone: !todo.isDone } : todo;
                        }),
                    };
                } else {
                    return {
                        ...todoLists,
                        completedTodos: todoLists.completedTodos.map((todo) => {
                            return todo.id === action.payload.id ? { ...todo, isDone: !todo.isDone } : todo;
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

    // Function to add a todo to the <todoList>
    function handleSubmitTodoWithReducer(e: React.FormEvent) {
        e.preventDefault();
        if (todo) {
            todoListsDispatch({ type: "add", payload: { todo: todo } });
            setTodo("");
        }
        inputRef.current?.blur();
    }

    // Function that computes what to do when a todo item is dropped (after dragging)
    function onDragEnd(result: DropResult) {
        console.log(result);
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

    // TODO:
    // Replace "done" with "priority"
    // Sort: alphabetical and maybe by priority items?
    // Make main state variable an array of more (possibly) more than 2 tabs. Add button to add new tab.
    // Make tabs draggable also
    // Add projects entity. Each project has its own set of tasks.
    // input field to search for task. Task array updates on each stroke (dynamically; no function, do the sorting right on the render function)

    return (
        <div className="App">
            <span className="heading">Taskify</span>
            <InputField
                inputRef={inputRef}
                todo={todo}
                setTodo={setTodo}
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
                                <h3>Active Tasks</h3>

                                <TodoListsDispatchContext.Provider value={todoListsDispatch}>
                                    <TodoList todos={todoLists.activeTodos} />
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
                                <h3>Completed Tasks</h3>
                                <TodoListsDispatchContext.Provider value={todoListsDispatch}>
                                    <TodoList todos={todoLists.completedTodos} />
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
