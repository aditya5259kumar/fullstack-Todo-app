import React, { useContext } from "react";
import { GrAdd, GrUpdate, GrUndo } from "react-icons/gr";
import { MdDownloadDone } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

import { AuthConetext } from "../context/AuthContext";
import { TodoContext } from "../context/TodoContext";
import { createTodoAPI, updateTodoAPI, deleteTodoAPI } from "../services/api";
import { ToastContainer, toast } from "react-toastify";

const Todo = () => {
  const { isLoggedIn, loginHandler } = useContext(AuthConetext);

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
      loginHandler(e);
      return;
    }

    console.log(todo);

    const title = todo.title;
    const description = todo.description;

    if (!title) {
      toast.error("Write something to add!");
      return;
    }

    try {
      if (editingId !== null) {
        const response = await updateTodoAPI(editingId, {
          title,
          description:description,
        });

        updateTodoInState(editingId, response.todo || response.data);
        setEditingId(null);
        // alert("Todo updated successfully!");
        toast.success("Todo updated successfully!");
      } else {
        const response = await createTodoAPI({
          title,
          description,
        });

        addTodoToState(response.todo || response.data);
        toast.success("Todo created successfully!");
      }
      setTodo({ title: "", description: "" });
    } catch (error) {
      // alert(error.message || "Failed to save todo");
      toast.error(error.message || "Failed to save todo!");
    }
  }

  // Delete todo
  async function deleteHandler(id) {
    if (!window.confirm("Are you sure you want to delete this todo?")) {
      return;
    }

    try {
      await deleteTodoAPI(id);
      removeTodoFromState(id);

      if (editingId === id) {
        setTodo({ title: "", description: "" });
        setEditingId(null);
      }

      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete todo");
    }
  }

  // done todo
  async function handleDoneToggle(id, currentStatus) {
    console.log(currentStatus)
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
    <>
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <form
          onSubmit={submitHandler}
          action=""
          className="flex flex-col gap-3 my-14"
        >
          <div className="flex gap-3">
            <input
              type="text"
              name="title"
              autoComplete="off"
              placeholder="Title"
              onChange={inputHandler}
              value={todo.title}
              className="flex-1 font-bold focus:outline-blue-400 rounded-xl border-2 border-gray-300 px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 py-2 px-6 border font-semibold rounded-md text-white bg-gray-900 border-amber-50 hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              <span className="text-sm">
                {editingId !== null ? <GrUndo /> : <GrAdd />}
              </span>
              {editingId !== null ? "Update" : "Add"}
            </button>
            <ToastContainer />
          </div>

          <input
            name="description"
            placeholder="Add description"
            onChange={inputHandler}
            value={todo.description}
            autoComplete="off"
            className="w-full focus:outline-blue-400 rounded-xl border-2 border-gray-300 px-3 py-2"
          />
        </form>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-4 text-gray-500">Loading todos...</div>
        )}

        {/* if user is not logged in or has no todos */}
        {!loading && todoData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No todos yet!</p>
            <p className="text-sm mt-2">
              {isLoggedIn
                ? "Create your first todo above"
                : "Please log in to manage your todos"}
            </p>
          </div>
        )}

        <div>
          <ul className="flex flex-col space-y-4">
            {todoData.map((item) => (
              <li
                key={item._id || item.id}
                className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b-2 pb-4 border-gray-200"
              >
                <button
                  onClick={() =>
                    handleDoneToggle(item._id || item.id, item.isComplete)
                  }
                  className="flex items-center gap-1 bg-blue-500 text-sm font-semibold py-2 px-4 rounded-md text-white self-start sm:self-auto hover:bg-blue-600"
                >
                  <span className="text-lg">
                    {item.isComplete ? <GrUndo /> : <MdDownloadDone />}
                  </span>
                  {item.isComplete ? "Undo" : "Done"}
                </button>

                <div
                  className="w-full sm:flex-1 px-0 sm:px-8"
                  style={{
                    textDecoration: item.isComplete ? "line-through" : "",
                    opacity: item.isComplete ? 0.6 : 1,
                  }}
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-gray-600">{item.description}</p>
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => handleEdit(item)}
                    disabled={item.isComplete}
                    className="flex items-center gap-1 py-2 text-sm font-semibold px-6 border rounded-md text-white bg-gray-900 border-amber-50 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg">
                      <FaRegEdit />
                    </span>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandler(item._id || item.id)}
                    className="flex items-center gap-1 py-2 text-sm font-semibold px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                  >
                    <span className="text-lg">
                      <RiDeleteBinLine />
                    </span>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Todo;
