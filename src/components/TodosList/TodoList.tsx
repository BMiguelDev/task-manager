import React from "react";

import { Todo /*, Actions */ } from "../../model";
import TodoItem from "./TodoItem";
import styles from "./TodoList.module.scss";


interface Props {
    todos: Todo[];
    // handleCompleteTodo: (id: number, isEditMode: boolean) => any;
    // handleDeleteTodo: (id: number) => any;
    // handleEditTodo: (e: React.FormEvent, id: number, newText: string) => any;
    
    // todoListDispatch: React.Dispatch<Actions>   // replaced by useContext
}

const TodoList: React.FC<Props> = ({ todos /*, todoListDispatch */ /* handleCompleteTodo, handleDeleteTodo, handleEditTodo*/ }: Props) => {
    return (
        <ul className={styles.todolist_container}>
            {todos.map((todo, index) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    // handleCompleteTodo={handleCompleteTodo}
                    // handleDeleteTodo={handleDeleteTodo}
                    // handleEditTodo={handleEditTodo}
                    
                    // todoListDispatch={todoListDispatch}
                />
            ))}
        </ul>
    );
};
export default TodoList;
