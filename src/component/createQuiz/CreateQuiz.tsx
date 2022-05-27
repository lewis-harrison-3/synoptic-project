import React from "react";
import { useState, useEffect } from "react";
import "../../styles/create-quiz.css";
import axios from "axios";

const CreateQuiz = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [quizName, setQuizName] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizInputs, setQuizInputs] = useState([
    {
      question: "",
      options: [
        {
          isAnswer: false,
          optionText: "",
        },
      ],
    },
  ]);

  console.log(quizName);
  console.log(quizInputs);

  const renderQuestionInput = () => {
    let questionIndex = 0;

    return quizInputs.map((input, index) => {
      questionIndex = index;
      console.log(questionIndex);

      return (
        <div key={index + 1} className="question-inputs-container">
          <div className="row-container">
            <label className="question-label" htmlFor={`question-${index + 1}`}>
              {`Question ${index + 1}`}
            </label>
            <input
              type="text"
              className="question-input"
              id={`question-${index + 1}`}
              value={input.question}
              onChange={(e) => {
                let newQuizInput = quizInputs.slice();
                newQuizInput[index].question = e.target.value;
                setQuizInputs(newQuizInput);
              }}
            />
          </div>

          {/* onChange events needed for inputs */}

          {quizInputs[index].options.map((option, index) => {
            return (
              <div key={index + 1} className="question-inputs-container">
                <div className="row-container">
                  <label
                    className="question-label"
                    htmlFor={`option-${index + 1}`}
                  >{`Option ${index + 1}`}</label>
                  <input
                    className="question-input"
                    key={index + 1}
                    type="text"
                    id={`option-${index + 1}-input`}
                    value={option.optionText}
                    data-optionindex={index}
                    data-questionindex={questionIndex}
                    onChange={(e) => {
                      let newQuizInput = quizInputs.slice();
                      newQuizInput[e.target.dataset.questionindex].options[
                        index
                      ].optionText = e.target.value;
                      setQuizInputs(newQuizInput);
                    }}
                  />
                  <input
                    id={`option-${index + 1}-checkbox`}
                    name={`question-${questionIndex + 1}-radio-btn`}
                    type="radio"
                    checked={quizInputs[questionIndex].options[index].isAnswer}
                    data-checked={
                      quizInputs[questionIndex].options[index].isAnswer
                    }
                    data-questionindex={questionIndex}
                    onChange={(e) => {
                      // check if other .isAnswers are true first,chnge to be false

                      let newQuizInput = quizInputs.slice();
                      newQuizInput[e.target.dataset.questionindex].options[
                        index
                      ].isAnswer = e.target.checked;
                      setQuizInputs(newQuizInput);
                      //   const checkboxes = document.querySelectorAll(
                      //     `[data-checkboxquestionindex='${questionIndex}']`
                      //   );
                      //   let isChecked = false;
                      //   checkboxes.forEach((checkbox) => {
                      //     console.log(checkbox);
                      //     checkbox.checked
                      //     const checked =
                      //       checkbox.getAttribute("data-checked") === "true";
                      //     console.log(checked);
                      //     if (checked === true) {
                      //       isChecked = true;
                      //     }
                      //   });
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    });
  };

  const addAnswerOption = (questionIndex) => {
    let newQuizInputs = quizInputs.slice();

    newQuizInputs[questionIndex].options.push({
      isAnswer: false,
      optionText: "",
    });

    setQuizInputs(newQuizInputs);
  };

  const deleteAnswerOption = (questionIndex) => {
    let newQuizInputs = quizInputs.slice();

    if (newQuizInputs[questionIndex].options.length === 1) {
      console.log("Must have atleast one answer");
      // put an alert pop here
    } else {
      newQuizInputs[questionIndex].options.pop();

      setQuizInputs(newQuizInputs);
    }
  };

  const addNewQuestion = () => {
    let newQuizInputs = quizInputs.slice();

    newQuizInputs.push({
      question: "",
      options: [
        {
          isAnswer: false,
          optionText: "",
        },
      ],
    });

    setQuestionIndex((prev) => prev + 1);

    setQuizInputs(newQuizInputs);
  };

  const deleteQuestion = () => {
    let newQuizInputs = quizInputs.slice();

    newQuizInputs.pop();

    setQuizInputs(newQuizInputs);
    setQuestionIndex((prev) => prev - 1);
  };

  // add remove question option
  // and navigation
  // hide inactive question

  const getDate = () => {
    const todaysDate = new Date();
    const year = todaysDate.getFullYear();
    const monthInt = todaysDate.getMonth() + 1;
    const date = todaysDate.getDate();
    let monthString: string;

    if (monthInt < 10) {
      monthString = 0 + monthInt.toString();
    } else {
      monthString = monthInt.toString();
    }

    return `${year}-${monthString}-${date}`;
  };

  const submitOnClick = async () => {
    const date = getDate();

    let quizId = 1;
    let questionId = 0;

    const quizBody = {
      name: quizName,
      userId: 1, // will need to fetch this from state later
      createdDate: date,
      updatedDate: date,
    };

    console.log(quizBody);

    await axios
      .post("http://localhost:5000/api/quiz/createQuiz", quizBody)
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          console.log("quiz submitted to server");
          console.log(response.data.insertId);

          quizId = response.data.insertId;
          console.log(quizId);
        } else {
          console.log("failed to submit quiz to server");
        }
      });

    // console.log(quizId);

    quizInputs.forEach(async (question, index) => {
      console.log(quizId);

      const questionBody = {
        question: question.question,
        quizId: quizId,
        createdDate: date,
        updatedDate: date,
      };

      await axios
        .post("http://localhost:5000/api/quiz/createQuestion", questionBody)
        .then((response) => {
          console.log(response);

          if (response.status === 200) {
            console.log("quiz submitted to server");
            questionId = response.data.insertId;
          } else {
            console.log("failed to submit quiz to server");
          }
        });

      question.options.forEach(async (option) => {
        const optionBody = {
          answer: option.optionText,
          questionId: questionId,
          isCorrect: option.isAnswer === true ? 1 : 0,
          createdDate: date,
          updatedDate: date,
        };

        await axios
          .post("http://localhost:5000/api/quiz/createAnswer", optionBody)
          .then((response) => {
            console.log(response);

            if (response.status === 200) {
              console.log("quiz submitted to server");
            } else {
              console.log("failed to submit quiz to server");
            }
          });
      });
    });
  };

  return (
    <div className="quiz-form-container">
      <form action="">
        <div className="quiz-name-container">
          <label className="quiz-name-label" htmlFor="quizName">
            Quiz Name
          </label>
          <input
            type="text"
            id="quizName"
            className="quiz-name-input"
            value={quizName}
            onChange={(e) => {
              setQuizName(e.target.value);
            }}
          />
        </div>
        {renderQuestionInput()}
        <a
          className="finish-btn"
          href="#"
          onClick={() => {
            submitOnClick();
          }}
        >
          <div>Finish</div>
        </a>
      </form>

      <div className="form-btn-group">
        <a
          className="form-btn"
          href="#"
          onClick={() => {
            addAnswerOption(questionIndex);
          }}
        >
          <div>Add Option</div>
        </a>
        <a
          href="#"
          className="form-btn"
          onClick={() => {
            deleteAnswerOption(questionIndex);
          }}
        >
          <div>Delete Option</div>
        </a>
        <a
          href="#"
          className="form-btn"
          onClick={() => {
            addNewQuestion();
          }}
        >
          <div>New Question</div>
        </a>
        <a
          href="#"
          className="form-btn"
          onClick={() => {
            deleteQuestion();
          }}
        >
          <div>Delete Question</div>
        </a>
      </div>
    </div>
  );
};

export default CreateQuiz;
