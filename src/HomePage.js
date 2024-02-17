import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase-config'; // Ensure these imports match your project structure
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [filter, setFilter] = useState(""); // For tag-based filtering
  const history = useHistory();

  useEffect(() => {
    if (auth.currentUser) {
      db.collection("tasks")
        .where("userId", "==", auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          const tasksData = [];
          snapshot.forEach((doc) => tasksData.push({ ...doc.data(), id: doc.id }));
          setTasks(tasksData);
        });
    } else {
      history.push("/login");
    }
  }, [history]);

  const addTask = async () => {
    await db.collection("tasks").add({
      text: newTask,
      userId: auth.currentUser.uid,
      tags: [], // Initially empty, adjust as needed for tag functionality
    });
    setNewTask("");
  };

  const deleteTask = async (id) => {
    await db.collection("tasks").doc(id).delete();
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setEditedText(task.text);
  };

  const saveEdit = async (id) => {
    await db.collection("tasks").doc(id).update({
      text: editedText,
    });
    setEditingId(null);
    setEditedText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedText("");
  };

  const logout = () => {
    auth.signOut();
    history.push("/login");
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={logout}>Logout</button>
      <div>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <input 
          type="text" 
          placeholder="Filter by tags" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)} 
        />
      </div>
      {tasks.filter(task => task.tags && task.tags.includes(filter.toLowerCase()) || filter === "").map((task) => (
        <div key={task.id}>
          {editingId === task.id ? (
            <>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button onClick={() => saveEdit(task.id)}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <h5>{task.text}</h5>
              <button onClick={() => editTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default HomePage;
