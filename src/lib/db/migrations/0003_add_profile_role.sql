ALTER TABLE `profile` ADD `role` text DEFAULT 'member' NOT NULL;--> statement-breakpoint
CREATE INDEX `profile_role_idx` ON `profile` (`role`);