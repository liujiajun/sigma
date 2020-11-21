drop table if exists Posts;

create table Posts (
    -- Original fields
    Id int primary key,
    PostTypeId smallint not null,
    AcceptedAnswerId int,
    ParentId int references Posts(Id),
    CreationDate timestamp not null,
    ViewCount int,
    Body text,
    OwnerUserId int,
    OwnerDisplayName varchar(50), -- populated later
    Title varchar(300),
    Tags varchar(300),

    -- Added fields
    BodyCn text,
    TitleCn text,
    UpVoteCount int not null default 0,
    DownVoteCount int not null default 0
);
