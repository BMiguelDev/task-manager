import React from "react";

import styles from "./InputField.module.scss";

// Interface that defines the types of the props
interface Props {
    inputTodo: string;
    setInputTodo: React.Dispatch<React.SetStateAction<string>>;
    handleSubmitTodoWithReducer: (e: React.FormEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}

const InputField = ({ inputTodo, setInputTodo, handleSubmitTodoWithReducer, inputRef }: Props) => {
    return (
        <form className={styles.input} onSubmit={handleSubmitTodoWithReducer}>
            <input
                type="input"
                value={inputTodo}
                onChange={(e) => setInputTodo(e.target.value)}
                placeholder="Enter a task"
                className={styles.input_box}
                ref={inputRef}
            />
            <button type="submit" className={styles.input_submit}>
                Go
            </button>
        </form>
    );
};
export default InputField;
