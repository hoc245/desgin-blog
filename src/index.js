import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Homepage from "./Pages/Homepage";
import Result from "./Pages/Result";
import Course from "./Pages/Course";
import About from "./Pages/About";
import Account from "./Pages/Account";
<<<<<<< HEAD
import PostManagement from "./Pages/PostManagement";
import PostDetail from "./Pages/PostDetail";
=======
>>>>>>> b29d7b46eca6b733722f0cabae83350f8d5776c3

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="design-blog" element={<Homepage />} />
          <Route path="Homepage" element={<Homepage />}>
            <Route path=":id" element={<Homepage />} />
          </Route>
          <Route path="Result" element={<Result />}>
            <Route path=":id" element={<Result />}>
              <Route path=":id" element={<Result />} />
            </Route>
          </Route>
          <Route path="Course" element={<Course />} />
          <Route path="About" element={<About />} />
          <Route path="Account" element={<Account />} />
<<<<<<< HEAD
          <Route path="Postmanagement" element={<PostManagement />}>
            <Route path="Postdetail" element={<PostDetail />} >
                <Route path=":id" element={<Account />} />
            </Route>
          </Route>
=======
>>>>>>> b29d7b46eca6b733722f0cabae83350f8d5776c3
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
