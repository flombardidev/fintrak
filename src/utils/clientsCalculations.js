export function clientsCalculations() {
  function calcTotalCreditDebt(schedule) {
    return schedule.reduce((acc, row) => acc + row.installment, 0);
  }

  function calcTotalCreditInterests(schedule) {
    return schedule.reduce((acc, row) => acc + row.interestPaid, 0);
  }

  function calcTotalClientDebt(activeCredits) {
    return activeCredits.reduce((acc, credit) => {
      return acc + calcTotalCreditDebt(credit.schedule);
    }, 0);
  }

  function calcTotalClientInterests(activeCredits) {
    return activeCredits.reduce((acc, credit) => {
      return acc + calcTotalCreditInterests(credit.schedule);
    }, 0);
  }

  // ── nuevo ──────────────────────────────────────────────
  function calcDashboardMetrics(credits) {
    return {
      totalDebt: calcTotalClientDebt(credits),
      totalInterests: calcTotalClientInterests(credits),
      totalClients: [...new Set(credits.map((c) => c.clientId))].length,
      totalCredits: credits.length,
    };
  }

  return {
    calcTotalCreditDebt,
    calcTotalCreditInterests,
    calcTotalClientDebt,
    calcTotalClientInterests,
    calcDashboardMetrics,
  };
}

/**
 * Returns data for pie chart — credits grouped by status
 * @param {Array} credits
 * @returns {Array} [{name, value, color}]
 */
export function calcCreditsByStatus(credits) {
  const groups = { active: 0, late: 0, paid: 0 };
  credits.forEach((c) => {
    if (groups[c.status] !== undefined) groups[c.status]++;
  });
  return [
    { name: "Actifs", value: groups.active, color: "#059669" },
    { name: "En retard", value: groups.late, color: "#DC2626" },
    { name: "Soldés", value: groups.paid, color: "#2563EB" },
  ].filter((d) => d.value > 0);
}

/**
 * Returns data for line chart — total debt per credit over months
 * @param {Array} credits
 * @returns {Array} [{month, debt}]
 */
export function calcDebtEvolution(credits) {
  const activeCredits = credits.filter((c) => c.status !== "paid");
  if (activeCredits.length === 0) return [];

  const maxMonths = Math.min(
    Math.max(...activeCredits.map((c) => c.months)),
    60, // limitamos a 60 meses para el gráfico
  );

  return Array.from({ length: maxMonths }, (_, i) => {
    const month = i + 1;
    const debt = activeCredits.reduce((sum, credit) => {
      const row = credit.schedule?.[i];
      return row ? sum + row.balance : sum;
    }, 0);
    return { month: `M${month}`, debt: Math.round(debt) };
  });
}
