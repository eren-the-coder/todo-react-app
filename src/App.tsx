import { useReducer, useState } from 'react'
import './App.css'
interface Task {
  id?: number;
  text: string;
  done: boolean;
}

const initialState: Task[] = []

const App = () => {
  const [text, setText] = useState('');
  const [todos, dispatch] = useReducer(reducer, initialState)

  const handleAddTask = () => {
    if (!text) return
    dispatch({ type: 'ADD_TASK', value: text })
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
  | { type: 'ADD_TASK', value: string }
  | { type: 'DELETE_TASK', id: number }
  | { type: 'TOGGLE_TASK', id: number }

const reducer = (state: Task[], action: Action) => {
  switch (action.type) {

  case 'ADD_TASK':
    return [...state, { id: Date.now(), text: action.value, done: false }]

  case 'DELETE_TASK':
    return state.filter(task => task.id !== action.id)

  case 'TOGGLE_TASK':
    return state.map(task => (task.id === action.id) ? { ...task, done: !task.done } : task)

  default:
    return state
  }
}
