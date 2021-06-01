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
