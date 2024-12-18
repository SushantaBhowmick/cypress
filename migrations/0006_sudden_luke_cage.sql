ALTER TABLE "dummy" ADD COLUMN "assigned_to" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dummy" ADD CONSTRAINT "dummy_assigned_to_collaborators_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "collaborators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
