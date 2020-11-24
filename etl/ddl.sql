drop table if exists Posts;

create table Posts (
    -- Original fields
    Id int primary key,
    PostTypeId smallint not null,
    AcceptedAnswerId int,
    ParentId int references Posts(Id) deferrable initially deferred,
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
    DownVoteCount int not null default 0,
    Domain varchar(50) not null
);

create table Users (
    Id int,
    Domain varchar(50),
    DisplayName varchar(200),
    primary key (Id, Domain)
);

create table Votes (
    Id int,
    Domain varchar(50),
    PostId int,
    VoteTypeId smallint,
    primary key (Id, Domain)
);

create index IdxParentId on Posts(ParentId);

create index IdxViewCount on Posts(PostTypeId, ViewCount);

create index IdxPostId on Votes(PostId);

create view VotesSummary as (
    select count(*) as count, PostId as id, VoteTypeId as type
    from Votes
    group by PostId, VoteTypeId
);

update Posts
set OwnerDisplayName = Users.DisplayName
from Users
where Posts.OwnerUserId = Users.Id;

update Posts
set UpVoteCount = VotesSummary.count
from VotesSummary
where Posts.Id = VotesSummary.Id
and VotesSummary.type = 2;

update Posts
set DownVoteCount = VotesSummary.count
from VotesSummary
where Posts.Id = VotesSummary.Id
and VotesSummary.type = 3;


