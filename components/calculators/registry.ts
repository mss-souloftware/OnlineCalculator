import type { ComponentType } from "react";
import { MortgageCalculator } from "@/components/calculators/mortgage/MortgageCalculator";
import { LoanCalculator } from "@/components/calculators/loan/LoanCalculator";
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest/CompoundInterestCalculator";
import { InvestmentCalculator } from "@/components/calculators/investment/InvestmentCalculator";
import { SavingsCalculator } from "@/components/calculators/savings/SavingsCalculator";

/**
 * Maps a calculator slug to its interactive component. Calculators are built
 * as isolated islands (SOP) and registered here; the `[category]/[slug]` route
 * renders the matching component, or a "coming soon" placeholder if absent.
 *
 * Add new calculators here as they're built.
 */
export const calculatorComponents: Record<string, ComponentType> = {
  "mortgage-calculator": MortgageCalculator,
  "loan-calculator": LoanCalculator,
  "compound-interest-calculator": CompoundInterestCalculator,
  "investment-calculator": InvestmentCalculator,
  "savings-calculator": SavingsCalculator,
};
