import React, { useContext, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

import { Todo /*, Actions */ } from "../../model";
import { /*TodoListDispatchContext, CompletedTodoListDispatchContext*/ TodoListsDispatchContext } from "../../App";
import styles from "./TodoList.module.scss";

type Props = {
    todo: Todo;
    index: number;
    // handleCompleteTodo: (id: number, isEditMode: boolean) => any;
    // handleDeleteTodo: (id: number) => any;
    // handleEditTodo: (e: React.FormEvent, id: number, newText: string) => any;

    //todoListDispatch: React.Dispatch<Actions>; // replaced with useContext
};

const TodoItem: React.FC<Props> = ({
    todo,
    index /*, todoListDispatch */ /* handleCompleteTodo, handleDeleteTodo, handleEditTodo */,
}: Props) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false); // State variable to handle if the todo is being edited or not
    const [editedText, setEditedText] = useState<string>(todo.todo); // State variable to handle if the edited todo text

    const inputRef = useRef<HTMLInputElement>(null);

    // Get dispatch functions from grandparent using useContext
    // const todoListDispatchWithContext = useContext(TodoListDispatchContext);
    // const CompletedTodoListDispatchWithContext = useContext(CompletedTodoListDispatchContext);

    const todoListsDispatchWithContext = useContext(TodoListsDispatchContext);
    

    function handleToggleEditMode() {
        setIsEditMode((prevIsEditMode) => !prevIsEditMode);
        setEditedText(todo.todo);
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, [isEditMode]);

    function handleCompleteTodoWithReducer(): any {
        /*if (!isEditMode) todoListDispatch({ type: "complete", payload: { id: id } });*/

        if (!isEditMode) {
            // todo.isActive? 
            // todoListDispatchWithContext({ type: "complete", payload: { id: todo.id } }) :
            // CompletedTodoListDispatchWithContext({ type: "complete", payload: { id: todo.id } })

            todoListsDispatchWithContext({ type: "complete", payload: { id: todo.id, isActive: todo.isActive } });
        }
    }

    function handleDeleteTodoWithReducer(): any {
        //todoListDispatchWithContext({ type: "remove", payload: { id: id } });
        // todoListDispatch({ type: "remove", payload: { id: id } });

        //todoListDispatchWithContext({ type: "remove", payload: { id: todo.id, isActive: todo.isActive } });
        console.log("JEHJAWDN")
        todoListsDispatchWithContext({ type: "remove", payload: { id: todo.id, isActive: todo.isActive } });
    }

    function handleEditTodoAndToggle(e: React.FormEvent): void {
        e.preventDefault();
        if (editedText) {
            //handleEditTodo(e, todo.id, editedText);
            // todoListDispatch({ type: "edit", payload: { id: todo.id, newText: editedText } });

            //todoListDispatchWithContext({ type: "edit", payload: { id: todo.id, newText: editedText } });

            todoListsDispatchWithContext({ type: "edit", payload: { id: todo.id, newText: editedText, isActive: todo.isActive } });

            handleToggleEditMode();
        }
    }

    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {(provided, snapshot) => (
                <li
                    className={snapshot.isDragging ? (snapshot.isDropAnimating ? `${styles.todo_item} ${styles.dragging} ${styles.drop_animating}` : `${styles.todo_item} ${styles.dragging}`) : (snapshot.isDropAnimating ? `${styles.todo_item} ${styles.drop_animating}` : styles.todo_item)}
                    // className={styles.todo_item}
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
                                todo.isDone
                                    ? `${styles.todo_item_text} ${styles.todo_item_text_done}`
                                    : styles.todo_item_text
                            }
                            // onClick={() => todoListsDispatchWithContext({ type: "move", payload: { id: todo.id, isActive: todo.isActive } })}
                        >
                            {todo.todo}
                        </p>
                    )}
                    <div className={styles.todo_item_btn_container}>
                        <div className={styles.todo_item_edit_btn_container} onClick={handleToggleEditMode}>
                            <i className="fa-solid fa-pen"></i>
                        </div>
                        <div
                            className={styles.todo_item_delete_btn_container}
                            onClick={handleDeleteTodoWithReducer /*handleDeleteTodo(todo.id)*/}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </div>
                        <div
                            className={styles.todo_item_done_btn_container}
                            onClick={
                                handleCompleteTodoWithReducer /*handleCompleteTodo(todo.id, isEditMode)*/
                            }
                        >
                            {todo.isDone ? (
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
