import React from "react";

import { Todo } from "../../models/model";
import TodoItem from "./TodoItem";
import styles from "./TodoList.module.scss";

interface Props {
    todos: Todo[];
}

const TodoList: React.FC<Props> = ({ todos }: Props) => {
    return (
        <ul className={styles.todolist_container}>
            {todos.map((todo, index) => (
                <TodoItem key={todo.id} todo={todo} index={index} />
            ))}
        </ul>
    );
};
export default TodoList;
