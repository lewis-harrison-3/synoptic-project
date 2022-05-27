import React from "react";
import CreateQuiz from "./component/createQuiz/CreateQuiz";
import ViewQuiz from "./component/viewQuiz/ViewQuiz";
import { Routes, Route } from "react-router-dom";
// create quiz grid component
// create account grid component
// content varies depending on input

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CreateQuiz />} />
        <Route path="/viewQuiz" element={<ViewQuiz quizId={1} />} />
      </Routes>
    </div>
  );
}

export default App;
