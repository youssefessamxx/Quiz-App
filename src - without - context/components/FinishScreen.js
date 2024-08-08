import React from "react";

function FinishScreen({ points, maxPoints, hightscore, dispatch }) {
  const percentage = Math.ceil((points / maxPoints) * 100);
  return (
    <>
      <p className="result">
        your score {points} out {maxPoints} ( {percentage} %)
      </p>
      <p className="highscore">(Hightscore: {hightscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button>
    </>
  );
}

export default FinishScreen;
