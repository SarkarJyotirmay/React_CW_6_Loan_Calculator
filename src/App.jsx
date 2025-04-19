import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Chart as ChartJs } from "chart.js/auto";
import { Pie } from "react-chartjs-2";

function App() {
  const [principal, setPrincipal] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  let yearsRef = useRef(0);

  let chartRef = useRef("");
  const [chartStatus, setChartStatus] = useState(false);

  const [monthlyInterestRate, setMonthlyInterestRate] = useState(0);
  const [numberOfPayments, setNumberOfPayments] = useState(0);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalEMI, setTotalEMI] = useState(0);
  const [totalRepaymentAmount, setTotalRepaymentAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  function handlePrincipalChange(val) {
    const numPrincipal = Number(val);
    const defaultDown = downPayment || 0;
    const updatedLoan = numPrincipal - defaultDown;
    setPrincipal(numPrincipal);
    setDownPayment(defaultDown);
    setLoanAmount(updatedLoan);
  }

  function handleDownPaymentChange(val) {
    const numDown = Number(val);
    const defaultLoan = loanAmount || 0;
    const loanRemaining = defaultLoan - numDown;

    setDownPayment(numDown);
    setLoanAmount(loanRemaining);
  }

  function handleLoanAmountChange(val) {
    const numLoanAmount = Number(val);
    const defaultPrincipal = principal || 0;
    const downpay = defaultPrincipal - numLoanAmount;

    setLoanAmount(numLoanAmount);
    setDownPayment(downpay);
  }

  function calculateLoan(val) {
    yearsRef.current = val;

    const r = interestRate / 100 / 12;
    const n = val * 12;

    const emi =
      (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalEMI = emi * n;
    const totalRepayment = loanAmount + totalEMI;
    const interestPayed = totalRepayment - loanAmount;

    setMonthlyInterestRate(r);
    setNumberOfPayments(n);
    setMonthlyEMI(parseFloat(emi.toFixed(2)));
    setTotalEMI(totalEMI.toFixed(2));
    setTotalRepaymentAmount(totalRepayment.toFixed(2));
    setTotalInterest(interestPayed);
  }

  return (
    <>
      <div className="container h-auto md:h-screen bg-amber-50 flex flex-col md:flex-row gap-8 py-12 px-6">
        {/* Left wala section */}
        <div className="inputs min-h-[100%] w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6">
          {/* principal input */}
          <div className="input flex flex-col gap-2">
            <label
              htmlFor="principal"
              className="text-lg font-semibold text-gray-700"
            >
              Principal is{" "}
              <span className="text-indigo-600 font-bold">${principal}</span>
            </label>
            <input
              type="range"
              min={0}
              max={10000}
              step={1000}
              value={principal}
              id="principal"
              onChange={(e) => handlePrincipalChange(e.target.value)}
              className="accent-indigo-600"
            />
          </div>

          {/* down payment input */}
          <div className="input flex flex-col gap-2">
            <label
              htmlFor="down-payment"
              className="text-lg font-semibold text-gray-700"
            >
              Down Payment is{" "}
              <span className="text-indigo-600 font-bold">${downPayment}</span>
            </label>
            <input
              type="range"
              min={1000}
              max={10000}
              step={1000}
              value={downPayment}
              id="down-payment"
              onChange={(e) => handleDownPaymentChange(e.target.value)}
              className="accent-indigo-600"
            />
          </div>

          {/* loan amount input */}
          <div className="input flex flex-col gap-2">
            <label
              htmlFor="loan-amount"
              className="text-lg font-semibold text-gray-700"
            >
              Loan Amount is{" "}
              <span className="text-indigo-600 font-bold">${loanAmount}</span>
            </label>
            <input
              type="range"
              min={1000}
              max={10000}
              step={1000}
              value={loanAmount}
              id="loan-amount"
              onChange={(e) => handleLoanAmountChange(e.target.value)}
              className="accent-indigo-600"
            />
          </div>

          {/* interest rate input */}
          <div className="input flex flex-col gap-2">
            <label
              htmlFor="interest-rate"
              className="text-lg font-semibold text-gray-700"
            >
              Interest Rate is{" "}
              <span className="text-indigo-600 font-bold">{interestRate}%</span>
            </label>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={interestRate}
              id="interest-rate"
              onChange={(e) => setInterestRate(e.target.value)}
              className="accent-indigo-600"
            />
          </div>

          {/* loan tenure input select */}
          <div className="input">
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-medium text-gray-700">
                Tenure
              </legend>
              <select
                name="tenure"
                id="tenureSelect"
                className="mt-2 border border-gray-300 rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={(e) => calculateLoan(e.target.value)}
              >
                <option value="">Select your tenure</option>
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="15">15 years</option>
                <option value="20">20 years</option>
              </select>
            </fieldset>
          </div>
        </div>

        {/* right wala section = chart + EMI  */}
        <div className="result-div min-h-[100%] w-full md:w-[45%] bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-indigo-600">Loan Summary</h2>
          <p className="text-md font-medium text-gray-700">
            Monthly EMI:{" "}
            <span className="text-green-600 font-bold">${monthlyEMI}</span>
          </p>
          <p className="text-md font-medium text-gray-700">
            Total EMI:{" "}
            <span className="text-green-600 font-bold">${totalEMI}</span>
          </p>
          <p className="text-md font-medium text-gray-700">
            Total Repayment:{" "}
            <span className="text-red-600 font-bold">
              ${totalRepaymentAmount}
            </span>
          </p>

          <div className="chart mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Payment Breakdown
            </h3>
            <div className="w-full h-[280px]">
              <Pie
                data={{
                  labels: ["Loan Amount", "Total Interest", "Total Repayment"],
                  datasets: [
                    {
                      label: "Payment",
                      data: [loanAmount, totalInterest, totalRepaymentAmount],
                      backgroundColor: ["#6366f1", "#f97316", "#16a34a"],
                      borderColor: "#fff",
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
