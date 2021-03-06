/***CREATING ALL TABLES*/
GRANT ALL PRIVILEGES ON *.* TO 'user' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' IDENTIFIED BY 'password';

create database mydb;
USE mydb;
CREATE TABLE donor (
  donor_id              CHAR(32) PRIMARY KEY UNIQUE         NOT NULL,
  name                  VARCHAR(99)                         NOT NULL,
  password              VARCHAR(100)                        NOT NULL,
  email                 VARCHAR(30)                         NOT NULL,
  address               VARCHAR(50)                         NULL,
  blood_type            VARCHAR(5)                          NULL,
  dob                   INT(11)                             NULL,

  /*ADDITIONAL DATA, ONE OF THEM NULL RESULT IN NOT BEING ABLE TO CREATE BLOOD DONATION FORM*/
  height                INT(11)                             NULL,
  weight                INT(11)                             NULL,
  gender                VARCHAR(30)                         NULL,

  tattoo_last_12_month  INT(1)                              NULL,
  cholesterol           INT(1)                              NULL,
  positive_test_HIV     INT(1)                              NULL,
  infectious_disease    INT(1)                              NULL,
  cancer                INT(1)                              NULL
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
  name                  VARCHAR(99)                   NOT NULL, 
  password              VARCHAR(100)                  NOT NULL, 
  email                 VARCHAR(30)                   NOT NULL, 
  address               VARCHAR(50)                   NULL
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE event (
  event_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL, 
  red_cross_id          CHAR(32)                      NULL, 
  organizer_id          CHAR(32)                      NOT NULL, 
  event_date            INT(11)                       NOT NULL, 
  name                  VARCHAR(99)                   NOT NULL, 
  location              VARCHAR(99)                   NOT NULL, 
  status                VARCHAR(10)                   NOT NULL,
  FOREIGN KEY (red_cross_id) REFERENCES red_cross(red_cross_id),
  FOREIGN KEY (organizer_id) REFERENCES organizer(organizer_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE blood_order (
  order_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL,
  hospital_id           CHAR(32)                      NOT NULL, 
  order_date            INT(11)                      NOT NULL,
  amount                DOUBLE PRECISION              NULL, 
  blood_type            VARCHAR(5)                    NULL, 
  status                VARCHAR(10)                   NULL,
  FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;

CREATE TABLE blood (
  blood_id              CHAR(32) PRIMARY KEY UNIQUE   NOT NULL,
  event_id              CHAR(32)                      NOT NULL, 
  donor_id              CHAR(32)                      NOT NULL, 
  order_id              CHAR(32)                      NULL,
  red_cross_id          CHAR(32)                      NULL,
  donate_date           INT(11)                   NOT NULL,
  amount                DOUBLE PRECISION              NULL, 
  status                VARCHAR(10)                   NULL,
  FOREIGN KEY (event_id) REFERENCES event(event_id), 
  FOREIGN KEY (donor_id) REFERENCES donor(donor_id),
  FOREIGN KEY (order_id) REFERENCES blood_order(order_id), 
  FOREIGN KEY (red_cross_id) REFERENCES red_cross(red_cross_id)
)
  ENGINE = INNODB
  DEFAULT CHARACTER SET = utf8;
