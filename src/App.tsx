import { useReducer, useState, useEffect } from 'react'
import './App.css'

const initialState: Task[] = [];

// Fonction pour charger les tâches depuis le localStorage
const loadTasks = (): Task[] => {
  const savedTasks = localStorage.getItem('todos');
  if (savedTasks) {
    return JSON.parse(savedTasks);
  }
  return [];
};

function App() {
  const [todos, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState('');

  // Charger les tâches au montage du composant
  useEffect(() => {
    const loadedTasks = loadTasks();
    if (loadedTasks.length > 0) {
      loadedTasks.forEach(task => {
        dispatch({ type: "ADD_TASK", text: task.text, done: task.done, id: task.id });
      });
    }
  }, []);

  // Sauvegarder les tâches dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (!text) {
      alert("Le champ doit être rempli !!");
      return;
    }
    dispatch({ type: "ADD_TASK", text: text });
    setText('');
  }

  return (
    <div className="container">
      <h1>Todo List avec typescript</h1>
      <div className="input-group">
        <input
        type="text"
        value={text} 
        placeholder="Votre tâche ici..."
        onChange={e => setText(e.target.value)}
        />
        <button onClick={addTask}>Ajouter</button>
      </div>
      <hr />
      <ul>
        {todos.map(task => (
          <li 
            key={task.id}
            onClick={() => {
              if (task.id) dispatch({ type: "TOGGLE_TASK", id: task.id })
            }}
          >
            <span style={{ textDecoration: task.done ? "line-through" : "" }}>
              {task.text}
            </span>
            <button className="delete-button" onClick={e => {
              e.stopPropagation();
              if (task.id) dispatch({ type: "DELETE_TASK", id: task.id })
            }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface Task {
  id?: number;
  text: string;
  done: boolean;
}

type Action = 
  | { type: 'ADD_TASK', text: string, done?: boolean, id?: number }
  | { type: 'DELETE_TASK', id: number }
  | { type: 'TOGGLE_TASK', id: number }

const reducer = (state: Task[], action: Action): Task[] => {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = { 
        id: action.id || Date.now(), 
        text: action.text, 
        done: action.done || false 
      };
      return [...state, newTask];}
    case 'DELETE_TASK':
      return state.filter(t => t.id !== action.id);
    case 'TOGGLE_TASK':
      return state.map(t => (t.id === action.id) ? { ...t, done: !t.done } : t);
    default:
      throw new Error('Action non définie !!!');
  }
}

export default App