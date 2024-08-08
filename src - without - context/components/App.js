import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Prograss from "./Prograss";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECO_PER_QUESTION = 30;

// initialState
const initialState = {
  questions: [],
  // laoding - ready - active - error - finish
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remainingseconds: null,
};

// reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "dataRecevied":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailded":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        remainingseconds: state.questions.length * SECO_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        // status: "active",
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finished":
      return {
        ...state,
        status: "finish",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "tick":
      return {
        ...state,
        remainingseconds: state.remainingseconds - 1,
        stauts: state.remainingseconds === 0 ? "finished" : state.stauts,
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
      };

    default:
      throw new Error("Invalid action");
  }
};

function App() {
  const [
    { questions, status, index, answer, points, highscore, remainingseconds },
    dispatch,
  ] = useReducer(reducer, initialState);
  // console.log(questions);
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
  // console.log(maxPoints);

  useEffect(() => {
    fetch("http://localhost:3030/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecevied", payload: data }))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <>
              <Prograss
                index={index}
                points={points}
                maxPoints={maxPoints}
                numQuestions={numQuestions}
                answer={answer}
              />

              <Question
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />
            </>
            <Footer>
              <Timer remainingseconds={remainingseconds} dispatch={dispatch} />
              <NextButton
                answer={answer}
                dispatch={dispatch}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finish" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
