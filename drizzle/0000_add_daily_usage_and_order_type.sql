ALTER TABLE `items` ADD COLUMN `daily_usage` real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `order_type` text DEFAULT 'standard' NOT NULL;
