/*
MySQL Backup
Database: wxserver
Backup Time: 2019-01-03 20:52:33
*/

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `wxserver`.`user_nickname`;
DROP TABLE IF EXISTS `wxserver`.`user_place`;
DROP TABLE IF EXISTS `wxserver`.`visit_count`;
CREATE TABLE `user_nickname` (
  `id` int(255) NOT NULL AUTO_INCREMENT COMMENT '在本数据库的id',
  `nickName` varchar(255) NOT NULL COMMENT '微信昵称',
  PRIMARY KEY (`id`,`nickName`) USING BTREE,
  UNIQUE KEY `nickName` (`nickName`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `all` (`id`,`nickName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `user_place` (
  `nickName` varchar(255) NOT NULL COMMENT '昵称是usernickname中nickname的外键',
  `place` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '该用户选择的城市',
  UNIQUE KEY `nickName` (`nickName`,`place`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `visit_count` (
  `totalCount` int(255) NOT NULL AUTO_INCREMENT COMMENT '第几次访问',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '自动获取日期',
  `nickName` varchar(255) NOT NULL COMMENT '昵称',
  PRIMARY KEY (`totalCount`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
BEGIN;
LOCK TABLES `wxserver`.`user_nickname` WRITE;
DELETE FROM `wxserver`.`user_nickname`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `wxserver`.`user_place` WRITE;
DELETE FROM `wxserver`.`user_place`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `wxserver`.`visit_count` WRITE;
DELETE FROM `wxserver`.`visit_count`;
UNLOCK TABLES;
COMMIT;
