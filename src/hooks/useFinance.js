import { useMemo } from "react";
import { isSameMonth } from "../utils/date";

/**
 *
 * @param {Array} transactions
 */
export default function useFinance(transactions = []) {
  /* ---------------------------------
     Basics
  --------------------------------- */
  const balance = useMemo(() => {
    return transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  /* ---------------------------------
     Month calculator
  --------------------------------- */
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthTx = useMemo(
    () =>
      transactions.filter((t) =>
        isSameMonth(new Date(t.createdAt), now)
      ),
    [transactions]
  );

  const lastMonthTx = useMemo(
    () =>
      transactions.filter((t) =>
        isSameMonth(new Date(t.createdAt), lastMonth)
      ),
    [transactions]
  );

  /* ---------------------------------
     Income / Expenses
  --------------------------------- */
  const incomeThisMonth = useMemo(
    () =>
      thisMonthTx
        .filter((t) => t.amount > 0)
        .reduce((a, b) => a + b.amount, 0),
    [thisMonthTx]
  );

  const expensesThisMonth = useMemo(
    () =>
      thisMonthTx
        .filter((t) => t.amount < 0)
        .reduce((a, b) => a + b.amount, 0),
    [thisMonthTx]
  );

  const cashflowThisMonth = incomeThisMonth + expensesThisMonth;

  const cashflowLastMonth = useMemo(
    () => lastMonthTx.reduce((a, b) => a + b.amount, 0),
    [lastMonthTx]
  );

  const monthlyChange =
    cashflowLastMonth === 0
      ? 0
      : ((cashflowThisMonth - cashflowLastMonth) /
          Math.abs(cashflowLastMonth)) *
        100;

  /* ---------------------------------
     Categorys
  --------------------------------- */
  const categoryTotals = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (!t.category) return;
      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += t.amount;
    });
    return map;
  }, [transactions]);

  /* ---------------------------------
     Sparquote
  --------------------------------- */
  const savingsRate =
    incomeThisMonth === 0
      ? 0
      : (cashflowThisMonth / incomeThisMonth) * 100;

  /* ---------------------------------
     Counts
  --------------------------------- */
  const transactionCount = transactions.length;
  const categoryCount = Object.keys(categoryTotals).length;

  /* ---------------------------------
     ----
  --------------------------------- */
  return {
    // global
    balance,

    // month
    incomeThisMonth,
    expensesThisMonth,
    cashflowThisMonth,
    cashflowLastMonth,
    monthlyChange,

    // savings
    savingsRate,

    // categories
    categoryTotals,

    // counts
    transactionCount,
    categoryCount,
  };
}
