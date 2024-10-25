import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { v4 } from "uuid";

const Layout = () => {
  console.log(v4());

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pokemon/:id" element={<DetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
