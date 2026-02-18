import Router from "./Router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Router />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
