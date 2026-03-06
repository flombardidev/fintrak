import { generateAmortizationSchedule } from "./loanCalculations";

const DEMO_CLIENTS = [
  { id: "c1", name: "Marie Laurent",  email: "marie@email.fr",     phone: "06 12 34 56 78", createdAt: "2025-10-01T10:00:00Z" },
  { id: "c2", name: "Pierre Renard",  email: "p.renard@mail.fr",   phone: "06 98 76 54 32", createdAt: "2025-11-15T09:00:00Z" },
  { id: "c3", name: "Sophie Dubois",  email: "s.dubois@gmail.com", phone: "07 11 22 33 44", createdAt: "2025-12-01T08:30:00Z" },
  { id: "c4", name: "Thomas Martin",  email: "t.martin@pro.fr",    phone: "06 55 44 33 22", createdAt: "2026-01-10T11:00:00Z" },
];

const DEMO_CREDITS = [
  {
    id: "cr1", clientId: "c1", clientName: "Marie Laurent",
    principal: 18000, annualRate: 4.5, months: 48,
    status: "active", createdAt: "2025-10-05T10:00:00Z",
    installment: generateAmortizationSchedule(18000, 4.5, 48)[0].installment,
    schedule: generateAmortizationSchedule(18000, 4.5, 48),
  },
  {
    id: "cr2", clientId: "c2", clientName: "Pierre Renard",
    principal: 8500, annualRate: 6.2, months: 24,
    status: "late", createdAt: "2025-11-20T09:00:00Z",
    installment: generateAmortizationSchedule(8500, 6.2, 24)[0].installment,
    schedule: generateAmortizationSchedule(8500, 6.2, 24),
  },
  {
    id: "cr3", clientId: "c3", clientName: "Sophie Dubois",
    principal: 12000, annualRate: 3.8, months: 36,
    status: "active", createdAt: "2025-12-10T08:30:00Z",
    installment: generateAmortizationSchedule(12000, 3.8, 36)[0].installment,
    schedule: generateAmortizationSchedule(12000, 3.8, 36),
  },
  {
    id: "cr4", clientId: "c4", clientName: "Thomas Martin",
    principal: 55000, annualRate: 2.9, months: 240,
    status: "active", createdAt: "2026-01-15T11:00:00Z",
    installment: generateAmortizationSchedule(55000, 2.9, 240)[0].installment,
    schedule: generateAmortizationSchedule(55000, 2.9, 240),
  },
];

export function seedDemoData() {
  localStorage.setItem("clients", JSON.stringify(DEMO_CLIENTS));
  localStorage.setItem("credits", JSON.stringify(DEMO_CREDITS));
}