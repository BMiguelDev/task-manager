import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Draggable, DraggableStateSnapshot } from "react-beautiful-dnd";
import Tooltip from "@material-ui/core/Tooltip";

import { ProjectType, Todo } from "../../models/model";
import { ProjectsDispatchContext } from "../../App";
import styles from "./Project.module.scss";

type Props = {
    todo: Todo;
    index: number;
    taskMaxCharacterLength: number;
};

const TodoItem: React.FC<Props> = ({ todo, index, taskMaxCharacterLength }: Props) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false); // State variable to handle if the todo is being edited or not
    const [editedText, setEditedText] = useState<string>(todo.todo); // State variable to store the edited todo text

    // Over-engineering and getting projectId from router's location instead of props
    const location = useLocation();
    const project: ProjectType = location.state?.project;
    const projId = project?.projectId;

    const inputRef = useRef<HTMLInputElement>(null);

    // Get dispatch functions from great-great-grandparent (App) using useContext
    const projectsDispatchWithContext = useContext(ProjectsDispatchContext);

    useEffect(() => {
        inputRef.current?.focus();
    }, [isEditMode]);

    function handleToggleEditMode() {
        setIsEditMode((prevIsEditMode) => !prevIsEditMode);
        setEditedText(todo.todo);
    }

    function handleCompleteTodoWithReducer(): any {
        projectsDispatchWithContext({
            type: "prioritizeTodo",
            payload: { projectId: projId, id: todo.id, isActive: todo.isActive },
        });
    }

    function handleDeleteTodoWithReducer(): any {
        projectsDispatchWithContext({
            type: "removeTodo",
            payload: { projectId: projId, id: todo.id, isActive: todo.isActive },
        });
    }

    function handleChangeEditedText(event: React.ChangeEvent<HTMLInputElement>) {
        event.target.value.length < taskMaxCharacterLength
            ? setEditedText(event.target.value)
            : setEditedText(event.target.value.slice(0, taskMaxCharacterLength));
    }

    function handleEditTodoAndToggle(e: React.FormEvent): void {
        e.preventDefault();
        if (editedText) {
            projectsDispatchWithContext({
                type: "editTodo",
                payload: { projectId: projId, id: todo.id, newText: editedText, isActive: todo.isActive },
            });
            handleToggleEditMode();
        }
    }

    function handleMoveTodoWithReducer() {
        projectsDispatchWithContext({
            type: "moveTodo",
            payload: { projectId: projId, id: todo.id, destinationIndex: 0, isActive: todo.isActive },
        });
    }

    function getTodoItemClassName(snapshot: DraggableStateSnapshot): string {
        if (snapshot.isDragging) {
            if (snapshot.isDropAnimating) {
                return todo.isPriority
                    ? `${styles.todo_item} ${styles.dragging} ${styles.drop_animating} ${styles.todo_item_priority}`
                    : `${styles.todo_item} ${styles.dragging} ${styles.drop_animating}`;
            } else {
                return todo.isPriority
                    ? `${styles.todo_item} ${styles.dragging} ${styles.todo_item_priority}`
                    : `${styles.todo_item} ${styles.dragging}`;
            }
        } else {
            if (snapshot.isDropAnimating) {
                return todo.isPriority
                    ? `${styles.todo_item} ${styles.drop_animating} ${styles.todo_item_priority}`
                    : `${styles.todo_item} ${styles.drop_animating}`;
            } else {
                return todo.isPriority ? `${styles.todo_item} ${styles.todo_item_priority}` : styles.todo_item;
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
                                placeholder="Enter new task title"
                                value={editedText}
                                onChange={handleChangeEditedText}
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
                        <Tooltip title="Move" placement="bottom">
                            <div className={styles.todo_item_icon_container} onClick={handleMoveTodoWithReducer}>
                                {todo.isActive ? (
                                    <i className="fa-solid fa-arrow-right-long"></i>
                                ) : (
                                    <i className="fa-solid fa-arrow-left-long"></i>
                                )}
                            </div>
                        </Tooltip>
                        <Tooltip title="Prioritize" placement="bottom">
                            <div className={styles.todo_item_icon_container} onClick={handleCompleteTodoWithReducer}>
                                {todo.isPriority ? (
                                    <i className="fa-solid fa-hourglass-end"></i>
                                ) : (
                                    <i className="fa-solid fa-hourglass-start"></i>
                                )}
                            </div>
                        </Tooltip>
                        <Tooltip title="Edit" placement="bottom">
                            <div className={styles.todo_item_icon_container} onClick={handleToggleEditMode}>
                                <i className="fa-solid fa-pen"></i>
                            </div>
                        </Tooltip>
                        <Tooltip title="Delete" placement="bottom">
                            <div className={styles.todo_item_icon_container} onClick={handleDeleteTodoWithReducer}>
                                <i className="fa-solid fa-trash"></i>
                            </div>
                        </Tooltip>
                    </div>
                </li>
            )}
        </Draggable>
    );
};

export default TodoItem;
