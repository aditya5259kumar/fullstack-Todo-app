import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Navbar />
      <Todo />
       <ToastContainer />
    </>
  );
}

export default App;
