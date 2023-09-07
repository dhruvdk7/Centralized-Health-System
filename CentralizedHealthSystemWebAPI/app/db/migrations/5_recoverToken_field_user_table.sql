-- migrate:up

ALTER TABLE `CSCI5308_18_DEVINT`.`Users` ADD recoverToken VARCHAR(MAX);

-- migrate:down

ALTER TABLE `CSCI5308_18_DEVINT`.`Users` DROP COLUMN IF EXISTS recoverToken;
