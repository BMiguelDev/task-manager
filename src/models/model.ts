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

// <Actions> defines the several types that the reducer's action can take (from useReducer hook)
export type Actions =
    | { type: "set"; payload: { newTodoList: Todo[]; isActive: boolean } }
    | { type: "add"; payload: { todo: string } }
    | { type: "remove"; payload: { id: number; isActive: boolean } }
    | { type: "prioritize"; payload: { id: number; isActive: boolean } }
    | { type: "edit"; payload: { id: number; newText: string; isActive: boolean } }
    | { type: "move"; payload: { id: number; destinationIndex: number; isActive: boolean } }
    | {
          type: "moveInsideTab";
          payload: { sourceIndex: number; destinationIndex: number; isActive: boolean };
      }
    | { type: "sortAlphabetical"; payload: { tabName: string; direction: string } }
    | { type: "sortByPriority"; payload: { tabName: string; direction: string } };

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