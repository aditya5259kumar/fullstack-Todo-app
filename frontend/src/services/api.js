
const API_BASE_URL = "https://fullstack-todo-app-grtj.onrender.com/api/user";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

//auth api
export const signUpAPI = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const logInAPI = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  const token = data.token || data.accessToken || data.data?.token;

  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    console.error("No token received from login API:", data);
  }

  return data;
};

// myprofile

export const myProfileAPI = async () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// todos API

export const createTodoAPI = async (todoData) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/auth/create-todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(todoData),
  });

  return handleResponse(response);
};

export const getTodosAPI = async () => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/auth/get-todo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const updateTodoAPI = async (id, todoData) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/auth/update-todo/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(todoData),
  });

  return handleResponse(response);
};

export const deleteTodoAPI = async (id) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/auth/delete-todo/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Logout helper
export const logoutUser = () => {
  localStorage.removeItem("authToken");
};
