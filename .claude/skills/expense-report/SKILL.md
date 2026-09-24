---
name: expense-report
description: Build Mike's RobbJack expense report from bank statements + Amazon receipts, with dedup against the prior report, category rules, redacted statement PDFs, and a personal-merchant leak scan. Use when Mike asks to do his expense report, add statements/receipts to it, or regenerate the redacted support documents.
---

# Mike's expense report pipeline

Reusable workflow proven on the Aug 2026 report (4/23–8/25, 180 rows, $41,341.44).
Scripts live in `F:\My Documents\expense-report-tools\` (its own git repo — commit after changes).
They have session-scratchpad paths hardcoded from the original session — update paths (or run them from a copy) before reuse.

## Inputs

- **Prior expense report** (dedup baseline + template): newest `F:\My Documents\Expense Report *.xlsx`. Template = the file itself; sheet "Expense Report" holds Excel Table `Table3` (Date, Merchant, Expense Category, GL ACCT #, Description, Amount NEGATIVE, Column1 = do-not-touch, col H = Review Note), totals row `=SUM(Table3[Amount])`.
- **Statements** (Mike downloads to `Downloads\`): BofA credit card `<Month>2026_0656.csv` + `currentTransaction_0656.csv`; BofA checking `stmt.csv` (real purchase date is embedded in the description as `MM/DD PURCHASE`); Chase `Chase1180_Activity_*.csv` (dedupe duplicate downloads by file hash; HTML-unescape descriptions). The Prime Visa ...8050 may be a separate Chase account — verify coverage: if recurring items (AT&T, ChatGPT, Adobe, Thomas Publishing) vanish mid-period, statements are missing, say so.
- **Amazon receipts**: Mike drags receipt emails from New Outlook into `Downloads\Amazon-Reciepts\` as .eml (browser automation to Outlook is blocked on this machine). Extract PDF attachments, read them, add one row per order citing the order number. Warn: same-subject emails can collide on filename during the drag.

## Rules (Mike's rulings — do not relitigate)

1. NEVER include: interest charges, late fees, TikTok (huge volume, always personal), Cash App/Zelle-to-people/Apple Cash (except ruled ones), OnlyFans, household bills (PG&E, propane, insurance, Tesla, Sara MacArthur, subscriptions Netflix/Hulu/Spotify), groceries at home.
2. Chase annual membership fee IS expensed → Dues/Subscriptions (ruled 8/25).
3. Always include: all gas fill-ups ≥$20 (Chevron/Shell/Arco/**1010 Hassan and Sons = "H&S"**), QuickQuack/Jiffy Lube/smog, Adobe $69.99, iCloud $9.99, Apple $10.71 "data" → Telephone, **PP*APPLE.COM/BILL $179.99 = PVD cell → Telephone**, AT&T MOBILITY = RJ Phones → Telephone, OpenAI/ChatGPT → Software "AI", Netlify/Cloudflare/Google Cloud/Resend → Software (website), Vistage → Education/Training, Placer Sporting Club → Dues "RJ guests", Thomas Publishing → Advertising "PVD", USCTI → Dues, airport parking/FasTrak → Travel, company picnic items → Entertainment.
4. Uncertain rows: include with a note in column H ("POSSIBLE - verify") — Mike deletes, never silently drop. Put everything excluded on an "Excluded - Review" sheet; Mike promotes rows back by adding category + notes there.
5. Dedup vs prior report: same amount + date within ±8 days + merchant text agreement, consume-once (statements post 1–2 days after transaction dates).
6. Mixed personal/business orders: only the business line items + their share of tax (e.g., 6/6 Amazon → $25.99+$9.99+7.25% tax = $38.59).

## Deliverables

1. **Workbook** `F:\My Documents\Expense Report RobbJack <Mon> <YYYY> Mike Mac.xlsx` — copy of the prior file, rows date-sorted, Table3 ref updated, header dates/purpose updated.
2. **Redacted statement PDFs** in `F:\My Documents\Expense <Mon> <YYYY> - redacted statements\` via `redact_statements.py` (reads the FINAL workbook): business lines visible; personal lines = soft gray rounded "personal transaction" rows (NEVER black bars — Mike 8/25); balances/accounts/addresses omitted. Matching is amount+date±8d+merchant, consume-once. **The built-in leak scan must print CLEAN before sending** — it counts personal merchants in the output PDFs against budgets.
3. **Receipts** in that folder's `receipts\` subfolder, named `<Merchant> <date> <amount> <what>.pdf`. Receipts are image-PDFs: redact by blurring pixel regions (`blur_receipt.py` pattern — downscale+Gaussian, unreadable), keep business items/totals visible, blur home address.
4. Re-run redaction after ANY workbook edit. Reconciliation invariant: visible statement lines + receipt-backed rows = total report rows.

## Memory

Session state and open questions: memory file `expense-report-automation`.
