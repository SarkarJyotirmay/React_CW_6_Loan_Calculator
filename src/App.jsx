import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Chart as ChartJs } from "chart.js/auto";
import {Pie} from "react-chartjs-2"

function App() {
  // input related states
  const [principal, setPrincipal] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  let yearsRef = useRef(0);

  //! chart
  // any how assign / grab chart canvas and call show chart
  // show chart will display chart with chart ref(chart ref = canvas reference)
  let chartRef = useRef("");
  const [chartStatus, setChartStatus] = useState(false);

  // loan related states
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(0)
  const [numberOfPayments, setNumberOfPayments] = useState(0)
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalEMI, setTotalEMI] = useState(0);
  const [totalRepaymentAmount, setTotalRepaymentAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  

// ! handle principal function
  function handlePrincipalChange(val) {
    const numPrincipal = Number(val);
    const defaultDown = downPayment || 0;
    const updatedLoan = numPrincipal - defaultDown;
    setPrincipal(numPrincipal);
    setDownPayment(defaultDown);
    setLoanAmount(updatedLoan);
  }

  // ! hande down payment function
  function handleDownPaymentChange(val) {
    const numDown = Number(val);
    const defaultLoan = loanAmount || 0;
    const loanRemaining = defaultLoan - numDown;

    setDownPayment(numDown);
    setLoanAmount(loanRemaining);
  }

// ! handle loan amount function
  function handleLoanAmountChange(val) {
    const numLoanAmount = Number(val);
    const defaultPrincipal = principal || 0;
    const downpay = defaultPrincipal - numLoanAmount;

    setLoanAmount(numLoanAmount);
    setDownPayment(downpay);
  }

  // ! calculate loan
  function calculateLoan(val){
    yearsRef.current = val;

    const r = (interestRate / 100) / 12; // anual interest rate
    const n = val * 12; // tenure in months
  
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); //monthly emi
    const totalEMI = emi * n;
    const totalRepayment = loanAmount + totalEMI;
    const interestPayed = totalRepayment - loanAmount

  
    setMonthlyInterestRate(r);
    setNumberOfPayments(n);
    setMonthlyEMI(parseFloat(emi.toFixed(2)));
    setTotalEMI(totalEMI.toFixed(2));
    setTotalRepaymentAmount(totalRepayment.toFixed(2));
    setTotalInterest(interestPayed)
  }
  // console.log("mr",monthlyInterestRate, "np",numberOfPayments,"emi",monthlyEMI);


  return (
    <>
      <div className="container flex gap-4 border-1 py-12 px-6">
        {/* Left wala section */}
        <div className="inputs w-[50%] border-1 flex flex-col gap-4 p-4">
          {/* principal input */}
          <div className="input  flex flex-col gap-2 border-1">
            <label htmlFor="principal">Principal is ${principal}</label>
            <input
              type="range"
              min={1000}
              max={10000}
              step={1000}
              value={principal}
              id="principal"
              onChange={(e) => handlePrincipalChange(e.target.value)}
            />
          </div>
          {/* down payment input */}
          <div className="input  flex flex-col gap-2 border-1">
            <label htmlFor="down-payment">Down Payment is ${downPayment}</label>
            <input
              type="range"
              min={1000}
              max={10000}
              step={1000}
              value={downPayment}
              id="down-payment"
              onChange={(e) => handleDownPaymentChange(e.target.value)}
            />
          </div>
          {/* loan amount input */}
          <div className="input  flex flex-col gap-2 border-1">
            <label htmlFor="loan-amount">Loan Amount is ${loanAmount}</label>
            <input
              type="range"
              min={1000}
              max={10000}
              step={1000}
              value={loanAmount}
              id="loan-amount"
              onChange={(e) => handleLoanAmountChange(e.target.value)}
            />
          </div>
          {/* interest rate input */}
          <div className="input  flex flex-col gap-2 border-1">
            <label htmlFor="interest-rate">
              Interest rate is {interestRate}%
            </label>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={interestRate}
              id="interest-rate"
              onChange={(e) => setInterestRate(e.target.value)}
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
                className="mt-2 border border-gray-300 rounded p-2"
                onChange={(e)=>calculateLoan(e.target.value)}
              >
                <option value="" >Select your tenure</option>
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="15">15 years</option>
                <option value="20">20 years</option>
              </select>
            </fieldset>
          </div>
        </div>

        {/* right wala section = chart + EMI  */}
        <div className="result-div w-[45%] border-1 border-red-500">
          <p>Monthly EMI is : $ {monthlyEMI}</p>
          <p>Total EMI is : $ {totalEMI}</p>
          <p>Calculated Repayment is : $ {totalRepaymentAmount}</p>

          <div className="chart border-1 h-[280px]">
            <p>my chart : </p>
            <Pie 
            data={{
              labels: ["Loan Amount", "Total Interest", "Total Repayment"],
              datasets:[
                {
                  label:"payment",
                  data:[loanAmount, totalInterest, totalRepaymentAmount]
                }
              ]
            }}
            />
          </div>
          
         
        </div>
      </div>
    </>
  );
}

export default App;
