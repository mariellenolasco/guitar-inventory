--Drops guitars table
drop table if exists guitars;

--creates guitars table
create table if not exists guitars (
    id int not null primary key generated always as identity
    , user_id varchar(50) not null
    , brand varchar(50) not null
    , model varchar(50) not null
    , year smallint null
    , color varchar(50) null
);