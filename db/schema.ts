import {
  pgTable, pgEnum, uuid, varchar, text, boolean, timestamp, date,
  integer, numeric, jsonb, index, uniqueIndex
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["OWNER", "ADMIN", "STAFF"]);
export const paymentDestination = pgEnum("payment_destination", [
  "CENTRE_CASH", "EDISTRICT_WALLET", "CSC_WALLET", "CENTRE_BANK", "PERSONAL_GPAY", "OTHER"
]);
export const transactionKind = pgEnum("transaction_kind", [
  "SERVICE", "CREDIT_GIVEN", "CREDIT_REPAYMENT", "ADVANCE_RECEIVED",
  "ADVANCE_USED", "EXPENSE", "CENTRE_TRANSFER", "OWNER_WITHDRAWAL", "DEPARTMENT_PAYMENT", "ADJUSTMENT"
]);
export const transactionStatus = pgEnum("transaction_status", ["DRAFT", "POSTED", "VOIDED"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  username: varchar("username", { length: 80 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("STAFF"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => [uniqueIndex("users_username_uq").on(t.username)]);

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  mobile: varchar("mobile", { length: 20 }),
  gstNumber: varchar("gst_number", { length: 20 }),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => [index("customers_name_idx").on(t.name)]);

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  defaultDepartmentFee: numeric("default_department_fee", { precision: 12, scale: 2 }).notNull().default("0"),
  defaultServiceCharge: numeric("default_service_charge", { precision: 12, scale: 2 }).notNull().default("0"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  reference: varchar("reference", { length: 40 }).notNull(),
  kind: transactionKind("kind").notNull(),
  status: transactionStatus("status").notNull().default("DRAFT"),
  customerId: uuid("customer_id").references(() => customers.id),
  serviceId: uuid("service_id").references(() => services.id),
  createdBy: uuid("created_by").references(() => users.id),
  serviceDate: date("service_date").notNull(),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  departmentFee: numeric("department_fee", { precision: 12, scale: 2 }).notNull().default("0"),
  serviceCharge: numeric("service_charge", { precision: 12, scale: 2 }).notNull().default("0"),
  destination: paymentDestination("destination"),
  relatedTransactionId: uuid("related_transaction_id"),
  description: text("description"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  postedAt: timestamp("posted_at", { withTimezone: true }),
  voidedAt: timestamp("voided_at", { withTimezone: true })
}, (t) => [
  uniqueIndex("transactions_reference_uq").on(t.reference),
  index("transactions_date_idx").on(t.serviceDate),
  index("transactions_kind_status_idx").on(t.kind, t.status),
  index("transactions_customer_idx").on(t.customerId)
]);

export const centreBalances = pgTable("centre_balances", {
  id: uuid("id").defaultRandom().primaryKey(),
  balanceDate: date("balance_date").notNull(),
  destination: paymentDestination("destination").notNull(),
  openingAmount: numeric("opening_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  closingAmount: numeric("closing_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  note: text("note"),
  recordedBy: uuid("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => [
  uniqueIndex("centre_balances_date_destination_uq").on(t.balanceDate, t.destination),
  index("centre_balances_date_idx").on(t.balanceDate)
]);

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 80 }).notNull(),
  entityId: uuid("entity_id"),
  summary: text("summary").notNull(),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => [index("audit_log_created_idx").on(t.createdAt)]);
