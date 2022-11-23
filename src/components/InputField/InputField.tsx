import React from "react";

import styles from "./InputField.module.scss";

// Interface that defines the types of the props
interface PropTypes {
    inputText: string;
    handleSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChangeInputText: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef: React.RefObject<HTMLInputElement>;
}

export default function InputField({ inputText, inputRef, handleSubmitForm, handleChangeInputText }: PropTypes) {
    return (
        <form className={styles.input_form} onSubmit={handleSubmitForm}>
            <input
                type="input"
                value={inputText}
                onChange={(e) => handleChangeInputText(e)}
                placeholder="Enter a title"
                className={styles.input_field}
                ref={inputRef}
            />
            <button type="submit" className={styles.input_button}>
                Add
            </button>
        </form>
    );
};
