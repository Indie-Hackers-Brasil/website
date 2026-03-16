CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`image_url` text,
	`project_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `posts_authorId_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `posts_projectId_idx` ON `posts` (`project_id`);--> statement-breakpoint
CREATE INDEX `posts_createdAt_idx` ON `posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `posts_type_idx` ON `posts` (`type`);