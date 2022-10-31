export interface Todo {
    id: number;
    todo: string;
    isDone: boolean;
    isActive: boolean;
}

// TodoList actions type variable for useReducer hook
export type TodoListActions =
    | { type: "set"; payload: { newTodoList: Todo[] } }
    | { type: "add"; payload: { e: React.FormEvent; todo: string } }
    | { type: "remove"; payload: { id: number } }
    | { type: "complete"; payload: { id: number } }
    | { type: "edit"; payload: { id: number; newText: string } }
    | { type: "moveOut"; payload: { id: number } }
    | { type: "moveIn"; payload: { todoItem: Todo } };

// CompletedTodos actions type variable for useReducer hook
export type CompletedTodoActions =
    | { type: "set"; payload: { newTodoList: Todo[] } }
    | { type: "remove"; payload: { id: number } }
    | { type: "complete"; payload: { id: number } }
    | { type: "edit"; payload: { id: number; newText: string } }
    | { type: "moveOut"; payload: { id: number } }
    | { type: "moveIn"; payload: { todoItem: Todo } };


    
export type Actions =
    | { type: "set"; payload: { newTodoList: Todo[]; isActive: boolean } }
    | { type: "add"; payload: { todo: string } }
    | { type: "remove"; payload: { id: number; isActive: boolean } }
    | { type: "complete"; payload: { id: number; isActive: boolean } }
    | { type: "edit"; payload: { id: number; newText: string; isActive: boolean } }
    | { type: "move"; payload: { id: number; destinationIndex: number; isActive: boolean } }
    | { type: "moveInsideTab"; payload: { /*id: number;*/ sourceIndex: number, destinationIndex: number, isActive: boolean } };
