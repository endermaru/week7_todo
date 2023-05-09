import React from "react";
import styles from "../styles/TodoList.module.css"

const TodoItem = ({todo,onToggle,onModi,onDel}) => {
    return (
        <li className="flex-1 my-1 p-2 rounded-lg bg-gray-100 border-2 border-gray-200">
            <input type="checkbox" checked={todo.completed} onChange={onToggle}/>
            <span 
            className="flex-1 ml-2 p-1 text-xl align-middle"
            style={{textDecoration: todo.completed? "line-through":"none"}}
            >
                {todo.item}
            </span>
            <span className="mr-2 p-1 text-xl align-middle"
            style={{textDecoration: todo.completed? "line-through":"none"}}
            >
            {todo.date}
            </span>
            
            <button className="shadow-lg w-15 p-1 mr-1 bg-red-500 text-white border border-red-500 rounded hover:bg-white hover:text-red-500" onClick={onDel}>Delete</button>
            <button className="shadow-lg w-15 p-1 bg-green-500 text-white border border-green-500 rounded hover:bg-white hover:text-green-500" onClick={onModi}>Modi</button>
        </li>
    )
};

export default TodoItem;