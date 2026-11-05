"use client";

import React, { useState } from "react";
import { EstimatedPaymentInfo } from "@/types/property";

interface MortgageCalculatorProps {
  price: number;
  estimatedPayment?: EstimatedPaymentInfo;
}

export const MortgageCalculatorSection: React.FC<MortgageCalculatorProps> = ({
  price,
  estimatedPayment,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mortgage calculation state
  const [homePrice, setHomePrice] = useState(price);
  const [downPercent, setDownPercent] = useState(
    estimatedPayment?.downPaymentPercent ?? 20
  );
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  // Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const downPaymentAmount = Math.round((homePrice * downPercent) / 100);
  const principal = homePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const monthlyPrincipalAndInterest =
    monthlyRate > 0 && numberOfPayments > 0
      ? Math.round(
          (principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        )
      : Math.round(principal / (numberOfPayments || 1));

  const monthlyPropertyTax = Math.round((homePrice * 0.012) / 12);
  const monthlyInsurance = Math.round((homePrice * 0.0035) / 12);
  const totalMonthly =
    monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance;

  const displayMonthly =
    estimatedPayment?.formattedMonthly ||
    `$${totalMonthly.toLocaleString("en-US")}/mo`;

  return (
    <>
      <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-full text-mosque shadow-sm flex items-center justify-center">
            <span className="material-icons text-xl">calculate</span>
          </div>
          <div>
            <h3 className="font-semibold text-nordic">Estimated Payment</h3>
            <p className="text-sm text-nordic/60">
              Starting from{" "}
              <strong className="text-mosque font-bold">
                {displayMonthly}
              </strong>{" "}
              with {estimatedPayment?.downPaymentPercent || 20}% down
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="whitespace-nowrap px-4 py-2 bg-white border border-nordic/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic cursor-pointer shadow-xs hover:shadow"
        >
          Calculate Mortgage
        </button>
      </div>

      {/* Interactive Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-mosque/10 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-icons text-mosque">calculate</span>
                <h3 className="text-xl font-bold text-nordic">
                  Mortgage Calculator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-nordic/40 hover:text-nordic p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Monthly Result Card */}
            <div className="my-6 p-5 bg-mosque/5 border border-mosque/15 rounded-xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-nordic/60 block mb-1">
                Estimated Total Monthly Payment
              </span>
              <span className="text-3xl font-bold text-mosque font-display">
                ${totalMonthly.toLocaleString("en-US")}
              </span>
              <span className="text-sm text-nordic/60 font-medium ml-1">/month</span>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-mosque/10 text-xs">
                <div>
                  <div className="text-nordic/50">Principal & Interest</div>
                  <div className="font-semibold text-nordic mt-0.5">
                    ${monthlyPrincipalAndInterest.toLocaleString("en-US")}
                  </div>
                </div>
                <div>
                  <div className="text-nordic/50">Property Taxes</div>
                  <div className="font-semibold text-nordic mt-0.5">
                    ${monthlyPropertyTax.toLocaleString("en-US")}
                  </div>
                </div>
                <div>
                  <div className="text-nordic/50">Homeowners Ins.</div>
                  <div className="font-semibold text-nordic mt-0.5">
                    ${monthlyInsurance.toLocaleString("en-US")}
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders and Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="font-medium text-nordic">Home Price</label>
                  <span className="font-bold text-mosque">
                    ${homePrice.toLocaleString("en-US")}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={Math.max(price * 2, 5000000)}
                  step={10000}
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full accent-mosque cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="font-medium text-nordic">
                    Down Payment ({downPercent}%)
                  </label>
                  <span className="font-semibold text-nordic">
                    ${downPaymentAmount.toLocaleString("en-US")}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={downPercent}
                  onChange={(e) => setDownPercent(Number(e.target.value))}
                  className="w-full accent-mosque cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nordic mb-1">
                    Loan Term
                  </label>
                  <select
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic bg-white focus:outline-none focus:border-mosque"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-mosque hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

