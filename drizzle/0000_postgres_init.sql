CREATE TABLE "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"card_number" integer NOT NULL,
	"player_name" text NOT NULL,
	"card_type" text NOT NULL,
	"set_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"year" text NOT NULL,
	"source_file" text NOT NULL,
	"sport" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_cards" (
	"user_id" text NOT NULL,
	"card_id" integer NOT NULL,
	"owned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_cards_user_id_card_id_pk" PRIMARY KEY("user_id","card_id")
);
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_set_id_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;