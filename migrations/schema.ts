import { pgTable, pgEnum, uuid, text, foreignKey, timestamp, boolean, jsonb, integer, bigint } from "drizzle-orm/pg-core"

import { relations, sql } from "drizzle-orm"
export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn', 'phone'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['day', 'week', 'month', 'year'])
export const pricingType = pgEnum("pricing_type", ['one_time', 'recurring'])
export const subscriptionStatus = pgEnum("subscription_status", ['trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const customers = pgTable("customers", {
	id: uuid("id").primaryKey().notNull(),
	stripeCustomerId: text("stripe_customer_id"),
});

export const folders = pgTable("folders", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" } ),
});

export const files = pgTable("files", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" } ),
	folderId: uuid("folder_id").notNull().references(() => folders.id, { onDelete: "cascade" } ),
});

export const products = pgTable("products", {
	id: text("id").primaryKey().notNull(),
	active: boolean("active"),
	name: text("name"),
	description: text("description"),
	image: text("image"),
	metadata: jsonb("metadata"),
});
export const subscriptions = pgTable("subscriptions", {
	id: text("id").primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	status: subscriptionStatus("status"),
	metadata: jsonb("metadata"),
	priceId: text("price_id").references(() => prices.id),
	quantity: integer("quantity"),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	created: timestamp("created", { withTimezone: true, mode: "string" })
	  .default(sql`now()`)
	  .notNull(),
	currentPeriodStart: timestamp("current_period_start", {
	  withTimezone: true,
	  mode: "string",
	})
	  .default(sql`now()`)
	  .notNull(),
	currentPeriodEnd: timestamp("current_period_end", {
	  withTimezone: true,
	  mode: "string",
	})
	  .default(sql`now()`)
	  .notNull(),
	endedAt: timestamp("ended_at", {
	  withTimezone: true,
	  mode: "string",
	}).default(sql`now()`),
	cancelAt: timestamp("cancel_at", {
	  withTimezone: true,
	  mode: "string",
	}).default(sql`now()`),
	canceledAt: timestamp("canceled_at", {
	  withTimezone: true,
	  mode: "string",
	}).default(sql`now()`),
	trialStart: timestamp("trial_start", {
	  withTimezone: true,
	  mode: "string",
	}).default(sql`now()`),
	trialEnd: timestamp("trial_end", {
	  withTimezone: true,
	  mode: "string",
	}).default(sql`now()`),
  });

export const collaborators = pgTable("collaborators", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	workspaceRole: text("workspace_role").default('employee').notNull(),
});

export const dummy = pgTable("dummy", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name"),
	workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" } ),
	assignedTo: uuid("assigned_to").notNull().references(() => collaborators.id, { onDelete: "cascade" } ),
	role: text("role").default('user').notNull(),
});

export const prices = pgTable("prices", {
	id: text("id").primaryKey().notNull(),
	productId: text("product_id").references(() => products.id),
	active: boolean("active"),
	description: text("description"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitAmount: bigint("unit_amount", { mode: "number" }),
	currency: text("currency"),
	type: pricingType("type"),
	interval: pricingPlanInterval("interval"),
	intervalCount: integer("interval_count"),
	trialPeriodDays: integer("trial_period_days"),
	metadata: jsonb("metadata"),
});

export const users = pgTable("users", {
	id: uuid("id").primaryKey().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	billingAddress: jsonb("billing_address"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	paymentMethod: jsonb("payment_method"),
	email: text("email"),
});

export const workspaces = pgTable("workspaces", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	workspaceOwner: uuid("workspace_owner").notNull(),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	logo: text("logo"),
	bannerUrl: text("banner_url"),
});

export const tasks = pgTable("tasks", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" } ),
	title: text("title").notNull(),
	description: text("description"),
	status: text("status").default('pending').notNull(),
	assignedTo: uuid("assigned_to").notNull().references(() => collaborators.id, { onDelete: "cascade" } ),
	createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" } ),
	dueDate: timestamp("due_date", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
}));

export const priceRelations = relations(prices, ({ one }) => ({
  product: one(products, {
	fields: [prices.productId],
	references: [products.id],
  }),
}));


export const taskRelations = relations(tasks,({one})=>({
  collaborators:one(collaborators,{
	fields:[tasks.assignedTo],
	references:[collaborators.id]
  }),
  createdByUser:one(users,{
	fields:[tasks.createdBy],
	references:[users.id]
  })
}))

export const collaboratorRelations = relations(collaborators,({many,one})=>({
  tasks:many(tasks),
  user:one(users,{
	fields:[collaborators.userId],
	references:[users.id]
  })
}))
