<?php
class modules_group_permissions_installer {
    function update_1(){
        $sql[] = "CREATE  TABLE `xataface__groups` (
              `group_id` INT(11) NOT NULL AUTO_INCREMENT ,
              `group_name` VARCHAR(45) NOT NULL ,
              PRIMARY KEY (`group_id`) ,
              UNIQUE INDEX `group_name_UNIQUE` (`group_name` ASC) )";
              
        $sql[] = "CREATE  TABLE `xataface__group_members` (
              `group_id` INT(11) NOT NULL ,
              `username` VARCHAR(45) NOT NULL ,
              `role` ENUM('MEMBER','MANAGER') NULL DEFAULT 'MEMBER' ,
              PRIMARY KEY (`group_id`, `username`) );";
           
           
        
        df_q($sql);

    }
}