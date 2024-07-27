// TodoTable.tsx
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  removeTodo,
  addColumn,
  addTodo,
  removeColumn,
  handleDragEnd,
} from "../helperFuncs"; // Adjust the import path as needed
import TodoItem from "./TodoItem"; // Adjust import path if needed

interface Todo {
  serialNumber: number;
  id: number;
  values: string[];
}

const TodoTable: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [columns, setColumns] = useState<string[]>([
    "Column 1",
    "Column 2",
    "Column 3",
  ]);

  const onDragEnd = (result: any) => {
    console.log("onDragEnd called with result:", result);
    handleDragEnd(result, todos, setTodos);
  };
  //asdasdasdasd
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable-todos"
        // type="group"
        direction="vertical"
      >
        {(provided) => {
          console.log("Droppable provided:", provided);
          return (
            <div
              className="p-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <div className="flex space-x-2 mb-2">
                    <div className="w-20">Actions</div>
                    {columns.map((col, index) => (
                      <div key={index} className="w-40 flex items-center">
                        <span>{col}</span>
                        <button
                          className="ml-2 p-1 text-red-500 hover:text-red-700"
                          onClick={() =>
                            removeColumn(
                              index,
                              columns,
                              setColumns,
                              todos,
                              setTodos
                            )
                          }
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                    <div className="w-40 flex items-center">
                      <button
                        className="p-1 text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          addColumn(columns, setColumns, todos, setTodos)
                        }
                      >
                        <PlusCircleIcon className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided) => {
                        console.log("Draggable provided:", provided);
                        return (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            index={index}
                            provided={provided}
                            todos={todos}
                            setTodos={setTodos}
                            columnsCount={columns.length}
                          />
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="mt-2 flex justify-end">
                    <button
                      className="p-1 text-green-500 hover:text-green-700"
                      onClick={() => addTodo(todos, setTodos, columns)}
                    >
                      <PlusCircleIcon className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoTable;
