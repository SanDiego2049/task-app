import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [taskToEdit, setTaskToEdit] = useState(null); 
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate, token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://taskapp-self.vercel.app/tasks/?skip=0&limit=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      setLoading(true);
      const res = await fetch("https://taskapp-self.vercel.app/tasks/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks((prev) => [newTask, ...prev]);
        setTaskTitle("");
        setTaskDescription("");
        toast.success("Task created successfully!");
      } else {
        toast.error("Failed to create task.");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id, completed, title, description) => {
    try {
      await fetch(`https://taskapp-self.vercel.app/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          completed: !completed,
        }),
      });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      toast.success("Task updated!");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`https://taskapp-self.vercel.app/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      await fetch(`https://taskapp-self.vercel.app/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" />

      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">Task Manager</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-transform hover:scale-105"
        >
          Logout
        </button>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex flex-col gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          required
        />
        <textarea
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          rows={3}
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-transform hover:scale-105"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <PlusCircle size={20} />
              Add Task
            </>
          )}
        </button>
      </form>

      {loading && tasks.length === 0 ? (
        <div className="text-center text-gray-500">Loading tasks...</div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() =>
                  handleCompleteTask(
                    task.id,
                    task.completed,
                    task.title,
                    task.description
                  )
                }
                onDelete={() => handleDeleteTask(task.id)}
                onEdit={() => handleEditTask(task)}
              />
            ))
          ) : (
            <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
              No tasks yet. Add one!
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <TaskModal
          task={taskToEdit}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
