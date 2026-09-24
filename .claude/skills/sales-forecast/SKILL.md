---
name: sales-forecast
description: >
  Build a defensible sales forecast by triangulating three methods (pipeline-weighted, run-rate,
  and trend from 12/12 rate-of-change) with seasonality, on-pace math for open periods,
  confidence bands from historical error, and an assumptions page. Use this skill whenever
  someone needs a number for the month, quarter, or year, wants to know if the team is on pace,
  or has to defend a forecast to finance or a board. Trigger on "what's the forecast," "are we
  on pace," "build the number for next year," "quarter forecast," "how confident are we."
  Pairs with [[crm-pipeline-review]] for the pipeline input and [[itr-trend-analysis]] for the
  cycle read behind the trend method.
---

# Sales Forecast

A forecast is defensible when it is built three ways and the ways agree, or when they disagree
and the reason is written down. The trap is a single method: pipeline-only forecasts miss the
run-rate business that never touches the CRM, and run-rate-only forecasts miss the turn in the
cycle. Done means three independent numbers, a triangulated forecast with a confidence band,
seasonality applied correctly, an on-pace read for the open period, and an assumptions page
that lets anyone rebuild it.

## Inputs
- Monthly shipments or invoiced sales by month for at least 36 months from the ERP, read-only;
  by product family, territory, or distributor if cuts are wanted. 24 months is the minimum for
  a 12/12; under 24 the trend method is dropped and the output says so.
- Open pipeline from the CRM with amount, stage, expected close date, forecast category; and
  the historical stage-to-won conversion rates (or the defaults from [[crm-pipeline-review]]).
- Business-day calendar for the open period, including plant shutdowns and holidays.
- Known one-offs: large orders that will not repeat, price changes and their effective dates,
  lost or gained accounts above 2 percent of sales, new product launches.
- Prior forecasts and their actuals for at least four periods, for the error band. If none
  exist, the band uses the volatility of the series itself and is labeled that way.

## Process

### 1. Clean the series
- Remove or flag one-offs above 3 times the monthly standard deviation with a stated reason.
  Adjust for price changes if the forecast is in units or if a price change fell mid-series
  (note the effective date and percent).
- Use ship or invoice month consistently; never mix booking and shipping months.

### 2. Method A, trend (rate-of-change)
- `12MMT = sum of the last 12 months`. `12/12 ROC = (12MMT ÷ 12MMT one year earlier − 1) × 100`.
  `3/12 ROC = (last 3 months ÷ same 3 months a year ago − 1) × 100`.
- Forecast a future period as `same period last year × (1 + projected ROC)`, where the
  projected ROC starts at the current 12/12 and bends toward the 3/12 (the 3/12 leads the 12/12
  by roughly 3 to 6 months in most industrial series). Default: for the next quarter use the
  average of the 12/12 and 3/12; beyond that, the phase read from [[itr-trend-analysis]] sets the
  path.

### 3. Method B, run-rate with seasonality
- `Seasonal index for month m = average of month m over 3 years ÷ average of all months over
  the same 3 years`. Indexes average to 1.00; if they do not, renormalize.
- `Deseasonalized run rate = average of the last 3 months ÷ their seasonal indexes`.
- Forecast month = deseasonalized run rate × that month's seasonal index.
- Use 6 months in the run rate if the series is lumpy (coefficient of variation over 0.25).

### 4. Method C, pipeline-weighted plus base
- `Weighted pipeline closing in period = Σ (amount × stage conversion rate × in-period close
  probability)`, where in-period close probability discounts deals whose close date is in the
  last 10 days of the period (default 0.6) and deals already pushed once (default 0.5).
- Add the base business: the run-rate forecast for revenue that does not flow through the
  CRM (repeat orders, distributor stock orders), estimated as the share of trailing-12-month
  sales with no opportunity attached. State that share.

### 5. Triangulate and band
- Default weights: trend 0.4, run-rate 0.3, pipeline 0.3 for a quarter; trend 0.5, run-rate 0.3,
  pipeline 0.2 for a year. Adjust with a written reason (a large launch raises pipeline weight;
  a cycle turn raises trend weight).
- `Forecast = Σ (method × weight)`. Show all three unblended too.
- Confidence band from history: `MAPE = mean of |actual − forecast| ÷ actual` over the prior
  periods. Band = forecast × (1 ± MAPE); label 80 percent if at least 8 prior periods exist.
  With no history, band = forecast × (1 ± CV of the monthly series over 24 months) and say so.
- Disagreement rule: if the highest and lowest methods differ by more than 15 percent, the
  output explains which one is wrong and why before giving the number.

### 6. On-pace math for the open period
- `Pace = month-to-date sales ÷ business days elapsed × business days in month`, then adjust
  for the seasonal shape inside the month if the company has a known end-of-month load (default:
  none). Report `pace ÷ forecast` and `pace ÷ target`.
- For the quarter: closed months actual plus the current month's pace plus the forecast for
  remaining months.

### 7. Assumptions page
- Every default, weight, exclusion, seasonal index, conversion rate, and data window, with the
  source and the date read. Someone with the same extracts must be able to reproduce the number.

## Output format

ALWAYS structure as:
1. **The number** — forecast for each requested period with the band, versus target and versus
   the same period last year, and the on-pace read for the open period.
2. **Three methods side by side** — trend, run-rate, pipeline, their weights, and the blended
   result; the disagreement explanation if triggered.
3. **Trend read** — 12/12, 3/12, 1/12 with the last 24 months charted or tabled, and the phase.
4. **Seasonality table** — monthly indexes and the years used.
5. **Pipeline contribution** — weighted pipeline by month, base-business share, coverage ratio.
6. **Cuts** — by family, territory, or distributor where requested, each with n and its own band.
7. **Risks and upside** — named accounts, launches, price changes, cycle risk, each with a dollar
   range.
8. **Assumptions page** — everything from step 7.

## Guardrails
- Every input is read from the ERP extract and the CRM export in this session; no figure is
  carried from a prior forecast or a dashboard without re-reading it.
- The forecast is a proposal to sales leadership and finance; the skill never writes targets,
  quotas, or forecasts back into any system.
- Illustrative defaults (weights, conversion rates, in-period probabilities) are labeled as
  defaults until replaced by the company's measured values.
- Never present a single-point forecast without its band and its assumptions page.
- Cuts with fewer than 24 months or fewer than 20 deals carry a small-sample flag and are not
  used for quota on their own.

## Operating excellence

Hold this work to the standard of a top-tier specialist consultancy.

- **Clarify to elevate.** If the request is ambiguous or missing facts would change the outcome, proceed with the best-judgment default, state the assumption, and end with a short **"To make this better, tell me:"** list.
- **Recommend beyond the ask.** Flag adjacent opportunities or risks in a brief **Recommendations** section — don't silently expand scope.
- **Verify, don't recall.** Check load-bearing claims against the live system, real code, or actual data.
- **Force multipliers:** ITR Economics Trends Report (paid) for leading indicators and the cycle phase behind the trend weight; FRED (free) for industrial production and capacity-utilization series to sanity-check the 12/12; the ERP shipment and invoice tables as the only source of the monthly series; Clari or Aviso (paid) if pipeline conversion rates need to be measured continuously rather than quarterly. If a paid tool or subscription would materially improve the outcome, say so and name what it unlocks.
