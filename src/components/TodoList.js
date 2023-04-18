import React, {useState} from "react";
import TodoItem from "./Todoitem"
import styles from "../styles/TodoList.module.css";

const TodoList = () => {
    const today=new Date();
    const today_str=`${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`
    const [itemInput,setItem] = useState("");
    const [dateInput,setDate] = useState(today_str);
    const [todos,setTodos] = useState([]);
    const [but,setbut]=useState('리마인더 추가하기');
    const [modid,setmodid] =useState("")

    const addTodo = () => {
        if (itemInput.trim()==="" || dateInput==="") return;

        if (but==="리마인더 추가하기"){
            setTodos([...todos,{id:Date.now(),item:itemInput,date:dateInput,completed:false}]);
            setItem("");setDate(today_str);
        } else {
            setTodos(todos.map((todo)=>todo.id==modid? {...todo,item:itemInput,date:dateInput}:todo));
            setItem("");setDate(today_str);setbut("리마인더 추가하기")
            setmodid("");
        }
        
    }

    const toggleTodo = (id) => {
        setTodos(todos.map((todo)=>todo.id===id? {...todo,completed:!todo.completed}:todo));
    }

    const modiTodo = (id) => {
        const selected=todos.filter((todo)=>todo.id===id)[0]
        setItem(selected.item);setDate(selected.date);setbut("리마인더 수정하기");
        setmodid(id);
    }

    const delTodo = (id) => {
        if (but=="리마인더 수정하기"){
            const selected=todos.filter((todo)=>todo.id===modid)[0];
            console.log(selected);
            if (id===selected.id){
                setItem("");setDate(today_str);setbut("리마인더 추가하기");
                setmodid("");
            }
        }
        setTodos(todos.filter((todo)=>todo.id!==id));
    }
    //렌더링
    return (
        <div className="max-w-600 w-2/5 mx-auto p-10 bg-white shadow-xl rounded-lg">
            <h1 className="text-4xl text-orange-500 mb-7 font-extrabold underline underline-light underline-offset-1 decoration-double">Reminder</h1>
            <div className={styles.input_group}>
                <input
                type="text"
                className="w-full p-1 mb-4 border border-gray-300 rounded shadow-lg"
                value={itemInput}
                onChange={(e)=>setItem(e.target.value)}
                />
                <input
                type="date"
                className="w-2/5 p-1 mb-4 border border-gray-300 rounded shadow-lg"
                value={dateInput}
                onChange={(e)=>{setDate(e.target.value)}}
                />
            </div>
            <button className={but=="리마인더 추가하기"? 
            "shadow-lg w-40 justify-self-end p-1 mb-4 bg-blue-500 text-white border border-blue-500 \
            rounded hover:bg-white hover:text-blue-500"
            :"shadow-lg w-40 justify-self-end p-1 mb-4 bg-green-500 text-white border border-green-500 \
            rounded hover:bg-white hover:text-green-500"
            } onClick={addTodo}>
                {but}
            </button>
            <ul>
                {todos.map((todo)=>(
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={()=>toggleTodo(todo.id)}
                        onModi={()=>modiTodo(todo.id)}
                        onDel={()=>delTodo(todo.id)}
                    />
                ))}
            </ul>
        </div>
    );
};

export default TodoList;