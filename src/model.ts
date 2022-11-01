// <Todo> defines the type of a todo item object
export interface Todo {
    id: number;
    todo: string;
    isDone: boolean;
    isActive: boolean;
}

// <TodoListsType> defines the type of a variable holding the arrays of todos
export interface TodoListsType {
    activeTodos: Todo[];
    completedTodos: Todo[];
}

// <Actions> defines the several types that the reducer's action can take (from useReducer hook)
export type Actions =
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
