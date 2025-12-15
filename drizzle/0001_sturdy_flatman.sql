CREATE TABLE `recruitment_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`idade` int NOT NULL,
	`trabalha` int NOT NULL,
	`discordId` varchar(64) NOT NULL,
	`recrutador` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recruitment_applications_id` PRIMARY KEY(`id`)
);
