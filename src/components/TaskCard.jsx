import React from "react";
import { CheckCircle, Trash2, Pencil } from "lucide-react";

const TaskCard = ({ task, onComplete, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onComplete}
          className={`p-1 rounded-full ${
            task.completed ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <CheckCircle className="text-white" size={24} />
        </button>

        <div className="flex flex-col">
          <span
            className={`text-lg font-semibold ${
              task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title}
          </span>
          {task.description && (
            <span className="text-sm text-gray-500">{task.description}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
