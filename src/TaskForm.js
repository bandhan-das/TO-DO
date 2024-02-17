import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import your Firebase configuration
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  updateDoc,
} from 'firebase/firestore';

const TaskForm = ({ userId, taskId = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagNames, setTagNames] = useState(''); // Comma-separated tag names
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId) {
      // Load the task and its tags if editing
      loadTask(taskId);
    }
  }, [taskId]);

  const loadTask = async (taskId) => {
    const taskDocRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDocs(taskDocRef);
    if (!taskDoc.exists()) {
      console.log('No such document!');
      return;
    }
    const taskData = taskDoc.data();
    setTitle(taskData.title);
    setDescription(taskData.description);
    // Assuming tags are stored as an array of tag IDs
    const tags = await Promise.all(
      taskData.tags.map(async (tagId) => {
        const tagRef = doc(db, 'tags', tagId);
        const tagDoc = await getDocs(tagRef);
        return tagDoc.exists() ? tagDoc.data().name : '';
      }),
    );
    setTagNames(tags.join(', '));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Split tagNames into an array and trim whitespace
    const tagsArray = tagNames.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const batch = writeBatch(db);

    // For each tagName, check if it exists, if not, create it
    const tagRefs = [];
    for (const tagName of tagsArray) {
      const tagQuery = query(collection(db, 'tags'), where('name', '==', tagName), where('userId', '==', userId));
      const tagSnapshot = await getDocs(tagQuery);
      let tagRef;
      if (tagSnapshot.empty) {
        // Tag doesn't exist, create a new one
        const newTagRef = await addDoc(collection(db, 'tags'), { name: tagName, userId });
        tagRef = newTagRef;
      } else {
        // Tag exists, get the first (and should be only) document's reference
        tagRef = tagSnapshot.docs[0].ref;
      }
      tagRefs.push(tagRef.id);
    }

    if (taskId) {
      // Update existing task
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        title,
        description,
        tags: tagRefs,
      });
    } else {
      // Create new task
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        userId,
        tags: tagRefs,
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSave}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input type="text" value={tagNames} onChange={(e) => setTagNames(e.target.value)} placeholder="Tags (comma-separated)" />
      <button type="submit" disabled={loading}>Save Task</button>
    </form>
  );
};

export default TaskForm;
