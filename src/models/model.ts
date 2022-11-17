// <Todo> defines the type of a todo item object
export interface Todo {
    id: number;
    todo: string;
    isPriority: boolean;
    isActive: boolean;
}

// <TodoListsType> defines the type of a variable holding the arrays of todos
export interface TodoListsType {
    activeTodos: Todo[];
    completedTodos: Todo[];
}

export interface ProjectType {
    projectId: number;
    projectTitle: string;
    todoTabs: TodoListsType;
}

// <Actions> defines the several types that the reducer's action can take (from useReducer hook)
export type Actions =
    | { type: "addProject"; payload: { projectTitle: string } }
    | { type: "setTodoTab"; payload: { projectId: number, newTodoList: Todo[]; isActive: boolean } }
    | { type: "addTodo"; payload: { projectId: number, todo: string } }
    | { type: "removeTodo"; payload: { projectId: number, id: number; isActive: boolean } }
    | { type: "prioritizeTodo"; payload: { projectId: number, id: number; isActive: boolean } }
    | { type: "editTodo"; payload: { projectId: number, id: number; newText: string; isActive: boolean } }
    | { type: "moveTodo"; payload: { projectId: number, id: number; destinationIndex: number; isActive: boolean } }
    | {
          type: "moveTodoInsideTab";
          payload: { projectId: number, sourceIndex: number; destinationIndex: number; isActive: boolean };
      }
    | { type: "sortTodosAlphabetical"; payload: { projectId: number, tabName: string; direction: string } }
    | { type: "sortTodosByPriority"; payload: { projectId: number, tabName: string; direction: string } };

export interface SortingStatusType {
    activeTab: {
        sortCondition: string;
        isAscending: boolean;
    };
    completedTab: {
        sortCondition: string;
        isAscending: boolean;
    };
}

export interface tabSearchInputsType {
    activeTodosSearchInput: string;
    completedTodosSearchInput: string;
}
