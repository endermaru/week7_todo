import React from "react";
import styles from "../styles/TodoList.module.css"

const TodoItem = ({todo,onToggle,onModi,onDel}) => {
    return (
        <li className={styles.todoItem}>
            <input type="checkbox" checked={todo.completed} onChange={onToggle}/>
            <span 
            className={styles.todoText} 
            style={{textDecoration: todo.completed? "line-through":"none"}}
            >
                {todo.item}
            </span>
            <span className={styles.todoDate}>
                {todo.date}
            </span>
            <button onClick={onDel}>Delete</button>
            <button onClick={onModi}>Modi</button>
        </li>
    )
};

export default TodoItem;