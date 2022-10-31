import React, { useReducer, useRef, useState, useEffect, createContext } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import InputField from "./components/InputField/InputField";
import { Todo, TodoListActions, CompletedTodoActions, Actions } from "./model";
import TodoList from "./components/TodosList/TodoList";
import Footer from "./components/Footer/Footer";
import "./App.scss";

// Local Storage Keys
//const LOCAL_STORAGE_TODOLIST_KEY = "TaskManagerApp.TodoList";
//const LOCAL_STORAGE_COMPLETED_TODOLIST_KEY = "TaskManagerApp.CompletedTodoList";
const LOCAL_STORAGE_TODOLISTS_KEY = "TaskManagerApp.TodoLists";
const LOCAL_STORAGE_TODO_KEY = "TaskManagerApp.Todo";

//Assigning types in typescript
/*
// Simple variable types
let something: any;  // any type
let name: string;  
let age: number;
let ageOrName: number | string;   // number or string
let isStudent: boolean;
let hobbies: string[];    // Array of strings
let role: [number, string];   // tuple/pair where the 1st variable is a number and the 2nd is a string

// Instead of type <any>, there's a much better type we can use if we don't know what type the variable will be
let personName: unknown;


// Generic way, not so advised
let person1: Object;

// Better way: create a custom/specific type to give to variable (This is called Alias)
type Person = {
  name: string;
  age?: number;
}

let person: Person;

person = {
  name: "hello",
  age: 3
}

// There are two types of Alias, one is type, the other is interface
// The difference between type and interface is in the way they extend themselves: 
type X = {
  a: string;
  b: number;
}

// Types can be extended
// Type Y will also include type X's attributes
type Y = X & {
  c: string;
  d: number;
}

let y: Y  = {
  a: "hello",
  b: 2,
  c: "hello",
  d: 3
}

// When it comes to interfaces:
interface Human {
  name: string;
  age?: number;
}

// Interfaces can also be extended (more readable)
interface Guy extends Human {
  profession: string;
}

let professional: Guy = {
  profession: "IT",
  name: "Hello",
  age: 4
}

// Types can extend interfaces
// If we want to have the properties of Human inside type Z:
type Z = Human & {
  address: string;
}

// Interfaces can also extend types
interface Human1 extends X {
  c: number;
}


let lotsOfPeople: Person[];


type Project = {
  owner: Person;
  year: number;
}

let project:Project;

project = {
  owner: person,
  year: 1900
}


// Weird way:
let printName1: (name: string) => string;

// More intuitive, better way:
function printName(name: string): string {
  console.log(name);
  return name;
}

// When we don't know even if the function will return nothing (void) or something (any), we can use the type <never> (function should never return)
let someFunction: (name: string) => never;

// if the function doesn't return anything, we can use type <void>
function functionThatReturnsNothing(name: string): any {
  console.log(name);
}

*/

// export default function App(): React.ReactNode {
//   return (
//     <div className="App">
//       Hello World
//     </div>
//   );
// }

/* useContext to pass dispatch function (from useReducer) to deep children */
// export const TodoListDispatchContext = createContext<React.Dispatch<TodoListActions>>(() => {});
// export const CompletedTodoListDispatchContext = createContext<React.Dispatch<CompletedTodoActions>>(() => {});
export const TodoListsDispatchContext = createContext<React.Dispatch<Actions>>(() => {});

const App: React.FC = () => {
    // To define types in React hooks:
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

    // // Instead of using useState for the todos (todo list), we can use useReducer
    // // useReducer allows us to have a state variable, just like useState, but also
    // // several different functions to modify the state, based on parameters
    // const [todoList, todoListDispatch] = useReducer(todoListReducer, [], reducerVariableInitializer);

    // // initializer function to initialize the <todoList> variable of useReducer with localStorage data
    // function reducerVariableInitializer() {
    //     // return JSON.parse(localStorage.getItem("LOCAL_STORAGE_TODOLIST_KEY") || "{[]}");
    //     const localStorageItem = localStorage.getItem(LOCAL_STORAGE_TODOLIST_KEY);
    //     if (localStorageItem) return JSON.parse(localStorageItem);
    //     else return [];
    // }

    // // <TodoListActions> defines the several types that the reducer's action can take
    // type TodoListActions =
    //     | { type: "set"; payload: { newTodoList: Todo[] } }
    //     | { type: "add"; payload: { todo: string } }
    //     | { type: "remove"; payload: { id: number } }
    //     | { type: "complete"; payload: { id: number } }
    //     | { type: "edit"; payload: { id: number; newText: string } }
    //     | { type: "moveOut"; payload: { id: number } }
    //     | { type: "moveIn"; payload: { todoItem: Todo } };

    // // Reducer function that conditionally changes <todoList> variable based on the parameters received
    // function todoListReducer(todoList: Todo[], action: TodoListActions): any {
    //     switch (action.type) {
    //         case "add":
    //             return [...todoList, { id: Date.now(), todo: action.payload.todo, isDone: false }];

    //         case "remove":
    //             console.log("het");
    //             return todoList.filter((todo) => todo.id !== action.payload.id);

    //         case "complete":
    //             return todoList.map((todo) => {
    //                 return todo.id === action.payload.id ? { ...todo, isDone: !todo.isDone } : todo;
    //             });
    //         case "edit":
    //             return todoList.map((todo) =>
    //                 todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
    //             );

    //         case "moveOut":
    //             // Look for todo with provided id in <todoList> variable
    //             // let arrayWithTodoToMove = todoList.filter((todo) => todo.id === action.payload.id);

    //             // // If found, move from <todoList> and add it to <completedTodos>, otherwise, move from <completedTodos> and add it to <todoList>
    //             // if (arrayWithTodoToMove.length > 0) {
    //             //     const [todoToMove] = arrayWithTodoToMove;
    //             //     setCompletedTodos([...completedTodos, todoToMove]);
    //             //     return todoList.filter((todo) => todo.id !== action.payload.id);
    //             // } else {
    //             //     const [todoToMove] = completedTodos.filter((todo) => todo.id === action.payload.id);
    //             //     setCompletedTodos(completedTodos.filter((todo) => todo.id !== action.payload.id));
    //             //     return [...todoList, todoToMove];
    //             // }

    //             // Look for todo with provided id in <todoList>, move it to <completedTodoList> and remove it from <todoList>
    //             const [todoToMove] = todoList.filter((todo) => todo.id === action.payload.id);
    //             completedTodoListDispatch({ type: "moveIn", payload: { todoItem: todoToMove } });
    //             return todoList.filter((todo) => todo.id !== action.payload.id);

    //         case "moveIn":
    //             return [...todoList, action.payload.todoItem];

    //         case "set":
    //             return action.payload.newTodoList;

    //         default:
    //             throw new Error();
    //     }
    // }

    /*


    const [completedTodoList, completedTodoListDispatch] = useReducer(
        completedTodoListReducer,
        [],
        completedReducerVariableInitializer
    );

    // initializer function to initialize the <completedTodoList> variable of useReducer with localStorage data
    function completedReducerVariableInitializer() {
        const localStorageItem = localStorage.getItem(LOCAL_STORAGE_COMPLETED_TODOLIST_KEY);
        if (localStorageItem) return JSON.parse(localStorageItem);
        else return [];
    }

    // <CompletedTodoActions> defines the several types that the reducer's action can take
    type CompletedTodoActions =
        | { type: "set"; payload: { newTodoList: Todo[] } }
        | { type: "remove"; payload: { id: number } }
        | { type: "complete"; payload: { id: number } }
        | { type: "edit"; payload: { id: number; newText: string } }
        | { type: "moveOut"; payload: { id: number } }
        | { type: "moveIn"; payload: { todoItem: Todo } };

    // Reducer function that conditionally changes <todoList> variable based on the parameters received
    function completedTodoListReducer(completedTodoList: Todo[], action: CompletedTodoActions): any {
        switch (action.type) {
            case "remove":
                return completedTodoList.filter((todo) => todo.id !== action.payload.id);

            case "complete":
                return completedTodoList.map((todo) => {
                    return todo.id === action.payload.id ? { ...todo, isDone: !todo.isDone } : todo;
                });
            case "edit":
                return completedTodoList.map((todo) =>
                    todo.id === action.payload.id ? { ...todo, todo: action.payload.newText } : todo
                );

            case "moveOut":
                // Look for todo with provided id in <completedTodoList>, move it to <todoList> and remove it from <completedTodoList>
                const [todoToMove] = completedTodoList.filter((todo) => todo.id === action.payload.id);
                todoListDispatch({ type: "moveIn", payload: { todoItem: todoToMove } })
                return completedTodoList.filter((todo) => todo.id !== action.payload.id);

            case "moveIn":
                return [...completedTodoList, action.payload.todoItem ];

            case "set":
                return action.payload.newTodoList;

            default:
                throw new Error();
        }
    }
*/

    // Instead of using useState for the todos (todo list), we can use useReducer
    // useReducer allows us to have a state variable, just like useState, but also
    // several different functions to modify the state, based on parameters
    const [todoLists, todoListsDispatch] = useReducer(
        todoListsReducer,
        { activeTodos: [], completedTodos: [] },
        reducerVariableInitializer1
    );

    // initializer function to initialize the <todoList> variable of useReducer with localStorage data
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
              payload: { /*id: number;*/ sourceIndex: number; destinationIndex: number; isActive: boolean };
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
                // Look for todo with provided id in <todoList> variable
                // let arrayWithTodoToMove = todoList.filter((todo) => todo.id === action.payload.id);

                // // If found, move from <todoList> and add it to <completedTodos>, otherwise, move from <completedTodos> and add it to <todoList>
                // if (arrayWithTodoToMove.length > 0) {
                //     const [todoToMove] = arrayWithTodoToMove;
                //     setCompletedTodos([...completedTodos, todoToMove]);
                //     return todoList.filter((todo) => todo.id !== action.payload.id);
                // } else {
                //     const [todoToMove] = completedTodos.filter((todo) => todo.id === action.payload.id);
                //     setCompletedTodos(completedTodos.filter((todo) => todo.id !== action.payload.id));
                //     return [...todoList, todoToMove];
                // }

                // Look for todo with provided id in <todoList>, move it to <completedTodoList> and remove it from <todoList>

                if (action.payload.isActive) {
                    const [todoToMove] = todoLists.activeTodos.filter((todo) => todo.id === action.payload.id);
                    todoToMove.isActive = !todoToMove.isActive;
                    let newCompletedTodos = todoLists.completedTodos.slice();
                    newCompletedTodos.splice(action.payload.destinationIndex, 0, todoToMove);

                    return {
                        activeTodos: todoLists.activeTodos.filter((todo) => todo.id !== action.payload.id),
                        // completedTodos: [...todoLists.completedTodos, todoToMove],
                        completedTodos: newCompletedTodos
                    };
                } else {
                    const [todoToMove] = todoLists.completedTodos.filter((todo) => todo.id === action.payload.id);
                    todoToMove.isActive = !todoToMove.isActive;
                    let newActiveTodos = todoLists.activeTodos.slice();
                    newActiveTodos.splice(action.payload.destinationIndex, 0, todoToMove);
                    return {
                        //activeTodos: [...todoLists.activeTodos, todoToMove],
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

    // Save <todoList> in local Storage each time it is modified
    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_TODOLIST_KEY, JSON.stringify(todoList));
    // }, [todoList]);

    // // Save <completedTodoList> in local Storage each time it is modified
    // useEffect(() => {
    //     localStorage.setItem(LOCAL_STORAGE_COMPLETED_TODOLIST_KEY, JSON.stringify(completedTodoList));
    // }, [completedTodoList]);

    // Function to add a todo to the <todoList>
    function handleSubmitTodoWithReducer(e: React.FormEvent) {
        e.preventDefault();
        if (todo) {
            //todoListDispatch({ type: "add", payload: { todo: todo } });
            todoListsDispatch({ type: "add", payload: { todo: todo } });
            setTodo("");
        }
        inputRef.current?.blur();
    }

    // Functions that worked with useState - replaced by reducer function (using dispatch)
    /*
    function handleCompleteTodo(id: number, isEditMode: boolean): any {
        if (!isEditMode) {
            setTodos((prevTodos) =>
                prevTodos.map((todo) => {
                    return todo.id === id ? { ...todo, isDone: !todo.isDone } : todo;
                })
            );
        }
    }

    function handleDeleteTodo(id: number): any {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    }

    function handleEditTodo(e: React.FormEvent, id: number, newText: string): any {
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, todo: newText } : todo)));
    }

    function handleSubmitTodo(e: React.FormEvent) {
        e.preventDefault();
        if (todo) {
            setTodos((prevTodos) => [...prevTodos, { id: Date.now(), todo: todo, isDone: false }]);
            setTodo("");
        }

        //if(inputRef.current)
        inputRef.current?.blur();
    }

    */

    function onDragEnd(result: DropResult) {
        console.log(result);
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        if (source.droppableId !== destination.droppableId) {
            todoListsDispatch({
                type: "move",
                payload: { id: Number(draggableId),
                destinationIndex: destination.index, isActive: source.droppableId === "active_todos" ? true : false },
            });
        } else {
            todoListsDispatch({
                type: "moveInsideTab",
                payload: {
                    /*id: Number(draggableId),*/ sourceIndex: source.index,
                    destinationIndex: destination.index,
                    isActive: source.droppableId === "active_todos" ? true : false,
                },
            });
        }
    }

    return (
        <div className="App">
            <span className="heading">Taskify</span>
            <InputField
                inputRef={inputRef}
                todo={todo}
                setTodo={setTodo}
                /*handleSubmitTodo={handleSubmitTodo}*/ handleSubmitTodoWithReducer={handleSubmitTodoWithReducer}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="main_content">
                    <Droppable droppableId="active_todos">
                        {(provided, snapshot) => (
                            <div
                                className={snapshot.isDraggingOver ? "active_tab dragging_over" : "active_tab"}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                // style={{ backgroundColor: snapshot.isDraggingOver ? "blue" : "grey" }}
                            >
                                <h3>Active Tasks</h3>

                                <TodoListsDispatchContext.Provider value={/*todoListDispatch*/ todoListsDispatch}>
                                    <TodoList
                                        todos={/*todos*/ /*todoList*/ todoLists.activeTodos}
                                        // handleCompleteTodo={handleCompleteTodo}
                                        // handleDeleteTodo={handleDeleteTodo}
                                        // handleEditTodo={handleEditTodo}

                                        // todoListDispatch={todoListDispatch}
                                    />
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
                                <TodoListsDispatchContext.Provider
                                    value={/*completedTodoListDispatch*/ todoListsDispatch}
                                >
                                    <TodoList
                                        todos={/*todos*/ /*completedTodos*/ todoLists.completedTodos}
                                        // handleCompleteTodo={handleCompleteTodo}
                                        // handleDeleteTodo={handleDeleteTodo}
                                        // handleEditTodo={handleEditTodo}

                                        // todoListDispatch={todoListDispatch}
                                    />
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
