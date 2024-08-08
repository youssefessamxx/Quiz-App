import React from "react";

function Prograss({ index, points, maxPoints, numQuestions, answer }) {
  return (
    <div className="progress">
      <progress
        max={numQuestions}
        value={index + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>
    </div>
  );
}

export default Prograss;
