drop table if exists users;

create table users
(
    ID        int auto_increment,
    email     varchar(255) not null,
    password  varchar(64)  not null,
    firstName varchar(255) null,
    lastName  varchar(255) null,
    dob       date         null,
    address   varchar(255) null,
    constraint users_pk
        primary key (ID)
);

create unique index users_email_unique_index
    on users (email);

INSERT INTO users (ID, email, password, firstName, lastName, dob, address)
VALUES (1, 'mike@gmail.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'Michael', 'Jordan',
        '1963-02-17', '123 Fake Street, Springfield');
INSERT INTO users (ID, email, password, firstName, lastName, dob, address)
VALUES (2, 'test@test.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'Test firstname',
        'Test lastname',
        '2021-05-14', 'test address');