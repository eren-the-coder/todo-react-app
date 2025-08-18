import { useContext, useEffect, useReducer, useState } from 'react'
import './App.css'
import { ThemeContext } from './Theme';

const TODOS_STORAGE_KEY = 'todos'
interface Task {
  id?: number;
  text: string;
  done: boolean;
}

const initialState: Task[] = []

const App = () => {
  const { theme, setTheme } = useContext(ThemeContext)
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
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
    if (editingId !== null) {
      dispatch({ type: 'EDIT_TASK', id: editingId, text })
      setEditingId(null);
    } else {
      dispatch({ type: 'ADD_TASK', text: text })
    }
    setText('');
  }

  return (
    <div className={`container ${theme}`}>
      <div className="header">
        <h1>MyTodo</h1>
        <button
          onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? 'dark' : 'light'}
        </button>
      </div>

      <div className="input-group">
        <input
          type="text" 
          placeholder={editingId !== null ? 'Edit your task...' : 'Type your task here...'}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={handleAddTask}>{editingId !== null ? 'Save' : 'Add'}</button>
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
            <div className="todo-actions">
              <button
                className="edit-btn"
                aria-label="Edit task"
                title="Edit task"
                onClick={e => {
                  e.stopPropagation();
                  if (task.id) {
                    setEditingId(task.id);
                    setText(task.text);
                  }
                }}
              >edit</button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (task.id)
                    dispatch({ type: 'DELETE_TASK', id: task.id })
                }}
              >del</button>
            </div>
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
  | { type: 'EDIT_TASK', id: number, text: string }

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

  case 'EDIT_TASK':
    return state.map(task => (
      task.id === action.id) ? { ...task, text: action.text } : task)

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
