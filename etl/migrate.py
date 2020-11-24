import psycopg2
import xml.etree.ElementTree as ET


def connect_to_database():
    conn = psycopg2.connect(
        host='localhost',
        port=5430,
        database='sigma',
        user='postgres',
        password='postgres',
    )
    cur = conn.cursor()
    return conn, cur


def insert_posts(path, domain):
    conn, cur = connect_to_database()
    count = 0
    for event, elem in ET.iterparse(path):
        count += 1
        if count % 10000 == 0:
            print(count)

        row = elem.attrib

        if 'Id' not in row:
            continue
        if int(row['PostTypeId']) > 2:
            # Skip non QA posts
            continue

        row.setdefault('AcceptedAnswerId', None)
        row.setdefault('ParentId', None)
        row.setdefault('Body', None)
        row.setdefault('OwnerDisplayName', None)
        row.setdefault('OwnerUserId', None)
        row.setdefault('Title', None)
        row.setdefault('Tags', None)
        row.setdefault('ViewCount', None)

        row['Domain'] = domain

        cur.execute("""
        insert into Posts (
                    Id, 
                    PostTypeId,
                    AcceptedAnswerId, 
                    ParentId, 
                    CreationDate, 
                    Body, 
                    OwnerUserId, 
                    OwnerDisplayName, 
                    Title, 
                    Tags,
                    ViewCount,
                    Domain
                    ) values 
                    (%(Id)s, %(PostTypeId)s, %(AcceptedAnswerId)s, %(ParentId)s, 
                    %(CreationDate)s, %(Body)s, %(OwnerUserId)s, %(OwnerDisplayName)s, 
                    %(Title)s, %(Tags)s, %(ViewCount)s, %(Domain)s)
                    """,
                    row)
    conn.commit()
    cur.close()


def insert_users(path, domain):
    conn, cur = connect_to_database()
    count = 0
    for event, elem in ET.iterparse(path):
        count += 1
        if count % 10000 == 0:
            print(count)

        row = elem.attrib

        if 'Id' not in row:
            continue

        row.setdefault('DisplayName', None)

        row['Domain'] = domain

        cur.execute("""
        insert into Users (
                    Id, 
                    Domain,
                    DisplayName
                    ) values 
                    (%(Id)s, %(Domain)s, %(DisplayName)s)
                    """,
                    row)
    conn.commit()
    cur.close()


def insert_votes(path, domain):
    conn, cur = connect_to_database()
    count = 0
    for event, elem in ET.iterparse(path):
        count += 1
        if count % 10000 == 0:
            print(count)

        row = elem.attrib

        if 'Id' not in row:
            continue

        if row['VoteTypeId'] != '2' and row['VoteTypeId'] != '3':
            continue

        row['Domain'] = domain

        cur.execute("""
        insert into Votes (
                    Id, 
                    Domain,
                    VoteTypeId,
                    PostId
                    ) values 
                    (%(Id)s, %(Domain)s, %(VoteTypeId)s, %(PostId)s)
                    """,
                    row)
    conn.commit()
    cur.close()


def update_users(path):
    conn, cur = connect_to_database()
    count = 0
    for event, elem in ET.iterparse(path):
        count += 1
        print(count)
        if count % 1000 == 0:
            print(count)
        row = elem.attrib

        if 'Id' not in row:
            continue

        cur.execute("""
                    update Posts 
                    set OwnerDisplayName = %(DisplayName)s
                    where OwnerUserId = %(Id)s
                    """,
                    row)
    conn.commit()
    cur.close()


def update_votes(path):
    conn, cur = connect_to_database()
    for event, elem in ET.iterparse(path):
        row = elem.attrib

        if 'Id' not in row:
            continue

        if row['VoteTypeId'] == '2':
            up, down = 1, 0
        elif row['VoteTypeId'] == '3':
            up, down = 0, 1
        else:
            continue

        cur.execute("""
                    update Posts 
                    set UpVoteCount = UpVoteCount + %s,
                        DownVoteCount = DownVoteCount + %s
                    where Id = %s
                    """,
                    (up, down, row['PostId']))

    conn.commit()
    cur.close()

if __name__ == '__main__':
    # base_path = 'resources/ebooks.meta.stackexchange.com'
    base_path = '/Users/wuchu/Downloads/math.stackexchange.com'
    domain = 'math.stackexchange.com'

    #insert_posts(base_path + '/Posts.xml', 'math.stackexchange.com')
    #print('Posts inserted')

    # insert_users(base_path + '/Users.xml', domain)
    # print('Users inserted')

    insert_votes(base_path + '/Votes.xml', domain)
    print('Votes inserted')
