CREATE TABLE `cards` (
	`id` integer PRIMARY KEY NOT NULL,
	`card_number` integer NOT NULL,
	`player_name` text NOT NULL,
	`card_type` text NOT NULL,
	`set_id` integer NOT NULL,
	FOREIGN KEY (`set_id`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`year` integer NOT NULL,
	`source_file` text NOT NULL
);
