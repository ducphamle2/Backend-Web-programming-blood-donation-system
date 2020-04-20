/***CREATING ALL TABLES*/
GRANT ALL PRIVILEGES ON *.* TO 'user' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' IDENTIFIED BY 'password';

create database mydb;
USE mydb;

CREATE TABLE donor (
  donor_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  donor_name            VARCHAR(30)                   NULL,
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL,
  blood_type            VARCHAR(5)                    NULL, 
  dob                   DATETIME                      NULL
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE red_cross (
  redcross_id           CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  redcross_name         VARCHAR(30)                   NULL, 
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE organizer (
  organizer_id          CHAR(32) PRIMARY KEY UNIQUE   NOT NULL,
  redcross_id           CHAR(32) UNIQUE               NOT NULL,
  organizer_name        VARCHAR(30)                   NULL, 
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL,
  FOREIGN KEY (redcross_id) REFERENCES red_cross(redcross_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE hospital (
  hospital_id           CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  hospital_name         VARCHAR(30)                   NULL, 
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE blood_store (
  store_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  redcross_id           CHAR(32) UNIQUE               NOT NULL, 
  bloodType             VARCHAR(5)                    NOT NULL, 
  amount                DOUBLE PRECISION              NULL,
  FOREIGN KEY (redcross_id) REFERENCES red_cross(redcross_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE notification (
  notification_id       CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  redcross_id           CHAR(32) UNIQUE               NOT NULL,  
  organizer_id          CHAR(32) UNIQUE               NOT NULL, 
  noti_date             DATETIME                      NULL, 
  content               VARCHAR(50)                   NULL,
  FOREIGN KEY (redcross_id) REFERENCES red_cross(redcross_id),
  FOREIGN KEY (organizer_id) REFERENCES organizer(organizer_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE event (
  event_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  redcross_id           CHAR(32) UNIQUE               NOT NULL, 
  organizer_id          CHAR(32) UNIQUE               NOT NULL, 
  event_date            DATETIME                      NULL, 
  event_name            VARCHAR(30)                   NULL, 
  location              VARCHAR(50)                   NULL, 
  status                VARCHAR(10)                   NULL,
  FOREIGN KEY (redcross_id) REFERENCES red_cross(redcross_id),
  FOREIGN KEY (organizer_id) REFERENCES organizer(organizer_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE blood (
  blood_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  redcross_id           CHAR(32) UNIQUE               NOT NULL,  
  event_id              CHAR(32) UNIQUE               NOT NULL, 
  donor_id              CHAR(32) UNIQUE               NOT NULL, 
  donate_date           DATETIME                      NULL, 
  amount                DOUBLE PRECISION              NULL, 
  status                VARCHAR(10)                   NULL,
  FOREIGN KEY (redcross_id) REFERENCES red_cross(redcross_id),
  FOREIGN KEY (event_id) REFERENCES event(event_id), 
  FOREIGN KEY (donor_id) REFERENCES donor(donor_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

insert into red_cross values ('axswitkxfjguws', 'Red Cross', '$2a$08$e1vJwED9DFpXzwgd15LxruIvnBluHtu8px17S6ucv2k7NuRW8fHUq', 'abc@gmail.com', "DH BKHN");
insert into donor values ('txstitkxfjguwa', 'Ricardo Milos', '$2a$08$e1vJwED9DFpXzwgd15LxruIvnBluHtu8px17S6ucv2k7NuRW8fHUq', 'abcd@gmail.com', NULL, NULL, NULL);
insert into organizer values ('bxswitkxfjguwa', 'axswitkxfjguws', 'BK', '$2a$08$e1vJwED9DFpXzwgd15LxruIvnBluHtu8px17S6ucv2k7NuRW8fHUq', 'abcde@gmail.com', NULL);
insert into hospital values ('gxswitkxfjguwa', 'Hospital', '$2a$08$e1vJwED9DFpXzwgd15LxruIvnBluHtu8px17S6ucv2k7NuRW8fHUq', 'ggg@gmail.com', NULL);