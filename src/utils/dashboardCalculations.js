export function getGlobalMetrics(clients, credits) {
  const activeCredits = credits.filter((c) => c.status === "active");

  const totalDebt = activeCredits.reduce((sum, credit) => {
    const remaining = credit.schedule.reduce(
      (acc, row) => acc + row.installment,
      0,
    );
    return sum + remaining;
  }, 0);

  const totalPendingInterest = activeCredits.reduce((sum, credit) => {
    const interest = credit.schedule.reduce(
      (acc, row) => acc + row.interestPaid,
      0,
    );
    return sum + interest;
  }, 0);

  const activeClients = new Set(activeCredits.map((c) => c.clientId)).size;

  return {
    totalCredits: credits.length,
    activeCredits: activeCredits.length,
    totalDebt,
    totalPendingInterest,
    activeClients,
    totalClients: clients.length,
  };
}
