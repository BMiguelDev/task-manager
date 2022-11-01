import React, { useContext, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

import { Todo } from "../../model";
import { TodoListsDispatchContext } from "../../App";
import styles from "./TodoList.module.scss";

type Props = {
    todo: Todo;
    index: number;
};

const TodoItem: React.FC<Props> = ({ todo, index }: Props) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false); // State variable to handle if the todo is being edited or not
    const [editedText, setEditedText] = useState<string>(todo.todo); // State variable to store the edited todo text

    const inputRef = useRef<HTMLInputElement>(null);

    // Get dispatch functions from grandparent using useContext
    const todoListsDispatchWithContext = useContext(TodoListsDispatchContext);

    function handleToggleEditMode() {
        setIsEditMode((prevIsEditMode) => !prevIsEditMode);
        setEditedText(todo.todo);
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [isEditMode]);

    function handleCompleteTodoWithReducer(): any {
        if (!isEditMode) {
            todoListsDispatchWithContext({ type: "prioritize", payload: { id: todo.id, isActive: todo.isActive } });
        }
    }

    function handleDeleteTodoWithReducer(): any {
        todoListsDispatchWithContext({ type: "remove", payload: { id: todo.id, isActive: todo.isActive } });
    }

    function handleEditTodoAndToggle(e: React.FormEvent): void {
        e.preventDefault();
        if (editedText) {
            todoListsDispatchWithContext({
                type: "edit",
                payload: { id: todo.id, newText: editedText, isActive: todo.isActive },
            });
            handleToggleEditMode();
        }
    }

    function getTodoItemClassName(snapshot: any): string {
        if(snapshot.isDragging) {
            if(snapshot.isDropAnimating) {
                return todo.isPriority ? `${styles.todo_item} ${styles.dragging} ${styles.drop_animating} ${styles.todo_item_priority}` : `${styles.todo_item} ${styles.dragging} ${styles.drop_animating}`
            } else {
                return todo.isPriority ? `${styles.todo_item} ${styles.dragging} ${styles.todo_item_priority}` : `${styles.todo_item} ${styles.dragging}`
            }
        } else {
            if(snapshot.isDropAnimating) {
                return todo.isPriority ? `${styles.todo_item} ${styles.drop_animating} ${styles.todo_item_priority}` : `${styles.todo_item} ${styles.drop_animating}`
            } else {
                return todo.isPriority ? `${styles.todo_item} ${styles.todo_item_priority}` : styles.todo_item
            }
        }
    }

    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {(provided, snapshot) => (
                <li
                    className={getTodoItemClassName(snapshot)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {isEditMode ? (
                        <form className={styles.todo_item_edit_form} onSubmit={(e) => handleEditTodoAndToggle(e)}>
                            <input
                                type="input"
                                placeholder="Enter new todo title"
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                className={styles.todo_item_edit_input}
                                ref={inputRef}
                            />
                            <button type="submit">Go</button>
                        </form>
                    ) : (
                        <p
                            className={
                                todo.isPriority
                                    ? `${styles.todo_item_text} ${styles.todo_item_text_priority}`
                                    : styles.todo_item_text
                            }
                        >
                            {todo.todo}
                        </p>
                    )}
                    <div className={styles.todo_item_btn_container}>
                        <div className={styles.todo_item_edit_btn_container} onClick={handleToggleEditMode}>
                            <i className="fa-solid fa-pen"></i>
                        </div>
                        <div className={styles.todo_item_delete_btn_container} onClick={handleDeleteTodoWithReducer}>
                            <i className="fa-solid fa-trash"></i>
                        </div>
                        <div className={styles.todo_item_done_btn_container} onClick={handleCompleteTodoWithReducer}>
                            {todo.isPriority ? (
                                <i className="fa-solid fa-xmark"></i>
                            ) : (
                                <i className="fa-solid fa-check"></i>
                            )}
                        </div>
                    </div>
                </li>
            )}
        </Draggable>
    );
};

export default TodoItem;
