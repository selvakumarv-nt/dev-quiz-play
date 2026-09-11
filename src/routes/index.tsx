import { useState } from "react";
import { ArrowRight, Check, Code2, RotateCcw, Sparkles, X } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

type Screen = "welcome" | "quiz" | "results";
type Question = { prompt: string; topic: string; options: string[]; answer: number };

const questions: Question[] = [
  { prompt: "Which HTML element is used for the largest, most important heading?", topic: "Semantic HTML", options: ["<heading>", "<h1>", "<head>", "<title>"], answer: 1 },
  { prompt: "Which CSS layout system is best suited to arranging items in a single row or column?", topic: "CSS Layout", options: ["Float", "Position", "Flexbox", "Table layout"], answer: 2 },
  { prompt: "Which JavaScript method adds a new item to the end of an array?", topic: "JavaScript", options: ["shift()", "slice()", "push()", "concat()"], answer: 2 },
  { prompt: "What does the CSS property `display: grid` create?", topic: "CSS Grid", options: ["A two-dimensional layout", "A database grid", "A text effect", "A hidden element"], answer: 0 },
  { prompt: "Which attribute connects a <label> to its form control?", topic: "Accessibility", options: ["name", "target", "for", "connect"], answer: 2 },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "CodeSprint | Interactive Web Quiz" },
    { name: "description", content: "Test your web development fundamentals with a focused five-question interactive quiz." },
    { property: "og:title", content: "CodeSprint | Interactive Web Quiz" },
    { property: "og:description", content: "A fast, friendly quiz for practicing HTML, CSS, and JavaScript fundamentals." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function Index() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[currentQuestion];
  const answered = selectedAnswer !== null;

  function startQuiz() {
    setCurrentQuestion(0); setSelectedAnswer(null); setScore(0); setScreen("quiz");
  }
  function chooseAnswer(index: number) { if (!answered) setSelectedAnswer(index); }
  function moveToNextQuestion() {
    if (selectedAnswer === null) return;
    const nextScore = score + (selectedAnswer === question.answer ? 1 : 0);
    setScore(nextScore);
    if (currentQuestion === questions.length - 1) { setScreen("results"); return; }
    setCurrentQuestion((value) => value + 1); setSelectedAnswer(null);
  }

  return (
    <div className="quiz-app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CodeSprint home"><span className="brand-mark"><Code2 size={19} /></span><span>Code<span className="brand-highlight">Sprint</span></span></a>
        <p className="header-note">Web foundations / 01</p>
      </header>
      <main id="top" className="quiz-main">
        {screen === "welcome" && <section className="welcome-screen screen-enter" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p className="eyebrow"><Sparkles size={15} /> A five-minute knowledge check</p>
            <h1 id="welcome-title">Build your<br /><em>web fluency.</em></h1>
            <p className="intro-copy">A quick, focused quiz on the building blocks behind every great website. No pressure — just a sharper edge.</p>
            <button className="primary-button" type="button" onClick={startQuiz}>Start the quiz <ArrowRight size={18} /></button>
            <p className="micro-copy">5 questions <span>·</span> instant results <span>·</span> no sign-up</p>
          </div>
          <aside className="welcome-art" aria-label="Quiz details">
            <div className="art-topline"><span>QUIZ / 001</span><span>2026</span></div>
            <div className="art-code" aria-hidden="true"><span className="code-muted">&lt;main&gt;</span><span className="code-indent"><span className="code-tag">&lt;h1&gt;</span> curiosity <span className="code-tag">&lt;/h1&gt;</span></span><span className="code-indent"><span className="code-tag">&lt;p&gt;</span> practice makes progress <span className="code-tag">&lt;/p&gt;</span></span><span className="code-muted">&lt;/main&gt;</span></div>
            <div className="art-stamp">READY<br />SET<br /><strong>CODE.</strong></div>
            <div className="art-footline"><span>HTML / CSS / JS</span><span>EST. 2026</span></div>
          </aside>
        </section>}

        {screen === "quiz" && <section className="quiz-screen screen-enter" aria-labelledby="question-title">
          <div className="quiz-heading"><div><p className="eyebrow">Question {String(currentQuestion + 1).padStart(2, "0")} <span>/</span> {String(questions.length).padStart(2, "0")}</p><h1 id="question-title">Think it through.</h1></div><p className="topic-label">{question.topic}</p></div>
          <div className="progress-wrap"><progress value={currentQuestion} max={questions.length - 1} aria-label={`Question ${currentQuestion + 1} of ${questions.length}`} /><span>{Math.round((currentQuestion / questions.length) * 100)}% complete</span></div>
          <div className="question-panel"><p className="question-number">0{currentQuestion + 1}</p><h2>{question.prompt}</h2>
            <div className="answer-list" role="radiogroup" aria-label="Answer choices">
              {question.options.map((option, index) => { const isSelected = selectedAnswer === index; const isCorrect = answered && index === question.answer; const isIncorrect = answered && isSelected && !isCorrect; return <button className={`answer-option${isSelected ? " selected" : ""}${isCorrect ? " correct" : ""}${isIncorrect ? " incorrect" : ""}`} type="button" role="radio" aria-checked={isSelected} key={option} onClick={() => chooseAnswer(index)}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{isCorrect && <Check className="answer-icon" size={18} aria-label="Correct answer" />}{isIncorrect && <X className="answer-icon" size={18} aria-label="Incorrect answer" />}</button>; })}
            </div>
            <div className="question-actions"><p className="selection-hint" aria-live="polite">{answered ? "Answer locked in." : "Select one answer to continue."}</p><button className="primary-button" type="button" onClick={moveToNextQuestion} disabled={!answered}>{currentQuestion === questions.length - 1 ? "See my score" : "Next question"} <ArrowRight size={18} /></button></div>
          </div>
        </section>}

        {screen === "results" && <section className="results-screen screen-enter" aria-labelledby="results-title"><div className="results-copy"><p className="eyebrow"><Sparkles size={15} /> Quiz complete</p><h1 id="results-title">Keep that<br /><em>momentum.</em></h1><p className="intro-copy">You showed up, thought carefully, and made it to the finish line. That is how fluency grows.</p><button className="secondary-button" type="button" onClick={startQuiz}><RotateCcw size={17} /> Try again</button></div><div className="score-panel" aria-label={`You scored ${score} out of ${questions.length}`}><span className="score-label">Your score</span><strong>{score}<small>/{questions.length}</small></strong><span className="score-message">{score === questions.length ? "Perfectly shipped." : score >= 3 ? "Solid foundations." : "Keep exploring."}</span><div className="score-rule" /><p>Every question is a new place to start.</p></div></section>}
      </main>
      <footer className="site-footer"><span>Made for curious minds.</span><span>HTML <b>/</b> CSS <b>/</b> JavaScript</span></footer>
    </div>
  );
}