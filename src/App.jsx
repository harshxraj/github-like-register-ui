import { useEffect, useRef, useState } from "react";
import { ReactTyped, Typed } from "react-typed";
import { motion } from "framer-motion";
import "./App.css";

const questions = [
  { question: "What is your name?", step: 1, name: "name" },
  { question: "Enter your Email!", step: 2, name: "email" },
  { question: "Choose yourself a username!", step: 3, name: "username" },
  { question: "Choose a password!", step: 4, name: "password" },
];

function validatePassword(password) {
  return {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[\W_]/.test(password),
  };
}

const getColor = (criterion) => {
  return criterion ? "bg-green-500" : "bg-red-500";
};

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      const results = validatePassword(value);

      setValidationResults(results);
    }
  };
  const [step, setStep] = useState(1);
  const inputRef = useRef([]);

  const [validationResults, setValidationResults] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  console.log("STEP", validationResults);

  useEffect(() => {
    if (step <= questions.length) {
      inputRef.current[step - 1].focus();
    }
  }, [inputRef, step]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 13) {
        const { value } = event.target;

        if (step === 6) {
          return;
        }

        if (value !== "") {
          if (step === 4) {
            if (
              validationResults.hasLowercase &&
              validationResults.hasUppercase &&
              validationResults.hasNumber &&
              validationResults.hasSpecialChar
            ) {
              setStep((prev) => prev + 1);
              setTimeout(() => {
                setStep((prev) => prev + 1);
              }, 4000);
            }
          } else {
            setStep((prev) => prev + 1);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [step, inputRef, validationResults]);

  return (
    <div className="relative h-screen w-screen">
      <div className="">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
          className="text-center text-4xl"
        >
          <h1>Welcome to our app</h1>
        </motion.div>
        <motion.div
          initial={{ y: 100, scale: 0 }}
          animate={{ y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
          className="mockup-code w-[620px] m-auto mt-7"
        >
          {questions &&
            questions.map((question, index) => {
              return (
                question.step <= step && (
                  <>
                    <div key={question.step}>
                      <pre data-prefix="$">
                        {step > question.step ? (
                          <code>{question.question}</code>
                        ) : (
                          <ReactTyped
                            strings={[`${question.question}`]}
                            typeSpeed={40}
                          />
                        )}
                      </pre>
                      <pre
                        data-prefix={step > question.step ? "✓" : ">"}
                        className={`${step > question.step && "text-success"}`}
                      >
                        <input
                          ref={(e) => {
                            inputRef.current[index] = e;
                          }}
                          onChange={handleChange}
                          name={question.name}
                          value={`${formData[question.name]}`}
                          type="text"
                          className={`w-[500px] bg-transparent border-0 py-1 focus:outline-none  ${
                            step > question.step
                              ? "text-success"
                              : "text-warning"
                          }`}
                          disabled={step > question.step}
                          autoComplete="off"
                        />
                      </pre>

                      {question.step == 4 && (
                        <div>
                          <pre data-prefix={"⚠️"} className="text-sm">
                            Password needs a number, a uppercase, a lowercase
                            and a special character
                          </pre>
                          <div className="grid grid-cols-4 gap-4 h-2 px-12 justify-center w-[300px] my-1">
                            <div
                              className={`h-1 ${getColor(
                                validationResults.hasNumber
                              )}`}
                            />
                            <div
                              className={`h-1 ${getColor(
                                validationResults.hasUppercase
                              )}`}
                            />
                            <div
                              className={`h-1 ${getColor(
                                validationResults.hasLowercase
                              )}`}
                            />
                            <div
                              className={`h-1 ${getColor(
                                validationResults.hasSpecialChar
                              )}`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )
              );
            })}

          {step == 5 && (
            <div>
              <pre data-prefix={">"} className={`${"text-success"}`}>
                Creating account
                <ReactTyped
                  strings={["....", "....."]}
                  typeSpeed={50}
                  backSpeed={60}
                  attr="placeholder"
                  loop
                >
                  <input
                    type="text"
                    className="bg-transparent text-success"
                    disabled
                  />
                </ReactTyped>
              </pre>
            </div>
          )}
        </motion.div>
      </div>

      {step == 6 && (
        <motion.div
          initial={{ y: 100, scale: 0 }}
          animate={{ y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
          role="alert"
          className=" text-center border border-white/30 p-3 rounded-md mt-8 w-[600px] m-auto bg-[#2a323c] text-white"
        >
          <span>
            <span className="mr-2">✓</span> Your Account has been created!
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default App;
