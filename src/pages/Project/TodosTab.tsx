import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Tooltip from "@material-ui/core/Tooltip";

import { Todo } from "../../models/model";
import styles from "./Project.module.scss";
import TodoList from "./TodoList";

interface PropTypes {
    projectId: number;
    tabName: string;
    tabTodoList: Todo[];
    tabSearchInput: string;
    handleChangeTabSearchInputs: (event: React.ChangeEvent<HTMLInputElement>, tabChanged: string) => void;
    tabSortingStatus: { sortCondition: string; isAscending: boolean };
    handleSortAlphabetically: (todoTabText: string) => void;
    handleSortByPriority: (todoTabText: string) => void;
    taskMaxCharacterLength: number;
}

export default function TodosTab({
    projectId,
    tabName,
    tabTodoList,
    tabSearchInput,
    handleChangeTabSearchInputs,
    tabSortingStatus,
    handleSortAlphabetically,
    handleSortByPriority,
    taskMaxCharacterLength
}: PropTypes) {
    return (
        <Droppable droppableId={`${tabName}_todos`}>
            {(provided, snapshot) => (
                <div
                    className={
                        snapshot.isDraggingOver
                            ? `${styles.todo_tab} ${styles[`${tabName}_tab`]} ${styles.dragging_over}`
                            : `${styles.todo_tab} ${styles[`${tabName}_tab`]}`
                    }
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className={styles.tab_top_row}>
                        <h3>{tabName} Tasks</h3>
                        <div className={styles.tab_top_row_utils_container}>
                            <div className={styles.tab_top_row_search_input_container}>
                                <input
                                    type="text"
                                    placeholder="Search for task..."
                                    value={tabSearchInput}
                                    onChange={(e) => handleChangeTabSearchInputs(e, tabName)}
                                />
                            </div>
                            <div className={styles.tab_top_row_sort_buttons}>
                                <Tooltip title="Sort Alphabetical" placement="bottom">
                                    <div
                                        className={styles.sort_button_container}
                                        onClick={() => handleSortAlphabetically(tabName)}
                                    >
                                        {tabSortingStatus.isAscending ? (
                                            tabSortingStatus.sortCondition === "alphabetical" ? (
                                                <i className="fa-solid fa-arrow-down-a-z"></i>
                                            ) : (
                                                <i className="fa-solid fa-arrow-down-z-a"></i>
                                            )
                                        ) : (
                                            <i className="fa-solid fa-arrow-down-z-a"></i>
                                        )}
                                    </div>
                                </Tooltip>
                                <Tooltip title="Sort By Priority" placement="bottom">
                                    <div
                                        className={styles.sort_button_container}
                                        onClick={() => handleSortByPriority(tabName)}
                                    >
                                        {tabSortingStatus.isAscending ? (
                                            tabSortingStatus.sortCondition === "priority" ? (
                                                <i className="fa-solid fa-arrow-down-1-9"></i>
                                            ) : (
                                                <i className="fa-solid fa-arrow-down-9-1"></i>
                                            )
                                        ) : (
                                            <i className="fa-solid fa-arrow-down-9-1"></i>
                                        )}
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    {tabSearchInput ? (
                        <TodoList
                            todos={tabTodoList.filter((todoItem: Todo) =>
                                todoItem.todo.toLowerCase().includes(tabSearchInput)
                            )}
                            taskMaxCharacterLength={taskMaxCharacterLength}
                        />
                    ) : (
                        <TodoList todos={tabTodoList} taskMaxCharacterLength={taskMaxCharacterLength} />
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
