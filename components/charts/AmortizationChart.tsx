import { StackedBarChart } from "@/components/charts/StackedBarChart";
import type { AmortizationYear } from "@/lib/calculatorEngine/amortization";

/**
 * Loan amortization view — principal (bottom) vs interest (top) per year.
 * A thin wrapper over the shared StackedBarChart.
 */
export function AmortizationChart({
  data,
  className,
}: {
  data: AmortizationYear[];
  className?: string;
}) {
  return (
    <StackedBarChart
      className={className}
      lowerLabel="Principal"
      upperLabel="Interest"
      totalLabel="Balance"
      data={data.map((d) => ({
        year: d.year,
        lower: d.principalPaid,
        upper: d.interestPaid,
        total: d.balance,
      }))}
    />
  );
}
