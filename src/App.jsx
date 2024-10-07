import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DetailPage from "./pages/DetailPage";
import MainPage from "./pages/MainPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/poketmon/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
