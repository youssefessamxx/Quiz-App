import React from "react";

function Options({ question, dispatch, answer }) {
  const isAnswerd = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${answer === index ? "answer" : ""} ${
            isAnswerd
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={index}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          disabled={isAnswerd}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
