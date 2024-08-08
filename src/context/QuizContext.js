import { createContext, useContext, useEffect, useReducer } from "react";

// create a context
const quizContext = createContext();
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

function QuizProvider({ children }) {
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
    <quizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        remainingseconds,
        dispatch,
        numQuestions,
        maxPoints,
      }}
    >
      {children}
    </quizContext.Provider>
  );
}

const useQuiz = () => {
  const context = useContext(quizContext);

  return context;
};

export { QuizProvider, useQuiz };
