import React, {useState, useEffect} from 'react';
import tasks from '../tasks'
import TodoTitle from "./TodoTitle";
import TodoListItem from "./TodoListItem";
import {useDispatch, useSelector} from "react-redux";
import {
    sortPrior,
    addTodoAction,
    deleteTodoAction,
    setTasks,
    setProjectOptions,
    filterTasksAction, setFilteringProjectAction, sortFilteredAction, setCounterAction
} from "../redux/actions/TodoActions";


const TodoList = () => {
    const todos = useSelector(a => a.todolist.tasks)
    const filtered = useSelector(f => f.todolist.filteredItems)
    const projectOptions = useSelector(s => s.todolist.projectOptions)
    const filteringProject = useSelector(s => s.todolist.filteringProject)
    const counter = useSelector(s => s.todolist.counter)
    const dispatch = useDispatch()
    const [task, setTask] = useState({});
    const [isViewChange, setIsViewChange] = useState(false)
    const [isSorting, setIsSorting] = useState(false)
    useEffect(() => {
        dispatch(setProjectOptions())
    }, [dispatch])
    const addTodo = () => {
        task.id = counter
        dispatch(addTodoAction(task))
        dispatch(setProjectOptions())
        setIsViewChange(!isViewChange)
    }
    const deleteTodo = (id) => {
        dispatch(deleteTodoAction(id))
    }
    const doneTodo = (id) => {
        todos.map(el => el.id === id ? {...el, done: !el.done} : el)
    }
    const sortTodo = () => {
        setIsSorting(true)
        dispatch(sortPrior())
    }
    const changeView = () => {
        let newId = todos[todos.length - 1].id + 1
        dispatch(setCounterAction(newId))
        setIsViewChange(true)
    }
    const handleTask = (e) => {
        setTask({...task, [e.target.name]: e.target.value})
    }
    const unSort = () => {
        setIsSorting(false)
        dispatch(setTasks())
        dispatch(filterTasksAction(filteringProject))
    }
    const filterTasks = (project) => {
            dispatch(filterTasksAction(project))
            dispatch(setFilteringProjectAction(project))
            dispatch(sortFilteredAction())
    }
    return (
        <div className='d-flex justify-content-center flex-column'>
            <TodoTitle todos={todos}/>
            <ul className="list-group">
                {filtered.length === 0 ?
                    todos.map((el) => (
                        <TodoListItem key={el.id} el={el} doneTodo={doneTodo} deleteTodo={deleteTodo}
                        />
                    )) : filtered.map((el) => (
                        <TodoListItem key={el.id} el={el} doneTodo={doneTodo} deleteTodo={deleteTodo}
                        />
                    ))
                }
            </ul>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                {
                    isViewChange ? (
                        <div className='d-flex flex-column'>
                            <label htmlFor="name"></label>
                            <input type="text" id='name' required='required' name='task' placeholder='Название' onChange={handleTask}/>
                            <label htmlFor="desc"></label>
                            <input type="text" id='desc' required='required' name='info' placeholder='Описание' onChange={handleTask}/>
                            <label htmlFor="prior"></label>
                            <input type="text" id='prior'  required='required' name='prior' placeholder='Приоритет' onChange={handleTask}/>
                            <label htmlFor="project"></label>
                            <input type="text" id='project' required='required' name='project' placeholder='Проект' onChange={handleTask}/>
                            <button
                                className='btn btn-primary mt-3'
                                onClick={addTodo}
                                disabled={Object.keys(task).length === 0}
                            >
                                Добавить
                            </button>
                        </div>
                    ) : <button
                        className='btn btn-primary'
                        onClick={changeView}>Добавить
                    </button>
                }
                {
                    isSorting ? <button
                            className='btn btn-primary'
                            onClick={unSort}
                        >Не сортировать
                        </button> :
                        <button
                            className='btn btn-primary'
                            onClick={sortTodo}
                        >По приоритету
                        </button>
                }
                <select onChange={(e) => filterTasks(e.target.value)}>
                    {
                        projectOptions.map(item => (
                            <option key={item} value={item}>{item}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
};

export default TodoList;