export type Destination =
  | "CENTRE_CASH" | "EDISTRICT_WALLET" | "CSC_WALLET" | "CENTRE_BANK"
  | "PERSONAL_GPAY" | "OTHER";

export type Entry = {
  kind: "SERVICE" | "CREDIT_GIVEN" | "CREDIT_REPAYMENT" | "ADVANCE_RECEIVED"
    | "ADVANCE_USED" | "EXPENSE" | "CENTRE_TRANSFER" | "OWNER_WITHDRAWAL"
    | "DEPARTMENT_PAYMENT" | "ADJUSTMENT";
  amountPaise: number;
  destination?: Destination | null;
  transferTo?: Destination | null;
  status?: "DRAFT" | "POSTED" | "VOIDED";
};

/**
 * Computes cash/bank/wallet movement from explicitly recorded entries.
 * This function does not infer destination from matching amounts.
 * Only POSTED entries affect balances. Personal GPay is never centre money.
 */
export function centreMovementPaise(entry: Entry): number {
  if (entry.status && entry.status !== "POSTED") return 0;
  const amount = entry.amountPaise;
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error("Amount must be non-negative paise");

  switch (entry.kind) {
    case "SERVICE":
    case "CREDIT_REPAYMENT":
    case "ADVANCE_RECEIVED":
      return isCentreDestination(entry.destination) ? amount : 0;
    case "CREDIT_GIVEN":
    case "ADVANCE_USED":
      return 0;
    case "EXPENSE":
    case "OWNER_WITHDRAWAL":
    case "DEPARTMENT_PAYMENT":
      return isCentreDestination(entry.destination) ? -amount : 0;
    case "CENTRE_TRANSFER":
      // Transfer is between centre accounts; it has no effect on total centre funds.
      return isCentreDestination(entry.destination) && isCentreDestination(entry.transferTo) ? 0 : 0;
    case "ADJUSTMENT":
      return 0; // Must be handled as an explicit balance adjustment in a later audited workflow.
  }
}

function isCentreDestination(destination?: Destination | null): boolean {
  return destination === "CENTRE_CASH" ||
    destination === "EDISTRICT_WALLET" ||
    destination === "CSC_WALLET" ||
    destination === "CENTRE_BANK";
}

export function reconcileClosing(input: {
  previousBalancePaise: number;
  currentBalancePaise: number;
  entries: Entry[];
}) {
  const actualMovementPaise = input.currentBalancePaise - input.previousBalancePaise;
  const expectedMovementPaise = input.entries.reduce((sum, entry) => sum + centreMovementPaise(entry), 0);
  const unexplainedShortagePaise = expectedMovementPaise - actualMovementPaise;
  return {
    actualMovementPaise,
    expectedMovementPaise,
    unexplainedShortagePaise,
    status: unexplainedShortagePaise > 0 ? "SHORTAGE" :
      unexplainedShortagePaise < 0 ? "SURPLUS" : "RECONCILED"
  } as const;
}
