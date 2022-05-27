import React from "react";
import { useState, useEffect } from "react";
import "../../styles/create-quiz.css";
import axios from "axios";

const ViewQuiz = (props) => {
  const { quizId } = props;
  const [questions, setQuetions] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/quiz/question/${quizId}`, {
        headers: { "Access-Control-Allow-Origin": "*" },
      })
      .then((response) => console.log(response));
  }, []);

  const renderQuizQuestions = () => {};
  return (
    <div className="quiz-form-container">
      <div className="quiz-question-container">
        <h3 className="quiz-question"></h3>
        <h3 className="quiz-answer"></h3>
      </div>
    </div>
  );
};

export default ViewQuiz;
