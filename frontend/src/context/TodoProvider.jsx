import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { ModelContext } from "./ModelContext";
import { TodoContext } from "./TodoContext";
import { myProfileAPI, getTodosAPI, logoutUser } from "../services/api";

function TodoProvider({ children }) {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [showLogin, setshowLogin] = useState(false);
  const [showSignUp, setshowSignUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [todo, setTodo] = useState({
    title: "",
    description: "",
  });
  const [todoData, setTodoData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) return;

    async function fetchProfile() {
      try {
        const response = await myProfileAPI();

        setCurrentUser(response.data);
        setisLoggedIn(true);
      } catch (err) {
        handleLogout();
      }
    }

    fetchProfile();
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setisLoggedIn(true);
      fetchTodos();
    }
  }, []);

  // Fetch todos from backend
  async function fetchTodos() {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No token found, cannot fetch todos");
        setLoading(false);
        return;
      }

      const response = await getTodosAPI();
      // Adjust based on your API response structure
      setTodoData(response.todos || response.data || []);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      if (
        error.message.includes("401") ||
        error.message.includes("unauthorized") ||
        error.message.includes("Invalid Token")
      ) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  // --------------login handler----------------
  function loginHandler() {
    setshowLogin(true);
    setshowSignUp(false);
  }

  // --------------signup handler----------------
  function signupHandler() {
    setshowLogin(false);
    setshowSignUp(true);
  }

  // --------------profile handler----------------
  function profileHandler(e) {
    e.preventDefault();
    setShowProfile((prev) => !prev);
  }

  // --------------close handler----------------
  function closeModelHandler() {
    setShowProfile(false);
    setshowLogin(false);
    setshowSignUp(false);
  }

  // --------------logout handler----------------
  function handleLogout() {
    logoutUser();
    setisLoggedIn(false);
    setCurrentUser(null);
    setTodoData([]);
    setTodo({
      title: "",
      description: "",
    });
    setEditingId(null);
    closeModelHandler();
  }

  // Set logged in state and user data
  async function setUserLoggedIn() {
  try {
    setisLoggedIn(true);

    const response = await myProfileAPI();

    setCurrentUser(response.data);

    closeModelHandler();

    fetchTodos();
  } catch (err) {
    console.error(err);
    handleLogout();
  }
}

  // --------------input handler----------------
  function inputHandler(e) {
    const { name, value } = e.target;
    setTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ----------------submit handler (placeholder)----------------
  // This will be overridden in Todo component with API call
  function submitHandler(e) {
    e.preventDefault();
    // This is now handled in the Todo component
  }

  // ----------------done handler (placeholder)----------------
  function doneHandler(id) {
    setTodoData((prev) =>
      prev.map((item) =>
        item.id === id || item._id === id
          ? { ...item, isComplete: !item.isComplete }
          : item,
      ),
    );
  }

  // ----------------edit handler----------------
  function handleEdit(item) {
    // console.log(item);
    setTodo({ title: item.title, description: item.description });
    setEditingId(item.id || item._id);
  }

  // ----------------delete handler (placeholder)----------------
  function deleteHandler(id) {
    // This is now handled in the Todo component
  }

  // Add a todo to local state (after API success)
  function addTodoToState(newTodo) {
    setTodoData((prev) => [...prev, newTodo]);
  }

  // Update a todo in local state (after API success)
  function updateTodoInState(id, updatedTodo) {
    setTodoData((prev) =>
      prev.map((item) =>
        item.id === id || item._id === id ? { ...item, ...updatedTodo } : item,
      ),
    );
  }

  // Remove a todo from local state (after API success)
  function removeTodoFromState(id) {
    setTodoData((prev) =>
      prev.filter((item) => item.id !== id && item._id !== id),
    );
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn,
          loginHandler,
          setUserLoggedIn,
          handleLogout,
          currentUser,
        }}
      >
        <ModelContext.Provider
          value={{
            showLogin,
            loginHandler,
            showSignUp,
            signupHandler,
            closeModelHandler,
            showProfile,
            profileHandler,
          }}
        >
          <TodoContext.Provider
            value={{
              todo,
              todoData,
              editingId,
              inputHandler,
              submitHandler,
              doneHandler,
              handleEdit,
              deleteHandler,
              setTodo,
              setEditingId,
              addTodoToState,
              updateTodoInState,
              removeTodoFromState,
              fetchTodos,
              loading,
            }}
          >
            {children}
          </TodoContext.Provider>
        </ModelContext.Provider>
      </AuthContext.Provider>
    </>
  );
}
export default TodoProvider;
