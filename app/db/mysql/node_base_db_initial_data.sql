-- -----------------------------------------------------
-- Insert oauth_client
-- -----------------------------------------------------
insert  into `oauth_client`(`client_id`,`client_secret`,`redirect_uri`) values ('dv_id','dv_secret',NULL);

-- -----------------------------------------------------
-- Insert Maintainers
-- -----------------------------------------------------
insert into maintainers (name, surname, email) values ('Armen', 'Zakaryan', 'armenzakary@gmail.com');



-- -----------------------------------------------------
-- 1 Insert and Activate 1 Test User with cred -> armenzakary@gmail.com/demandvue
-- -----------------------------------------------------
INSERT INTO `account` (`id`, `name`, `domain_name`) VALUES (1,'test1','test1.com');
INSERT INTO `user` (`id`, `username`, `password`, `type`, `verified`, `create_date`, `last_login`) VALUES (1000000,'armenzakary@gmail.com','$2a$10$qwm8uiGbONMXgvMzoJfJs.TsCkeDzRvFhYcnFSzsz/U03Z2yIm0fe','CLIENT',1, NULL, NULL);
INSERT INTO `account_user` (`id`, `role`, `account_id`, `user_id`) VALUES (1,'ADMIN_USER',1,1000000);
INSERT INTO `profile` (`user_id`, `first_name`, `last_name`) VALUES (1000000, "Armen","Zakaryan");


-- -----------------------------------------------------
-- 3 Insert and Activate 1 Test ADMIN -> jone0089@gmail.com/demandvue
-- -----------------------------------------------------
INSERT INTO `user` (`id`, `username`, `password`, `type`, `verified`, `create_date`, `last_login`) VALUES (1000002,'jone0089@gmail.com','$2a$10$qwm8uiGbONMXgvMzoJfJs.TsCkeDzRvFhYcnFSzsz/U03Z2yIm0fe','ADMIN',1, NULL, NULL);
INSERT INTO `admin` (`user_id`, `admin_specific_data`) VALUES (1000002, "Some security DATA");
INSERT INTO `profile` (`user_id`, `first_name`, `last_name`) VALUES (1000002, "Admin","Admin");