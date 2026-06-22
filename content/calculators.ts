

export type CategorySlug = "financial" | "health" | "math" | "date-time";

export type Badge = "Popular" | "New" | "Updated";

export interface Calculator {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  keywords: string[];
  badge?: Badge;
  popular?: boolean;
  longDescription?: string;
  faqs?: { q: string; a: string }[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  icon: string;
  accent: string;
}

export const categories: Category[] = [
  {
    slug: "financial",
    name: "Financial",
    tagline: "Mortgages, loans, savings and investments.",
    icon: "fa-sack-dollar",
    accent: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    slug: "health",
    name: "Health & Fitness",
    tagline: "BMI, calories, body fat and more.",
    icon: "fa-heart-pulse",
    accent: "from-rose-500/20 to-rose-500/5",
  },
  {
    slug: "math",
    name: "Math & Algebra",
    tagline: "Scientific, fractions, percentages, units.",
    icon: "fa-square-root-variable",
    accent: "from-sky-500/20 to-sky-500/5",
  },
  {
    slug: "date-time",
    name: "Date & Time",
    tagline: "Age, durations and date differences.",
    icon: "fa-calendar-days",
    accent: "from-amber-500/20 to-amber-500/5",
  },
];

export const calculators: Calculator[] = [
  // ── Financial ──────────────────────────────────────────────────────────
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "financial",
    description:
      "Estimate monthly payments, total interest and a full amortization schedule.",
    metaTitle: "Mortgage Calculator – Monthly Payment & Amortization",
    metaDescription:
      "Free mortgage calculator. Estimate your monthly payment, total interest and full amortization schedule — adjust home price, down payment, rate and term in real time.",
    icon: "fa-house",
    keywords: ["home loan", "amortization", "emi", "property"],
    badge: "Popular",
    popular: true,
    longDescription:
      "A mortgage is a loan used to buy a home, repaid in fixed monthly instalments over a set term — most commonly 15 or 30 years. Each payment covers two things: interest on the outstanding balance and a portion of the principal (the amount you borrowed). This calculator works out your monthly principal-and-interest payment, the total interest you'll pay over the life of the loan, and a full year-by-year amortization schedule.\n\nThree levers move your payment the most: the loan amount (home price minus your down payment), the interest rate, and the term. A larger down payment lowers both your monthly payment and your total interest. A longer term reduces the monthly payment but increases the total interest you pay. Adjust the inputs and every figure and chart updates instantly.\n\nNote: this estimate covers principal and interest only. Your actual monthly housing cost may also include property taxes, homeowners insurance, HOA dues and private mortgage insurance (PMI).",
    faqs: [
      {
        q: "How is my monthly mortgage payment calculated?",
        a: "We use the standard amortization formula. Your payment is fixed so that, at the given interest rate, the loan is fully paid off by the end of the term. Early payments are mostly interest; over time more of each payment goes toward the principal.",
      },
      {
        q: "Does this include property taxes and insurance?",
        a: "No. The figure shown is principal and interest only. Property taxes, homeowners insurance, HOA fees and PMI are not included and will increase your total monthly housing cost.",
      },
      {
        q: "How much should my down payment be?",
        a: "A 20% down payment is a common benchmark because it usually avoids private mortgage insurance (PMI). A larger down payment lowers your monthly payment and total interest, but the right amount depends on your savings and goals.",
      },
      {
        q: "Should I choose a 15- or 30-year term?",
        a: "A 15-year term has higher monthly payments but far less total interest. A 30-year term keeps payments lower and more flexible but costs more interest overall. Try both in the term field to compare.",
      },
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "financial",
    description:
      "Work out repayments and total payable for personal, auto or business loans.",
    metaTitle: "Loan Calculator – Monthly Payments & Total Interest",
    metaDescription:
      "Calculate monthly payments and total payable on personal, auto or business loans. Free loan calculator with an instant interest breakdown.",
    icon: "fa-hand-holding-dollar",
    keywords: ["personal loan", "auto loan", "repayment"],
    popular: true,
    longDescription:
      "A loan calculator helps you understand the real cost of borrowing before you commit. Whether it's a personal loan, car loan, student loan or business loan, the math is the same: you borrow a principal amount and repay it in fixed monthly instalments over a set term, with the lender charging interest on the balance you still owe.\n\nThis calculator shows your monthly payment, the total interest you'll pay, and the total amount repaid over the life of the loan, plus a year-by-year breakdown. Two factors drive the cost most: the interest rate (APR) and the term. A longer term lowers your monthly payment but increases the total interest. A shorter term costs more each month but far less overall.\n\nUse the loan-type presets to start from typical figures, then fine-tune the amount, rate and term to match a specific offer. Comparing two quotes? Copy the share link for each and put them side by side.",
    faqs: [
      {
        q: "How is my monthly loan payment calculated?",
        a: "We use the standard amortizing-loan formula. Your payment is fixed so the loan is fully repaid by the end of the term at the stated interest rate. Each payment covers the interest due that month plus a portion of the principal.",
      },
      {
        q: "What's the difference between interest rate and APR?",
        a: "The interest rate is the cost of borrowing the principal. APR (annual percentage rate) also folds in certain fees, so it reflects the true yearly cost. To compare offers fairly, compare APRs.",
      },
      {
        q: "Should I choose a longer or shorter loan term?",
        a: "A longer term lowers your monthly payment but increases the total interest you pay. A shorter term raises the monthly payment but costs far less overall. Pick the shortest term whose payment fits comfortably in your budget.",
      },
      {
        q: "Does paying off a loan early save money?",
        a: "Usually yes — extra payments reduce the principal, so less interest accrues over time. Check whether your lender charges a prepayment penalty first, as a few do.",
      },
    ],
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "financial",
    description:
      "Calculate your equated monthly instalment and interest breakdown instantly.",
    metaTitle: "EMI Calculator – Equated Monthly Instalment",
    metaDescription:
      "Work out your loan EMI in seconds. Enter principal, interest rate and tenure to see your monthly instalment and total interest — free and instant.",
    icon: "fa-file-invoice-dollar",
    keywords: ["instalment", "tenure", "interest"],
    longDescription:
      "EMI stands for Equated Monthly Instalment — the fixed amount you pay your lender every month until a loan is fully repaid. Each EMI covers part of the interest and part of the principal, with the split shifting toward principal over time. This calculator works out your EMI from the loan amount, interest rate and tenure, and shows the total interest and total amount payable.\n\nThree numbers decide your EMI: the principal, the annual interest rate, and the tenure in months. A longer tenure lowers each month's EMI but increases the total interest you pay; a shorter tenure does the opposite. The amortization schedule shows exactly how your balance falls year by year.\n\nThis is the same math used for home, car, personal and business loans — only the terminology differs.",
    faqs: [
      {
        q: "What is EMI?",
        a: "EMI (Equated Monthly Instalment) is the fixed monthly payment that repays a loan over its tenure. It combines interest on the outstanding balance with a portion of the principal, calculated so the loan clears exactly at the end of the term.",
      },
      {
        q: "How is EMI calculated?",
        a: "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the tenure in months. This calculator does the math for you instantly.",
      },
      {
        q: "Does a longer tenure reduce my EMI?",
        a: "Yes — a longer tenure spreads the principal over more months, lowering each EMI. But because interest accrues for longer, you pay more in total. Pick the shortest tenure whose EMI fits your budget.",
      },
      {
        q: "What's the difference between EMI and a loan calculator?",
        a: "None mathematically — both use the same amortization formula. “EMI” is the common term in many countries for a loan instalment, and this tool lets you set the tenure directly in months.",
      },
    ],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "financial",
    description:
      "See how your money grows with compounding across any frequency and term.",
    metaTitle: "Compound Interest Calculator – Growth Over Time",
    metaDescription:
      "See how your money grows with compound interest across any frequency and term. Free calculator with an instant growth chart and interest earned.",
    icon: "fa-chart-line",
    keywords: ["growth", "interest", "principal", "frequency"],
    badge: "Popular",
    popular: true,
    longDescription:
      "Compound interest is interest earned on both your original money and the interest it has already earned. That snowball effect is why Albert Einstein reportedly called it the most powerful force in finance — and why starting early matters so much. This calculator shows exactly how an initial deposit, plus optional regular contributions, grows over time at a given rate and compounding frequency.\n\nTwo settings make compounding more powerful: a higher frequency and a longer time horizon. Interest that compounds daily grows slightly faster than interest compounded annually, because earnings start earning sooner. And because growth is exponential, the final years contribute far more than the first — a balance can double in its last decade alone.\n\nUse the monthly contribution field to model regular investing (like a SIP or 401(k)), and the frequency selector to match how your account actually compounds. The chart and table break down how much of your future value comes from contributions versus interest earned.",
    faqs: [
      {
        q: "What is compound interest?",
        a: "Compound interest is interest calculated on your initial principal and on the accumulated interest from previous periods. Unlike simple interest (which is only ever calculated on the principal), compounding causes your balance to grow at an accelerating rate.",
      },
      {
        q: "How does compounding frequency affect growth?",
        a: "The more often interest compounds, the faster your balance grows, because earned interest starts earning interest sooner. Daily compounding edges out monthly, which beats annual — though at typical rates the difference is modest compared with the rate itself and the time invested.",
      },
      {
        q: "What's the difference between this and a simple interest calculator?",
        a: "Simple interest pays a flat amount each period based only on the principal. Compound interest reinvests each period's interest so future interest is calculated on a larger balance — which is how most savings and investment accounts actually work.",
      },
      {
        q: "Does adding monthly contributions make a big difference?",
        a: "A large one. Regular contributions are themselves compounded over time, so steady monthly investing often ends up contributing more to your final balance than the starting deposit — especially over long horizons.",
      },
    ],
  },
  {
    slug: "savings-calculator",
    name: "Savings Calculator",
    category: "financial",
    description:
      "Project the future value of regular deposits toward your savings goal.",
    metaTitle: "Savings Calculator – Future Value of Deposits",
    metaDescription:
      "Project the future value of your savings with regular deposits and interest. Free savings goal calculator with instant, real-time results.",
    icon: "fa-piggy-bank",
    keywords: ["deposit", "future value", "goal"],
    longDescription:
      "A savings calculator shows how regular deposits and interest combine to build a balance over time, and whether you're on track to hit a specific target. Enter a starting balance, a monthly deposit, your account's interest rate (APY) and a time frame, and optionally a savings goal to track your progress.\n\nUnlike investing, savings growth is steadier and more predictable, because the interest rate is usually fixed or close to it. The two levers you control most are how much you deposit each month and how long you keep saving. Small, consistent deposits add up surprisingly fast once interest starts compounding on the growing balance.\n\nSet a goal to see exactly when you'd reach it — or how much you'd fall short — so you can adjust your deposit or timeline before you start. Everything updates instantly as you change the numbers.",
    faqs: [
      {
        q: "How is my savings balance calculated?",
        a: "We compound interest monthly on the running balance and add your monthly deposit each month. The result is your projected balance, the total you deposited, and the interest you earned over the period.",
      },
      {
        q: "What's the difference between APR and APY?",
        a: "APY (annual percentage yield) reflects interest compounded over a year, so it's the right figure for savings growth, and the one most savings accounts quote. APR doesn't include the effect of compounding.",
      },
      {
        q: "How can I reach my savings goal faster?",
        a: "Increase your monthly deposit, extend your timeline, start with a larger balance, or find an account with a higher rate. The goal tracker shows how each change moves your finish line.",
      },
      {
        q: "Does this account for taxes or inflation?",
        a: "No. The projection shows nominal growth before any tax on interest and without adjusting for inflation, so your real (inflation-adjusted) purchasing power will be somewhat lower.",
      },
    ],
  },
  {
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    category: "financial",
    description:
      "Find your payoff date and total interest based on your monthly payment.",
    metaTitle: "Credit Card Payoff Calculator – Payoff Date & Interest",
    metaDescription:
      "Find out how long to clear your credit card and the total interest you'll pay. Free payoff calculator based on balance, APR and monthly payment.",
    icon: "fa-credit-card",
    keywords: ["debt", "apr", "balance", "payoff"],
    longDescription:
      "Paying only the minimum on a credit card can keep you in debt for years and cost a fortune in interest. This calculator shows the reality: enter your balance, APR and the fixed amount you can pay each month, and it tells you exactly how long until you're debt-free and how much interest you'll pay along the way.\n\nInterest is charged on your remaining balance every month, so the faster you pay, the less interest accrues. Increasing your monthly payment even slightly can cut months — or years — off your payoff time. If your payment is lower than the monthly interest, the balance will actually grow; the calculator flags this so you know the minimum you need to make progress.\n\nUse it to set a realistic payoff plan, or to see how much a higher payment would save you.",
    faqs: [
      {
        q: "How long will it take to pay off my credit card?",
        a: "It depends on your balance, APR and monthly payment. Enter all three and the calculator returns the exact number of months, assuming you make the same fixed payment each month and add no new charges.",
      },
      {
        q: "Why might my balance never get paid off?",
        a: "If your monthly payment is less than or equal to the interest charged that month, none of it reduces the principal — so the balance stays flat or grows. The calculator warns you when this happens and shows the minimum payment needed to make progress.",
      },
      {
        q: "How can I pay off my card faster?",
        a: "Pay more than the minimum, pay more often, or move the balance to a lower-APR card or a 0% transfer. Even a small increase in your monthly payment can dramatically cut both the payoff time and the total interest.",
      },
      {
        q: "Does this assume I stop using the card?",
        a: "Yes. The projection assumes no new purchases and a fixed monthly payment. Any new spending will extend the payoff time and increase the interest you pay.",
      },
    ],
  },
  {
    slug: "investment-calculator",
    name: "Investment Calculator",
    category: "financial",
    description:
      "Model portfolio growth from an initial amount plus monthly contributions.",
    metaTitle: "Investment Calculator – Portfolio Growth Projection",
    metaDescription:
      "Model your portfolio growth from an initial amount plus monthly contributions and expected return. Free investment calculator with an instant chart.",
    icon: "fa-arrow-trend-up",
    keywords: ["portfolio", "returns", "sip", "growth"],
    popular: true,
    longDescription:
      "An investment calculator projects how a portfolio could grow over time when you combine an initial lump sum with regular monthly contributions and let compounding do the work. It's the tool to answer questions like “what could my retirement account be worth?” or “is investing $500 a month enough?”.\n\nThe single biggest driver is time, followed by your contribution amount and expected return. Because returns compound, money invested early has decades to grow — which is why starting sooner usually beats investing more later. The annual contribution increase lets you model raising your investments each year as your income grows, which can dramatically lift the final balance.\n\nReturns are not guaranteed: markets rise and fall, and the “expected return” you enter is an assumption, not a promise. Use conservative figures and treat the result as a projection for planning, not a forecast.",
    faqs: [
      {
        q: "What return rate should I use?",
        a: "Use a realistic long-term average for your asset mix. Historically a diversified, stock-heavy portfolio has averaged roughly 7–10% before inflation, but past performance doesn't guarantee future results. More conservative assumptions give you a safer plan.",
      },
      {
        q: "What does the annual contribution increase do?",
        a: "It raises your monthly contribution by the percentage you choose at the start of each year — handy for modelling contributions that grow with your salary. Even a small annual increase compounds into a noticeably larger final balance.",
      },
      {
        q: "Is this suitable for retirement planning?",
        a: "It's a great starting point for projecting a pot from regular investing. For a complete plan you should also factor in inflation, taxes and withdrawals — see our retirement calculator and consider a qualified adviser.",
      },
      {
        q: "Why is most of my balance 'returns' over long periods?",
        a: "Compounding is exponential, so over long horizons the growth on your money — and the growth on that growth — can far exceed what you actually contributed. That's the core reason to invest early and stay invested.",
      },
    ],
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    category: "financial",
    description:
      "Project your retirement corpus and the monthly income it could provide.",
    metaTitle: "Retirement Calculator – Corpus & Monthly Income",
    metaDescription:
      "Project your retirement savings and the monthly income it could provide. Free retirement calculator with instant, real-time projections.",
    icon: "fa-umbrella-beach",
    keywords: ["pension", "corpus", "401k", "nest egg"],
    longDescription:
      "A retirement calculator projects how much you could have saved by the time you retire, and roughly how much monthly income that nest egg could provide. Enter your age, target retirement age, current savings, monthly contributions and an expected return, and it compounds everything forward to your retirement date.\n\nTime is your most powerful asset: because returns compound, contributions made in your 20s and 30s can grow far more than the same amount saved later. The estimated monthly income uses a withdrawal rate — the 4% “rule of thumb” suggests you can withdraw about 4% of your savings in the first year of retirement with a good chance of not running out, though the right figure depends on your situation.\n\nThis is a planning estimate, not a guarantee. It doesn't model inflation, taxes or market volatility in detail — treat it as a starting point and revisit it regularly.",
    faqs: [
      {
        q: "How much do I need to retire?",
        a: "A common guideline is to aim for savings that replace 70–80% of your pre-retirement income. Using the 4% rule, that often means a nest egg of roughly 25× your desired annual spending. This calculator projects your nest egg so you can compare it against your target.",
      },
      {
        q: "What is the 4% rule?",
        a: "The 4% rule suggests retirees can withdraw about 4% of their savings in the first year, then adjust for inflation, with a reasonable chance the money lasts around 30 years. It's a rough planning heuristic, not a guarantee — lower the withdrawal rate to be more conservative.",
      },
      {
        q: "What return rate should I assume?",
        a: "Use a realistic long-term average for your investment mix. Many planners use roughly 6–8% before inflation for a diversified portfolio, then a lower figure for safety. Returns aren't guaranteed, so test a few scenarios.",
      },
      {
        q: "Does this account for inflation and taxes?",
        a: "No. The projection shows nominal values before tax and without adjusting for inflation, so your future purchasing power will be lower than the headline figure. Factor those in when planning, and consider professional advice.",
      },
    ],
  },

  // ── Health & Fitness ───────────────────────────────────────────────────
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description:
      "Check your Body Mass Index and see where you fall on the healthy range.",
    metaTitle: "BMI Calculator – Body Mass Index & Healthy Range",
    metaDescription:
      "Calculate your Body Mass Index (BMI) and see your healthy weight range instantly. Free BMI calculator for metric and imperial units.",
    icon: "fa-weight-scale",
    keywords: ["body mass index", "weight", "height"],
    badge: "Popular",
    popular: true,
    longDescription:
      "Body Mass Index (BMI) is a quick screening number that relates your weight to your height. It's calculated as your weight in kilograms divided by the square of your height in metres, and it sorts adults into ranges: underweight (below 18.5), normal (18.5–24.9), overweight (25–29.9) and obese (30 and above).\n\nBMI is popular because it's simple and a reasonable indicator of body-fat-related health risk across a population. But it's a blunt tool for individuals: it can't tell muscle from fat, so very muscular people may register as “overweight”, and it doesn't account for age, sex, ethnicity or where you carry weight. Use it as a starting point, not a verdict.\n\nThis calculator works in both metric and imperial units and shows the healthy weight range for your height, so you can see how far you are from the normal band.",
    faqs: [
      {
        q: "How is BMI calculated?",
        a: "BMI = weight (kg) ÷ height (m)². In imperial units it's weight (lb) ÷ height (in)² × 703. This calculator handles the conversion for you whichever units you enter.",
      },
      {
        q: "What is a healthy BMI?",
        a: "For most adults a BMI between 18.5 and 24.9 is considered the healthy range. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is classed as obese.",
      },
      {
        q: "Is BMI accurate for everyone?",
        a: "No. BMI doesn't distinguish muscle from fat, so athletes can read as overweight, and it doesn't adjust for age, sex, ethnicity or fat distribution. It's a screening tool — for a fuller picture consider body-fat percentage and a chat with a clinician.",
      },
      {
        q: "Does BMI work differently for children?",
        a: "Yes. For children and teens, BMI is interpreted using age- and sex-specific percentiles rather than the fixed adult ranges. This calculator is intended for adults.",
      },
    ],
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description:
      "Calculate your Basal Metabolic Rate — the calories you burn at rest.",
    metaTitle: "BMR Calculator – Basal Metabolic Rate",
    metaDescription:
      "Calculate your Basal Metabolic Rate (BMR) — the calories you burn at rest. Free, instant BMR calculator using weight, height, age and gender.",
    icon: "fa-fire",
    keywords: ["metabolism", "calories", "rest"],
    longDescription:
      "Your Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest just to keep you alive — powering your heart, brain, lungs and other organs. It typically accounts for 60–70% of the calories you use each day, which makes it the foundation of any calorie plan, whether you want to lose, maintain or gain weight.\n\nThis calculator uses the Mifflin-St Jeor equation, the formula most dietitians consider the most accurate for the general population. It factors in your weight, height, age and sex. To estimate the calories you actually burn in a day (your TDEE, or maintenance calories), multiply your BMR by an activity factor — the table shows all five levels so you can pick the one that matches your lifestyle.\n\nOnce you know your maintenance number, eating below it tends to lead to weight loss and above it to weight gain — roughly 3,500 calories per pound of body weight.",
    faqs: [
      {
        q: "What's the difference between BMR and TDEE?",
        a: "BMR is the calories you burn at rest. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor — the total you burn including movement and exercise. The activity table on this page shows your TDEE at each level.",
      },
      {
        q: "Which formula does this use?",
        a: "The Mifflin-St Jeor equation, widely regarded as the most accurate BMR formula for most people. For men: 10×weight(kg) + 6.25×height(cm) − 5×age + 5; for women the final constant is −161 instead of +5.",
      },
      {
        q: "How do I use my BMR to lose weight?",
        a: "Find your maintenance calories (BMR × activity factor), then eat below it to lose weight. A deficit of roughly 500 calories a day is a common, sustainable target for about a pound of loss per week — but consult a professional for personalised advice.",
      },
      {
        q: "Why does BMR fall with age?",
        a: "Metabolism tends to slow as we age, partly due to muscle loss. The formula reflects this by subtracting more for older ages, so an older person generally has a lower BMR than a younger person of the same size.",
      },
    ],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description:
      "Get a daily calorie target for your goal with a macronutrient breakdown.",
    metaTitle: "Calorie Calculator – Daily Calorie & Macro Needs",
    metaDescription:
      "Get your daily calorie target and macronutrient breakdown for your goal. Free calorie (TDEE) calculator with instant results.",
    icon: "fa-utensils",
    keywords: ["diet", "macros", "tdee", "nutrition"],
    popular: true,
    longDescription:
      "A calorie calculator estimates how many calories you should eat each day to reach a goal — lose, maintain or gain weight. It starts from your Basal Metabolic Rate (the energy your body uses at rest), multiplies it by an activity factor to get your maintenance calories (TDEE), then applies a deficit or surplus for your goal.\n\nWeight change comes down to energy balance: eat fewer calories than you burn and you lose weight; eat more and you gain. A pound of body fat is roughly 3,500 calories, so a daily deficit of 500 calories targets about a pound of loss per week. This tool also splits your target into protein, carbs and fat, with presets for balanced, low-carb and high-protein diets.\n\nThese are estimates based on the Mifflin-St Jeor equation; your real needs depend on body composition, genetics and how active you truly are, so adjust based on results.",
    faqs: [
      {
        q: "How many calories should I eat to lose weight?",
        a: "Eat below your maintenance (TDEE) calories. A deficit of about 500 calories a day targets roughly a pound (0.5 kg) of loss per week and is sustainable for most people. Aggressive deficits work faster but are harder to keep up and can cost muscle.",
      },
      {
        q: "What is TDEE?",
        a: "Total Daily Energy Expenditure is the total calories you burn in a day — your BMR multiplied by an activity factor for movement and exercise. It's your maintenance level: eat at it to keep your weight stable.",
      },
      {
        q: "How should I split my macros?",
        a: "A balanced 30% protein / 40% carbs / 30% fat split works for most people. Higher protein supports muscle retention while dieting; lower-carb suits some people for appetite control. This calculator offers presets so you can compare.",
      },
      {
        q: "Are these calorie numbers exact?",
        a: "No — they're well-established estimates. Metabolism varies between individuals and activity is hard to gauge precisely. Use the figure as a starting point, track your weight for a few weeks, then adjust based on what actually happens.",
      },
    ],
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    category: "health",
    description:
      "Estimate body fat percentage using the trusted U.S. Navy method.",
    metaTitle: "Body Fat Calculator – U.S. Navy Method",
    metaDescription:
      "Estimate your body fat percentage using the trusted U.S. Navy method. Free body fat calculator with instant results and your category.",
    icon: "fa-person",
    keywords: ["navy method", "waist", "neck", "composition"],
    longDescription:
      "This calculator estimates your body fat percentage using the U.S. Navy circumference method — a tape-measure technique the military uses because it's quick, free and reasonably accurate. It compares measurements of your neck and waist (and hips for women) against your height to estimate the proportion of your weight that is fat.\n\nBody fat percentage is often more useful than BMI because it distinguishes fat from muscle. Two people can share a BMI but have very different body compositions. The result is placed into categories — essential fat, athletes, fitness, average and obese — which differ between men and women because women naturally carry more essential fat.\n\nFor the most accurate reading, measure with a flexible tape kept snug but not tight, and take each measurement at the same point a couple of times. This is an estimate; methods like DEXA scans are more precise but far less convenient.",
    faqs: [
      {
        q: "How do I measure for the Navy method?",
        a: "Measure your neck just below the larynx and your waist at the navel (men); women also measure the hips at their widest point. Keep the tape level and snug, enter the figures with your height, and the calculator does the rest.",
      },
      {
        q: "Is the Navy method accurate?",
        a: "It's a good practical estimate, typically within a few percent of more advanced methods for most people, though less reliable at the extremes of body composition. For clinical accuracy, a DEXA scan or hydrostatic weighing is the gold standard.",
      },
      {
        q: "Why are the categories different for men and women?",
        a: "Women naturally carry more essential body fat — needed for hormonal and reproductive health — so the healthy ranges sit higher than for men. The calculator applies the appropriate category bands based on the sex you select.",
      },
      {
        q: "What's a healthy body fat percentage?",
        a: "For men the 'fitness' range is roughly 14–17% and 'average' 18–24%; for women it's about 21–24% and 25–31%. Athletes sit below these, and very low body fat can be unhealthy. Context and individual goals matter.",
      },
    ],
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "health",
    description:
      "See your ideal weight range across four established medical formulas.",
    metaTitle: "Ideal Weight Calculator – Healthy Weight Range",
    metaDescription:
      "See your ideal weight range across four established medical formulas. Free ideal weight calculator based on height, gender and frame.",
    icon: "fa-scale-balanced",
    keywords: ["healthy weight", "frame", "robinson", "devine"],
    longDescription:
      "There's no single “ideal” weight, but several long-standing clinical formulas estimate a healthy weight from your height and sex. This calculator runs four of the best-known — Robinson, Miller, Devine and Hamwi — and shows the range they produce along with an average, so you get a realistic band rather than a false-precision single number.\n\nAll four are based on height: each adds a set amount of weight per inch above five feet, with slightly different constants. Because they were derived decades ago for medication dosing and population health, they don't account for muscle mass, age or body composition — a muscular athlete may sit “above” their ideal weight while being perfectly healthy. The frame-size option nudges the estimate to reflect smaller or larger builds.\n\nFor context, the calculator also shows the healthy weight range from BMI. Treat all of these as guides, not goals.",
    faqs: [
      {
        q: "Which ideal weight formula is best?",
        a: "There's no clear winner — Robinson and Devine are the most widely cited clinically. Rather than pick one, this calculator shows all four and their average so you can see a realistic range for your height.",
      },
      {
        q: "Does ideal weight depend on age?",
        a: "These classic formulas use only height and sex, not age. Healthy weight can shift with age and muscle mass, so treat the result as a general reference. The BMI-based range shown is similarly age-independent for adults.",
      },
      {
        q: "What is body frame size?",
        a: "Frame size describes your skeletal build — small, medium or large. People with larger frames healthily carry more weight at the same height. This calculator adjusts the average by about ±10% for small and large frames.",
      },
      {
        q: "Should I aim for my 'ideal weight'?",
        a: "Not necessarily. These figures are population averages for medical reference, not personal targets. Your healthiest weight depends on body composition, fitness and health markers — worth discussing with a professional.",
      },
    ],
  },

  // ── Math & Algebra ─────────────────────────────────────────────────────
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    category: "math",
    description:
      "A full scientific calculator with trig, logs, powers and constants.",
    metaTitle: "Scientific Calculator – Trig, Logs & Powers",
    metaDescription:
      "A free online scientific calculator with trigonometry, logarithms, powers, roots and constants. Fast, accurate and instant.",
    icon: "fa-calculator",
    keywords: ["trigonometry", "logarithm", "expression"],
    badge: "Popular",
    popular: true,
    longDescription:
      "A scientific calculator goes well beyond the four basic operations, handling the functions you need for algebra, trigonometry, statistics and science homework. This one evaluates a full expression at once — type something like “2×sin(30)+√(16)” and it parses the whole thing using the correct order of operations, so you don't have to break the calculation into steps.\n\nIt supports parentheses, powers and roots (including the nth root), factorials, percentages and modulo, the constants π and e, and a full set of functions: sine, cosine and tangent with their inverses, the hyperbolic functions (sinh, cosh, tanh) via the hyp key, natural and base-10 logarithms, exponentials, reciprocal (1/x), absolute value, and permutations and combinations (nPr and nCr). Trigonometry works in either degrees or radians — switch the angle mode before you calculate. Results appear live as you type, and pressing equals stores the calculation in your history so you can revisit or reuse it.\n\nYou can drive everything from your keyboard as well as the on-screen keys, and the calculator understands implicit multiplication, so “2π” and “3(4+1)” work exactly as you'd write them by hand.",
    faqs: [
      {
        q: "How do I switch between degrees and radians?",
        a: "Use the DEG/RAD toggle above the keypad. It controls how trigonometric functions interpret angles: in DEG mode sin(30) is 0.5, while in RAD mode the same input is treated as 30 radians. Set the mode before calculating.",
      },
      {
        q: "What do the INV and hyp keys do?",
        a: "INV switches the trig and log keys to their inverse functions — sin becomes sin⁻¹ (arcsine), ln becomes eˣ, log becomes 10ˣ and √ becomes x². The hyp key switches sin, cos and tan to their hyperbolic forms (sinh, cosh, tanh), and combining hyp with INV gives the inverse hyperbolics (asinh, acosh, atanh). Together they pack the second and third functions onto each key without extra buttons.",
      },
      {
        q: "How do nPr, nCr and the other extra functions work?",
        a: "nPr and nCr are entered between two whole numbers — “5 nPr 2” counts ordered arrangements (20) and “5 nCr 2” counts unordered selections (10). The nth-root key (ʸ√x) takes the index first, so 3 then ʸ√x then 27 gives 3. There's also 1/x for reciprocals and mod for the remainder of a division, e.g. 17 mod 5 is 2.",
      },
      {
        q: "Does it follow the correct order of operations?",
        a: "Yes. The calculator evaluates the whole expression using standard precedence (parentheses, then powers, then multiplication and division, then addition and subtraction), so 2+3×4 returns 14, not 20. Use parentheses whenever you want to change the grouping.",
      },
      {
        q: "Can I use my keyboard?",
        a: "Absolutely. Number keys, + − * / and ^, parentheses, % and ! all work, Enter evaluates the expression, Backspace deletes and Escape clears. You can also click the on-screen keys — whichever you prefer.",
      },
    ],
  },
  {
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    category: "math",
    description:
      "Add, subtract, multiply and divide fractions with step-by-step results.",
    metaTitle: "Fraction Calculator – Add, Subtract, Multiply, Divide",
    metaDescription:
      "Add, subtract, multiply and divide fractions with simplified, step-by-step results. Free online fraction calculator with instant answers.",
    icon: "fa-divide",
    keywords: ["numerator", "denominator", "simplify"],
    longDescription:
      "A fraction calculator takes the fiddly arithmetic out of working with fractions — finding common denominators, multiplying across, flipping for division and reducing the answer to lowest terms. Enter two fractions, choose an operation, and you get the exact result as a simplified fraction, a mixed number and a decimal, along with the working that gets you there.\n\nEach value can be a simple fraction like 3/4 or a mixed number like 2 1/3 — just fill in the whole-number box. Negative fractions are fine too: put the minus sign on the whole number or the numerator. Because the calculation is done with exact integer arithmetic rather than floating-point decimals, you never lose precision to rounding, so 1/3 stays exactly one third.\n\nThe step-by-step panel shows each stage of the method — converting mixed numbers, rewriting over a common denominator, combining, and simplifying — which makes it useful for checking homework or learning the technique, not just getting an answer.",
    faqs: [
      {
        q: "How do you add or subtract fractions with different denominators?",
        a: "Rewrite both fractions over a common denominator (the lowest common multiple of the two denominators), then add or subtract the numerators and keep the denominator. Finally, reduce the result to lowest terms. The calculator shows each of these steps.",
      },
      {
        q: "How do you multiply and divide fractions?",
        a: "To multiply, multiply the numerators together and the denominators together. To divide, flip the second fraction (swap its numerator and denominator) and multiply. The answer is then simplified. No common denominator is needed for either.",
      },
      {
        q: "Can I use mixed numbers and negative fractions?",
        a: "Yes. Enter a value in the whole-number box to make a mixed number such as 2 1/3, which the calculator converts to an improper fraction first. For negatives, use a minus sign on the whole number or the numerator.",
      },
      {
        q: "How is the result simplified?",
        a: "The calculator divides the numerator and denominator by their greatest common divisor (GCD), giving the fraction in lowest terms. If the fraction is top-heavy, it also expresses it as a mixed number and as a decimal.",
      },
    ],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description:
      "Solve every common percentage problem — increase, decrease and of.",
    metaTitle: "Percentage Calculator – Increase, Decrease & Of",
    metaDescription:
      "Solve every common percentage problem instantly — percentage of, increase, decrease and change. Free, easy online percentage calculator.",
    icon: "fa-percent",
    keywords: ["percent", "discount", "change"],
    popular: true,
    longDescription:
      "Percentages turn up everywhere — discounts, tips, tax, test scores, interest and statistics — but the wording trips people up because “percent” questions come in several shapes. This calculator handles the four most common ones in one place, and shows the working for each so the method is clear, not just the answer.\n\nUse “Percent of” to find a slice of a number (what is 15% of 200?). Use “Is what %” to express one number as a percentage of another (50 is what percent of 200?). Use “Change” to measure the percentage increase or decrease between a starting and ending value — handy for price changes, growth or weight loss. And use “Adjust” to add or take a percentage off a number, which is exactly what a discount or a markup does.\n\nEvery percentage is really just a fraction of 100: 25% means 25 per hundred, or 0.25. Once you see which of the four questions you're asking, the arithmetic is straightforward — and the step-by-step panel walks through it each time.",
    faqs: [
      {
        q: "How do I calculate a percentage of a number?",
        a: "Divide the percentage by 100 and multiply by the number. For example, 15% of 200 is (15 ÷ 100) × 200 = 0.15 × 200 = 30. The “Percent of” mode does this for you and shows each step.",
      },
      {
        q: "How do I work out percentage increase or decrease?",
        a: "Subtract the starting value from the ending value, divide by the starting value, then multiply by 100. Going from 200 to 250 is ((250 − 200) ÷ 200) × 100 = 25%, an increase. A negative result means a decrease. Use the “Change” mode for this.",
      },
      {
        q: "What's the difference between “percent of” and “percentage change”?",
        a: "“Percent of” finds a portion of a single number (15% of 200). “Percentage change” compares two numbers to see how much one grew or shrank relative to the other. They answer different questions, so the calculator keeps them as separate modes.",
      },
      {
        q: "How do I add or subtract a percentage, like a discount or tax?",
        a: "Use the “Adjust” mode. To take 20% off 50, it works out 20% of 50 (which is 10) and subtracts it, giving 40. To add tax, switch the direction to Increase. This is the same math shops use for discounts and markups.",
      },
    ],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "math",
    description:
      "Convert length, weight, temperature, area, volume and more in a tap.",
    metaTitle: "Unit Converter – Length, Weight, Temperature & More",
    metaDescription:
      "Convert length, weight, temperature, area, volume and more between metric and imperial. Free, instant online unit converter.",
    icon: "fa-ruler-combined",
    keywords: ["metric", "imperial", "conversion"],
    longDescription:
      "A unit converter switches a measurement from one unit to another without the mental arithmetic — metres to feet, kilograms to pounds, Celsius to Fahrenheit, and many more. This one covers eight everyday categories: length, weight and mass, temperature, area, volume, speed, time and digital storage, each with the metric and imperial (US/UK) units you actually use.\n\nMost conversions are just multiplication by a fixed factor: every unit is defined relative to a base unit for its category (the metre for length, the kilogram for mass), so converting means scaling to the base and back out to the target. Temperature is the exception — because the scales have different zero points, Celsius, Fahrenheit and Kelvin are converted with formulas rather than a single factor, which is why 0 °C is 32 °F, not zero.\n\nEnter an amount, pick the two units and read the result instantly, or use the swap button to reverse the direction. The panel also shows your amount expressed in every other unit in the category at once, which is handy for quick reference.",
    faqs: [
      {
        q: "Which unit categories does this converter support?",
        a: "Eight: length, weight/mass, temperature, area, volume, speed, time and digital storage. Each includes common metric and imperial units — for example feet, inches, miles, pounds, ounces, gallons, miles per hour and gigabytes.",
      },
      {
        q: "How do I convert Celsius to Fahrenheit (and back)?",
        a: "Multiply the Celsius value by 9/5 and add 32. So 20 °C is 20 × 9/5 + 32 = 68 °F. To go the other way, subtract 32 then multiply by 5/9. Select the Temperature category and the calculator applies the right formula automatically.",
      },
      {
        q: "Is the conversion exact?",
        a: "The factors use the internationally defined values (for instance one inch is exactly 2.54 cm), so conversions are accurate to within display rounding. Results are shown to several significant figures, switching to scientific notation for very large or very small numbers.",
      },
      {
        q: "What's the difference between a kilobyte (KB) and a kibibyte (KiB)?",
        a: "A kilobyte is 1,000 bytes (decimal) while a kibibyte is 1,024 bytes (binary). The digital-storage category includes both the decimal units (KB, MB, GB, TB) and the binary ones (KiB, MiB, GiB) so you can convert between them.",
      },
    ],
  },

  // ── Date & Time ────────────────────────────────────────────────────────
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "date-time",
    description:
      "Find your exact age in years, months and days, plus key milestones.",
    metaTitle: "Age Calculator – Exact Age in Years, Months, Days",
    metaDescription:
      "Find your exact age in years, months and days from your date of birth, plus key milestones. Free, instant age calculator.",
    icon: "fa-cake-candles",
    keywords: ["birthday", "date of birth", "milestones"],
    badge: "Popular",
    popular: true,
    longDescription:
      "An age calculator works out exactly how old someone is from their date of birth — not just in years, but in years, months and days, the way you'd actually say it. Enter a birth date and it tells you your precise age today, or on any date you choose, which is handy for forms, eligibility checks or settling a “who's older” debate.\n\nGetting age right is trickier than subtracting two years, because months have different lengths and leap years add a day every four years. This calculator counts whole months from your birth date — clamping sensibly when a month is shorter — so the result stays correct even for tricky cases like being born on the 31st or on the 29th of February. It then shows the leftover days exactly.\n\nBeyond your age, it breaks your life down into total months, weeks, days, hours and minutes, tells you which day of the week you were born on, and counts down to your next birthday — including the weekday it falls on and the age you'll turn.",
    faqs: [
      {
        q: "How is my exact age calculated?",
        a: "The calculator counts the number of complete years and months from your birth date to the chosen date, then the remaining days. It accounts for varying month lengths and leap years, so the years/months/days figure matches how age is normally stated.",
      },
      {
        q: "Can I calculate my age on a future or past date?",
        a: "Yes. By default it uses today, but you can change the “Age at the date of” field to any date — for example to find how old you'll be on a future event, or how old you were at a past one. Reset returns it to today.",
      },
      {
        q: "How does it handle leap years and 29 February birthdays?",
        a: "Leap days are counted in the totals automatically. For a 29 February birthday, in non-leap years the calculator treats 28 February as the birthday for the countdown, which is the most common convention.",
      },
      {
        q: "What does “next birthday” show?",
        a: "It shows how many days remain until your next birthday, the day of the week it falls on, and the age you'll turn. If today is your birthday, it says so.",
      },
    ],
  },
  {
    slug: "date-calculator",
    name: "Date Calculator",
    category: "date-time",
    description:
      "Add or subtract days, or find the exact duration between two dates.",
    metaTitle: "Date Calculator – Days Between & Add/Subtract Dates",
    metaDescription:
      "Add or subtract days from a date, or find the exact duration between two dates. Free, instant online date calculator.",
    icon: "fa-calendar-day",
    keywords: ["duration", "days between", "deadline"],
    longDescription:
      "A date calculator answers two everyday questions: how long is it between two dates, and what date falls a certain time before or after another. Use the Difference mode to count the gap between a start and end date — useful for project timelines, notice periods, pregnancy weeks, or how many days until an event. Use the Add / Subtract mode to shift a date forward or back by years, months, weeks and days — handy for deadlines, renewal dates and reminders.\n\nThe difference is shown both as a calendar duration (years, months and days, the way people naturally describe a span) and as exact totals: total days, total weeks, and the number of business days (Monday to Friday), which matters for working-day deadlines and SLAs. Because months vary in length and leap years add a day, the calculator works in whole calendar months and clamps sensibly — adding one month to 31 January lands on the last day of February, not an invalid date.\n\nEverything updates instantly, and you can share a link that reproduces the exact dates and interval you entered.",
    faqs: [
      {
        q: "How do I find the number of days between two dates?",
        a: "Choose the Difference mode and enter a start and end date. The calculator shows the gap as years, months and days, and also as the total number of days and weeks between them. The order doesn't matter — it tells you if the end date is before the start.",
      },
      {
        q: "What counts as a business day?",
        a: "Business days are Monday to Friday. The calculator counts the weekdays that elapse between your two dates, excluding Saturdays and Sundays. It does not account for public holidays, which vary by country.",
      },
      {
        q: "How does adding months handle different month lengths?",
        a: "It adds whole calendar months and clamps the day to the end of the target month when needed. For example, 31 January plus one month gives 28 February (or 29 in a leap year), since there is no 31 February.",
      },
      {
        q: "Can I subtract time as well as add it?",
        a: "Yes. In Add / Subtract mode, switch the direction to Subtract and enter any combination of years, months, weeks and days to move the date backwards. The result shows the new date and the day of the week it falls on.",
      },
    ],
  },
  {
    slug: "time-calculator",
    name: "Time Calculator",
    category: "date-time",
    description:
      "Add and subtract hours, minutes and seconds, or build a countdown.",
    metaTitle: "Time Calculator – Add & Subtract Hours and Minutes",
    metaDescription:
      "Add and subtract hours, minutes and seconds, or build a countdown. Free, instant online time calculator.",
    icon: "fa-clock",
    keywords: ["hours", "minutes", "countdown", "stopwatch"],
    badge: "New",
  },
];

export const popularCalculators = calculators.filter((c) => c.popular);

export function countByCategory(slug: CategorySlug): number {
  return calculators.filter((c) => c.category === slug).length;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function calculatorsByCategory(slug: CategorySlug): Calculator[] {
  return calculators.filter((c) => c.category === slug);
}

export function getCalculator(
  category: string,
  slug: string,
): Calculator | undefined {
  return calculators.find((c) => c.category === category && c.slug === slug);
}


export function calculatorHref(
  c: Pick<Calculator, "category" | "slug">,
): string {
  return `/${c.category}/${c.slug}`;
}

export function getCalculatorMeta(c: Calculator): {
  title: string;
  description: string;
} {
  return { title: c.metaTitle, description: c.metaDescription };
}

export function searchCalculators(query: string, limit = 6): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return calculators
    .map((c) => {
      const haystack = [c.name, c.description, c.category, ...c.keywords]
        .join(" ")
        .toLowerCase();
      // Score: every term must appear; name matches rank highest.
      const matchesAll = terms.every((t) => haystack.includes(t));
      if (!matchesAll) return { c, score: -1 };
      const nameHit = c.name.toLowerCase().includes(q) ? 2 : 0;
      const startHit = c.name.toLowerCase().startsWith(q) ? 1 : 0;
      return { c, score: nameHit + startHit };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.c);
}

export const siteStats = [
  { label: "Calculators", value: calculators.length, suffix: "+", icon: "fa-calculator" },
  { label: "Categories", value: categories.length, suffix: "", icon: "fa-layer-group" },
  { label: "Sign-up required", value: 0, suffix: "", icon: "fa-user-slash" },
  { label: "Cost to use", value: 0, suffix: "", prefix: "$", icon: "fa-tag" },
] as const;

export const faqs = [
  {
    q: "Are these calculators really free to use?",
    a: "Yes. Every calculator on the platform is completely free, with no account, subscription or hidden limits. Open a tool, enter your numbers and get results instantly.",
  },
  {
    q: "Do I need to create an account?",
    a: "No sign-up is required. You can use any calculator immediately. Optional features like saving a calculation work through shareable links, so your data never has to leave your browser.",
  },
  {
    q: "How accurate are the results?",
    a: "Each calculator uses the standard, published formula for its domain — for example amortization for mortgages and the U.S. Navy method for body fat. Calculation logic is written and tested in code, never guessed.",
  },
  {
    q: "Can I share or save a calculation?",
    a: "Yes. Your inputs are encoded into the page URL, so you can bookmark a result or send the link to someone and they will see your exact numbers when it loads.",
  },
  {
    q: "Do the calculators work on mobile?",
    a: "Absolutely. The platform is built mobile-first, with large touch targets, responsive layouts and sliders designed to stay usable on phones and tablets.",
  },
  {
    q: "Is my data private?",
    a: "Your inputs are processed in your browser for instant results. We do not require personal information to use a calculator, and financial or health figures you enter are not stored on our servers.",
  },
];
