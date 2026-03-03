// utils/loanCalculations.js

/**
 * Convierte tasa anual nominal (%) a tasa mensual decimal
 * @param {number} annualRate - tasa anual en %
 * @returns {number} tasa mensual decimal
 */
export function calculateMonthlyRate(annualRate) {
  return annualRate / 12 / 100;
}

/**
 * Calcula la cuota mensual fija usando sistema francés
 * @param {number} principal - capital inicial
 * @param {number} annualRate - tasa anual en %
 * @param {number} months - cantidad de cuotas
 * @returns {number} cuota mensual
 */
export function calculateInstallment(principal, annualRate, months) {
  const r = calculateMonthlyRate(annualRate);
  if (r === 0) return principal / months; // caso tasa 0%
  const numerator = principal * r * Math.pow(1 + r, months);
  const denominator = Math.pow(1 + r, months) - 1;
  return parseFloat((numerator / denominator).toFixed(2));
}

/**
 * Genera tabla de amortización completa
 * @param {number} principal
 * @param {number} annualRate
 * @param {number} months
 * @returns {Array} arreglo de cuotas con {month, principalPaid, interestPaid, balance, annualRate}
 */
export function generateAmortizationSchedule(principal, annualRate, months) {
  let schedule = [];
  let balance = principal;
  const installment = calculateInstallment(principal, annualRate, months);
  const r = calculateMonthlyRate(annualRate);

  for (let month = 1; month <= months; month++) {
    const interestPaid = parseFloat((balance * r).toFixed(2));
    const principalPaid = parseFloat((installment - interestPaid).toFixed(2));
    balance = parseFloat((balance - principalPaid).toFixed(2));

    const newEntry = {
      month,
      installment,
      principalPaid,
      interestPaid,
      balance: balance < 0 ? 0 : balance,
    };

    schedule = [...schedule, newEntry]; // versión inmutable
  }

  return schedule;
}
/**
 * Genera schedule a partir de un balance inicial con cuota fija
 * @param {number} balance - saldo inicial
 * @param {number} annualRate - tasa anual
 * @param {number} installment - cuota mensual fija
 * @returns {Array} arreglo de cuotas hasta balance = 0
 */
export function generateScheduleWithFixedInstallment(
  balance,
  annualRate,
  installment,
) {
  const monthlyRate = calculateMonthlyRate(annualRate);
  const schedule = [];
  let month = 1;

  while (balance > 0) {
    const interestPaid = parseFloat((balance * monthlyRate).toFixed(2));
    let principalPaid = parseFloat((installment - interestPaid).toFixed(2));

    if (principalPaid > balance) principalPaid = balance; // último mes
    balance = parseFloat((balance - principalPaid).toFixed(2));

    schedule.push({
      month,
      installment: parseFloat((principalPaid + interestPaid).toFixed(2)),
      principalPaid,
      interestPaid,
      balance,
    });

    month++;
  }

  return schedule;
}

// Validación: solo throw, nada de alert
export function validateEarlyPaymentInput(amountInput, monthInput) {
  const amount = Number(amountInput);
  const month = Number(monthInput);

  if (!amountInput || Number.isNaN(amount)) {
    throw new Error("Amount is required and must be a valid number");
  }

  if (!monthInput || Number.isNaN(month)) {
    throw new Error("Month is required and must be a valid number");
  }

  if (amount < 3000) {
    throw new Error("Minimum early payment is 3000€");
  }

  if (month <= 0 || !Number.isInteger(month)) {
    throw new Error("Month must be a positive integer");
  }
  console.log(month);
  return { amount, month };
}
export function applyEarlyPayment(schedule, amount, monthNumber, annualRate) {
  const currentBalance = schedule[monthNumber - 1].balance;

  if (amount < 3000) throw new Error("Pago adelantado mínimo 3000€");
  if (amount > currentBalance)
    throw new Error(
      `Pago adelantado demasiado alto. Saldo restante: ${currentBalance.toFixed(2)}€`,
    );

  let newBalance = currentBalance - amount;

  if (newBalance < 0) {
    newBalance = 0;
  }
  if (newBalance === 0) return []; //credito cancelado

  const installment = schedule[0].installment; // cuota fija original

  return generateScheduleWithFixedInstallment(
    newBalance,
    annualRate,
    installment,
  );
}

/**
 * Calcula saldo restante hasta el mes especificado
 * @param {Array} schedule
 * @param {number} monthNumber
 * @returns {number} saldo restante
 */
// export function calculateRemainingBalance(schedule, monthNumber) {
//   if (monthNumber > schedule.length) return 0;
//   return schedule[monthNumber - 1].balance;
// }
