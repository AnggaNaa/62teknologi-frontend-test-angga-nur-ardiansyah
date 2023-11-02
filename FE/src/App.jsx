import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { Detail } from "./pages/Detail";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/detail/:id" element={<Detail />}></Route>
      </Routes>
    </>
  );
}

export default App;
