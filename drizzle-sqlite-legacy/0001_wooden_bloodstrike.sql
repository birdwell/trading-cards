PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sets` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`year` text NOT NULL,
	`source_file` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sets`("id", "name", "year", "source_file") SELECT "id", "name", "year", "source_file" FROM `sets`;--> statement-breakpoint
DROP TABLE `sets`;--> statement-breakpoint
ALTER TABLE `__new_sets` RENAME TO `sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;