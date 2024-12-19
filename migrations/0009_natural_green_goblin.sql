ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigned_to_collaborators_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "assigned_to";