ALTER TABLE "tasks" DROP CONSTRAINT "tasks_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_by" SET DATA TYPE text;