import React from "react";

import { Todo } from "../../models/model";
import TodoItem from "./TodoItem";
import styles from "./Project.module.scss";

interface Props {
    todos: Todo[];
    taskMaxCharacterLength: number
}

const TodoList: React.FC<Props> = ({ todos, taskMaxCharacterLength }: Props) => {
    return (
        <ul className={styles.todolist_container}>
            {todos.map((todo, index) => (
                <TodoItem key={todo.id} todo={todo} index={index} taskMaxCharacterLength={taskMaxCharacterLength} />
            ))}
        </ul>
    );
};
export default TodoList;
