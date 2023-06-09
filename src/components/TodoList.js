import React, {useState,useEffect} from "react";
import {useSession,signOut} from "next-auth/react";

import TodoItem from "./Todoitem"
import styles from "../styles/TodoList.module.css";

//firebase
import {db} from "../firebase";
import {
    collection,
    query,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    where,
} from "firebase/firestore";
import { publicRuntimeConfig } from "../../next.config";

const todoCollection = collection(db,"todos");
const ids = collection(db,"ids");

const TodoList = () => {
    const today=new Date();
    const today_str=`${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`
    const [itemInput,setItem] = useState("");
    const [dateInput,setDate] = useState(today_str);
    const [todos,setTodos] = useState([]);
    const [but,setbut]=useState('추가하기');
    const [modid,setmodid] =useState("");

    const [privat,setprivat]=useState(false);
    const [baseid,setbaseid]=useState("");

    const {data} =useSession();


    //userID 있는지 없는지 확인
    const get_privat=async()=>{
        const q2=query(ids);
        const result2=await getDocs(q2);
        setprivat(false);
        result2.docs.forEach((doc)=>{
            // console.log(doc.data().userId,data?.user?.id,doc.data().userId==data?.user?.id);
            if (doc.data().userId==data?.user?.id){
                setbaseid(doc.id)
                setprivat(true);
                }
        });
    }

    const add_id_privat=async()=>{
        console.log(privat);
        if (privat){
            const del_doc=doc(ids,baseid);
            await deleteDoc(del_doc);
            alert("Now public");
            setprivat(false);
        } else {
            const docRef = await addDoc(ids, {
                userId: data?.user?.id,
            });
            alert("Now private");
            setprivat(true);
        }
    }

    const getTodos = async () => {

        if (!data?.user?.name) return;

        const q=query(
            todoCollection,
            where("userId","==",data?.user?.id));
        // const q = query(collection(db, "todos"), where("user", "==", user.uid));
        // const q = query(todoCollection, orderBy("date", "desc"));

        const results=await getDocs(q);
        
        const newTodos =[];

        results.docs.forEach((doc)=>{
            newTodos.push({id:doc.id, ...doc.data() });
        });
        newTodos.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
        // console.log(newTodos);
        setTodos(newTodos);
    }

    useEffect(()=>{
        getTodos();
    },[data]);
    useEffect(()=>{
        get_privat();
    },[data]);

    const addTodo = async () => {
        if (itemInput.trim()==="" || dateInput==="") return;

        if (but==="추가하기"){
            const docRef = await addDoc(todoCollection, {
                userId: data?.user?.id,
                item:itemInput,
                date:dateInput,
                completed:false,
            });
            setTodos([...todos,{id:docRef.id,item:itemInput,date:dateInput,completed:false}].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()));
            setItem("");setDate(today_str);
        } else {
            const newTodos=todos.map((todo)=>{
                if (todo.id==modid){
                    const todoDoc=doc(todoCollection,modid);
                    updateDoc(todoDoc,{item:itemInput,date:dateInput});
                    return {...todo,item:itemInput,date:dateInput}
                } else {
                    return todo;
                }
            })
            // setTodos(todos.map((todo)=>todo.id==modid? {...todo,item:itemInput,date:dateInput}:todo));
            newTodos.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
            setTodos(newTodos);
            setItem("");setDate(today_str);setbut("추가하기")
            setmodid("");
        }
        
    }

    const toggleTodo = (id) => {
        // setTodos(todos.map((todo)=>todo.id===id? {...todo,completed:!todo.completed}:todo));
        const newTodos=todos.map((todo)=>{
            if (todo.id==id){
                const todoDoc=doc(todoCollection,id);
                updateDoc(todoDoc,{completed:!todo.completed});
                return {...todo,completed:!todo.completed}
            } else {
                return todo;
            }
        });
        setTodos(newTodos);
    }

    const modiTodo = (id) => {
        const selected=todos.filter((todo)=>todo.id===id)[0]
        setItem(selected.item);setDate(selected.date);setbut("수정하기");
        setmodid(id);
    }

    const delTodo = (id) => {
        // console.log(todos);
        // console.log(id);
        if (but=="수정하기"){
            const selected=todos.filter((todo)=>todo.id===modid)[0];
            if (id===selected.id){
                setItem("");setDate(today_str);setbut("추가하기");
                setmodid("");
            }
        }
        const todoDoc=doc(todoCollection,id);
        console.log("!",todoDoc);
        deleteDoc(todoDoc);
        setTodos(todos.filter((todo)=>todo.id!==id));
    }
    //렌더링
    return (
        <div className="max-w-600 w-2/5 mx-auto p-10 bg-white shadow-xl rounded-lg">
            <h1 className="text-4xl text-orange-500 mb-7 font-extrabold underline underline-light underline-offset-1 decoration-double">{data?.user?.name}'s Reminder</h1>
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
            <button className={but=="추가하기"? 
            "shadow-lg w-20 justify-self-end p-1 mb-4 bg-blue-500 text-white border border-blue-500 \
            rounded hover:bg-white hover:text-blue-500"
            :"shadow-lg w-20 justify-self-end p-1 mb-4 bg-green-500 text-white border border-green-500 \
            rounded hover:bg-white hover:text-green-500"
            } onClick={addTodo}>
                {but}
            </button>
            <button className={privat? "shadow-lg w-20 justify-self-end p-1 mb-4 ml-5 bg-orange-500 text-white border border-orange-500 \
            rounded hover:bg-white hover:text-orange-500"
            : "shadow-lg w-20 justify-self-end p-1 mb-4 ml-5 bg-green-500 text-white border border-green-500 \
            rounded hover:bg-white hover:text-green-500"
            } onClick={()=>add_id_privat()}>{privat? "private":"public"}</button>
            <button className={"shadow-lg w-20 justify-self-end p-1 mb-4 ml-5 bg-red-500 text-white border border-red-500 \
            rounded hover:bg-white hover:text-red-500"
            } onClick={()=>signOut()}>Sign out</button>
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