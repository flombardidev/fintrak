export function clientsCalculations() {
  function calcTotalCreditDebt(schedule) {
    return schedule.reduce((acc, row) => acc + row.installment, 0);
  }
  function calcTotalCreditInterests(schedule) {
    return schedule.reduce((acc, row) => acc + row.interestPaid, 0);
  }
  function calcTotalClientDebt(activeCredits) {
    const totalRemaining = activeCredits.reduce((acc, credit) => {
      const remaining = calcTotalCreditDebt(credit.schedule);
      return acc + remaining;
    }, 0);
    return totalRemaining;
  }
  function calcTotalClientInterests(activeCredits) {
    const totalClientInterests = activeCredits.reduce((acc, credit) => {
      const remaining = calcTotalCreditInterests(credit.schedule);
      return acc + remaining;
    }, 0);

    return totalClientInterests;
  }

  return {
    calcTotalCreditDebt,
    calcTotalCreditInterests,
    calcTotalClientDebt,
    calcTotalClientInterests,
  };
}
