/***CREATING ALL TABLES*/
GRANT ALL PRIVILEGES ON *.* TO 'user' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' IDENTIFIED BY 'password';

create database mydb;
USE mydb;

CREATE TABLE donor (
  donor_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  name                  VARCHAR(99)                   NOT NULL,
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL,
  blood_type            VARCHAR(5)                    NULL, 
  dob                   DATETIME                      NULL
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE red_cross (
  red_cross_id          CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  name                  VARCHAR(99)                   NOT NULL, 
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE organizer (
  organizer_id          CHAR(32) PRIMARY KEY UNIQUE   NOT NULL,
  name                  VARCHAR(99)                   NOT NULL, 
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE hospital (
  hospital_id           CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  red_cross_id          CHAR(32) UNIQUE               NOT NULL,
  name                  VARCHAR(99)                   NOT NULL, 
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL,
  FOREIGN KEY (red_cross_id) REFERENCES red_cross(red_cross_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE blood_store (
  store_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  red_cross_id          CHAR(32) UNIQUE               NOT NULL, 
  bloodType             VARCHAR(5)                    NOT NULL, 
  amount                DOUBLE PRECISION              NULL,
  FOREIGN KEY (red_cross_id) REFERENCES red_cross(red_cross_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE notification (
  notification_id       CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  red_cross_id          CHAR(32)                      NOT NULL,  
  organizer_id          CHAR(32)                      NOT NULL, 
  noti_date             DATETIME                      NULL, 
  content               VARCHAR(50)                   NULL,
  FOREIGN KEY (red_cross_id) REFERENCES red_cross(red_cross_id),
  FOREIGN KEY (organizer_id) REFERENCES organizer(organizer_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE event (
  event_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  red_cross_id          CHAR(32)                      NULL, 
  organizer_id          CHAR(32)                      NOT NULL, 
  event_date            DATETIME                      NOT NULL, 
  name                  VARCHAR(99)                   NOT NULL, 
  location              VARCHAR(99)                   NOT NULL, 
  status                VARCHAR(10)                   NOT NULL,
  FOREIGN KEY (red_cross_id) REFERENCES red_cross(red_cross_id),
  FOREIGN KEY (organizer_id) REFERENCES organizer(organizer_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE blood (
  blood_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL,
  event_id              CHAR(32)                      NOT NULL, 
  donor_id              CHAR(32)                      NOT NULL, 
  donate_date           VARCHAR(32)                   NOT NULL,
  amount                DOUBLE PRECISION              NULL, 
  status                VARCHAR(10)                   NULL,
  FOREIGN KEY (event_id) REFERENCES event(event_id), 
  FOREIGN KEY (donor_id) REFERENCES donor(donor_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;