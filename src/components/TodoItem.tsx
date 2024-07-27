import React, { useState } from "react";
import {
  TrashIcon,
  ArrowsUpDownIcon,
  PlusIcon,
  PencilSquareIcon, // For image change
} from "@heroicons/react/24/outline";

interface Todo {
  serialNumber: number;
  id: number;
  values: string[];
}

interface TodoItemProps {
  todo: Todo;
  index: number;
  provided: any;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  columnsCount: number;
  showAlert: (message: string, type: "success" | "error") => void; // Added this prop
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  index,
  provided,
  todos,
  setTodos,
  columnsCount,
  showAlert,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleImageUpload = (
    id: number,
    colIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log(
      `Image upload triggered for todo id: ${id}, column index: ${colIndex}`
    );
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(
          `Image loaded for todo id: ${id}, column index: ${colIndex}`
        );
        setTodos(
          todos.map((t) => {
            if (t.id === id) {
              const updatedValues = [...t.values];
              updatedValues[colIndex] = reader.result as string;
              return { ...t, values: updatedValues };
            }
            return t;
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (colIndex: number) => {
    document.getElementById(`file-input-${colIndex}`)?.click();
  };

  const handleImageDelete = (id: number, colIndex: number) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          const updatedValues = [...t.values];
          updatedValues[colIndex] = ""; // Clear the image
          return { ...t, values: updatedValues };
        }
        return t;
      })
    );
  };

  const handleRemoveTodo = () => {
    console.log(`Remove todo triggered for todo id: ${todo.id}`);
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((t) => t.id !== todo.id);
      if (updatedTodos.length < prevTodos.length) {
        showAlert("Row removed!", "error");
      }
      return updatedTodos;
    });
  };

  return (
    <div
      className="flex space-x-2 items-center p-2 rounded shadow mb-2"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="w-20 flex items-center">
        <button
          className="mr-2 p-1 text-red-500 hover:text-red-700"
          onClick={handleRemoveTodo} // Use the handleRemoveTodo function
        >
          <TrashIcon className="w-6 h-6" />
        </button>
        <span>{todo.serialNumber}</span>
        <ArrowsUpDownIcon className="w-6 h-6" />
      </div>

      {todo.values.map((value, colIndex) => (
        <div
          key={colIndex}
          className={`${
            colIndex === 0 ? "w-60" : "w-40"
          } h-32 border-2 border-gray-300 flex items-center justify-center relative group`}
          onMouseEnter={() => setHoveredIndex(colIndex)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {value ? (
            <div className="relative w-full h-full">
              <img
                src={value}
                alt="Uploaded"
                className="object-cover w-full h-full"
              />
              {hoveredIndex === colIndex && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
                  <button
                    onClick={() => handleImageChange(colIndex)}
                    className="p-2 mx-2"
                  >
                    <PencilSquareIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleImageDelete(todo.id, colIndex)}
                    className="p-2 mx-2"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          ) : colIndex > 0 ? (
            <div className="relative flex items-center justify-center w-full h-full">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(todo.id, colIndex, e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                id={`file-input-${colIndex}`}
              />
              <div className="flex items-center justify-center w-3/4 h-1/4 text-gray-500 border bg-slate-100">
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Add Image</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-3/4 h-1/4 text-gray-500 border bg-slate-100">
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm">Add Product Filter</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoItem;
