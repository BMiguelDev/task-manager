import React from 'react'

import styles from './InputField.module.scss';


// interface that defines the types of the props
interface Props {
    todo: string;
    setTodo: React.Dispatch<React.SetStateAction<string>>;
    // handleSubmitTodo: (e: React.FormEvent) => void;
    handleSubmitTodoWithReducer: (e: React.FormEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}


const InputField/*: React.FC<Props>*/ = ({ todo, setTodo, handleSubmitTodoWithReducer /*handleSubmitTodo*/, inputRef }: Props) => {
    return (
        <form className={styles.input} onSubmit={ handleSubmitTodoWithReducer /*handleSubmitTodo*/ }>
            <input
                type="input"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder="Enter a task" 
                className={styles.input_box}
                ref={inputRef}
            />
            <button type='submit' className={styles.input_submit}>Go</button>
        </form>
    )
}
export default InputField;