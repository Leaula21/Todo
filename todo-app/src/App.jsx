import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post("/api/tasks", { title: newTask, completed: false });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    try {
      const response = await axios.put(`/api/tasks/${editingTask._id}`, { ...editingTask, title: editTitle });
      setTasks(tasks.map(task => task._id === response.data._id ? response.data : task));
      setEditingTask(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <main>
      <h1>Todo List</h1>
      <div>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add new task" 
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      {editingTask && (
        <div>
          <input 
            type="text" 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)} 
            placeholder="Edit task title" 
          />
          <button onClick={handleUpdateTask}>Update Task</button>
        </div>
      )}
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title} - {task.completed ? 'Completed' : 'Pending'}
            <button onClick={() => { setEditingTask(task); setEditTitle(task.title); }}>Edit</button>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
