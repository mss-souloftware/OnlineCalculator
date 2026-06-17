import type { ComponentType } from "react";
import { MortgageCalculator } from "@/components/calculators/mortgage/MortgageCalculator";
import { LoanCalculator } from "@/components/calculators/loan/LoanCalculator";
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest/CompoundInterestCalculator";
import { InvestmentCalculator } from "@/components/calculators/investment/InvestmentCalculator";
import { SavingsCalculator } from "@/components/calculators/savings/SavingsCalculator";
import { EmiCalculator } from "@/components/calculators/emi/EmiCalculator";
import { CreditCardPayoffCalculator } from "@/components/calculators/credit-card-payoff/CreditCardPayoffCalculator";
import { RetirementCalculator } from "@/components/calculators/retirement/RetirementCalculator";
import { BmiCalculator } from "@/components/calculators/bmi/BmiCalculator";
import { BmrCalculator } from "@/components/calculators/bmr/BmrCalculator";
import { CalorieCalculator } from "@/components/calculators/calorie/CalorieCalculator";
import { BodyFatCalculator } from "@/components/calculators/body-fat/BodyFatCalculator";
import { IdealWeightCalculator } from "@/components/calculators/ideal-weight/IdealWeightCalculator";
import { ScientificCalculator } from "@/components/calculators/scientific/ScientificCalculator";
import { FractionCalculator } from "@/components/calculators/fraction/FractionCalculator";
import { PercentageCalculator } from "@/components/calculators/percentage/PercentageCalculator";

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
  "emi-calculator": EmiCalculator,
  "credit-card-payoff-calculator": CreditCardPayoffCalculator,
  "retirement-calculator": RetirementCalculator,
  "bmi-calculator": BmiCalculator,
  "bmr-calculator": BmrCalculator,
  "calorie-calculator": CalorieCalculator,
  "body-fat-calculator": BodyFatCalculator,
  "ideal-weight-calculator": IdealWeightCalculator,
  "scientific-calculator": ScientificCalculator,
  "fraction-calculator": FractionCalculator,
  "percentage-calculator": PercentageCalculator,
};
