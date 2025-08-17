import { useEffect, useReducer, useState } from 'react'
import './App.css'

const TODOS_STORAGE_KEY = 'todos'
interface Task {
  id?: number;
  text: string;
  done: boolean;
}

const initialState: Task[] = []

const App = () => {
  const [text, setText] = useState('');
  const [todos, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const loadedTasks = loadTasks();
    if (loadedTasks.length > 0) {
      loadedTasks.forEach(task => {
        dispatch({ type: "ADD_TASK", text: task.text, done: task.done, id: task.id })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const handleAddTask = () => {
    if (!text) return
    dispatch({ type: 'ADD_TASK', text: text })
    setText('');
  }

  return (
    <div className='container'>
      <h1>MyTodo</h1>

      <div className="input-group">
        <input
          type="text" 
          placeholder='Type your task here...'
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <hr />

      {todos.length === 0 && <p>No tasks found</p>}
      <ul>
        {todos.map(task => (
          <li key={task.id} >
            <span
              className={ task.done ? 'line-through' : '' }
              onClick={() => {
                if (task.id)
                  dispatch({ type: 'TOGGLE_TASK', id: task.id })
              }}
            >{task.text}</span>
            <button
              onClick={e => {
                e.stopPropagation();
                if (task.id)
                  dispatch({ type: 'DELETE_TASK', id: task.id })
              }}
            >&times;</button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default App

type Action = 
  | { type: 'ADD_TASK', text: string, done?: boolean, id?: number }
  | { type: 'DELETE_TASK', id: number }
  | { type: 'TOGGLE_TASK', id: number }

const reducer = (state: Task[], action: Action) => {
  switch (action.type) {

  case 'ADD_TASK':
    return [...state, {
      id: action.id ?? Date.now(),
      text: action.text,
      done: action.done ?? false
    }]

  case 'DELETE_TASK':
    return state.filter(task => task.id !== action.id)

  case 'TOGGLE_TASK':
    return state.map(task => (
      task.id === action.id) ? { ...task, done: !task.done } : task)

  default:
    return state
  }
}

const loadTasks = (): Task[] => {
  const savedTasks = localStorage.getItem(TODOS_STORAGE_KEY)
  if (savedTasks) {
    return JSON.parse(savedTasks)
  }
  return []
}
