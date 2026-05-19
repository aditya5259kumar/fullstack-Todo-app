import React, { useContext } from "react";
import { GrAdd, GrUndo } from "react-icons/gr";
import { MdDownloadDone } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

import { AuthContext } from "../context/AuthContext";
import { TodoContext } from "../context/TodoContext";
import { createTodoAPI, updateTodoAPI, deleteTodoAPI } from "../services/api";

import { toast } from "react-toastify";

const Todo = () => {
  const { isLoggedIn, loginHandler } = useContext(AuthContext);

  const {
    todo,
    todoData,
    editingId,
    inputHandler,
    doneHandler,
    handleEdit,
    setTodo,
    setEditingId,
    addTodoToState,
    updateTodoInState,
    removeTodoFromState,
    loading,
  } = useContext(TodoContext);

  async function submitHandler(e) {
    e.preventDefault();

    if (!isLoggedIn) {
      loginHandler();
      return;
    }

    const title = todo.title.trim();
    const description = todo.description.trim();

    if (!title) {
      toast.error("Write something to add!");
      return;
    }

    try {
      if (editingId !== null) {
        const response = await updateTodoAPI(editingId, {
          title,
          description,
        });

        updateTodoInState(editingId, response.todo || response.data);

        setEditingId(null);

        toast.success("Todo updated successfully!");
      } else {
        const response = await createTodoAPI({
          title,
          description,
        });

        addTodoToState(response.todo || response.data);

        toast.success("Todo created successfully!");
      }

      setTodo({
        title: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to save todo!");
    }
  }

  async function deleteHandler(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?",
    );

    if (!confirmDelete) return;

    try {
      await deleteTodoAPI(id);

      removeTodoFromState(id);

      if (editingId === id) {
        setTodo({
          title: "",
          description: "",
        });

        setEditingId(null);
      }

      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete todo");
    }
  }

  async function handleDoneToggle(id, currentStatus) {
    try {
      await updateTodoAPI(id, {
        isComplete: !currentStatus,
      });

      doneHandler(id);
    } catch (error) {
      toast.error(error.message || "Failed to update todo status");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Stay productive every day.
          </h1>

          <p className="text-gray-500 mt-2">
            A clean space for your tasks, ideas, and priorities.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              autoComplete="off"
              placeholder="Enter todo title..."
              value={todo.title || ""}
              onChange={inputHandler}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-lg font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <textarea
              name="description"
              rows="4"
              autoComplete="off"
              placeholder="Write description..."
              value={todo.description || ""}
              onChange={inputHandler}
              className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-4 text-white font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
            >
              <span className="text-sm">
                {editingId !== null ? <GrUndo /> : <GrAdd />}
              </span>

              {editingId !== null ? "Update Todo" : "Add Todo"}
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-500 font-medium">
            Loading todos...
          </div>
        )}

        {/* Empty State */}
        {!loading && todoData.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
            <p className="text-2xl font-bold text-gray-700">No todos yet</p>

            <p className="text-gray-500 mt-2">
              {isLoggedIn
                ? "Create your first todo above."
                : "Login to manage your todos."}
            </p>
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-5">
          {todoData.map((item) => {
            const todoId = item._id || item.id;

            return (
              <div
                key={todoId}
                className={`bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
                  item.isComplete
                    ? "border-blue-200 bg-blue-50/40"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* Left Content */}
                  <div
                    className="flex-1"
                    style={{
                      textDecoration: item.isComplete ? "line-through" : "none",
                      opacity: item.isComplete ? 0.65 : 1,
                    }}
                  >
                    <h2 className="text-lg font-medium text-gray-900">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {item.description || "No description"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {/* Done */}
                    <button
                      type="button"
                      onClick={() => handleDoneToggle(todoId, item.isComplete)}
                      className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition ${
                        item.isComplete
                          ? "bg-gray-700 hover:bg-gray-800"
                          : "bg-green-700 hover:bg-green-800"
                      }`}
                    >
                      <span className="text-base">
                        {item.isComplete ? <GrUndo /> : <MdDownloadDone />}
                      </span>

                      {item.isComplete ? "Undo" : "Done"}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      disabled={item.isComplete}
                      className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      <FaRegEdit />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deleteHandler(todoId)}
                      className="flex items-center gap-2 rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
                    >
                      <RiDeleteBinLine />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Todo;
