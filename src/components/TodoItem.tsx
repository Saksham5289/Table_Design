import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { removeTodo } from "../helperFuncs"; // Adjust import path if needed

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
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  index,
  provided,
  todos,
  setTodos,
  columnsCount,
}) => {
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

  console.log(`Rendering TodoItem:`, todo);

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
          onClick={() => {
            console.log(`Remove todo triggered for todo id: ${todo.id}`);
            removeTodo(todos, setTodos, todo.id);
          }}
        >
          <TrashIcon className="w-6 h-6" />
        </button>
        <span>{todo.serialNumber}</span>
      </div>
      {todo.values.map((value, colIndex) => (
        <div
          key={colIndex}
          className="w-40 h-32 border-2 border-gray-300 flex items-center justify-center relative"
        >
          {value ? (
            <img
              src={value}
              alt="Uploaded"
              className="object-cover w-full h-full"
            />
          ) : (
            colIndex > 0 && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(todo.id, colIndex, e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoItem;
