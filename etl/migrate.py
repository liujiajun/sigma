import psycopg2
import xml.etree.ElementTree as ET


def connect_to_database():
    conn = psycopg2.connect(
        host='localhost',
        database='postgres',
        user='postgres',
        password='postgres'
    )
    cur = conn.cursor()
    return conn, cur


def insert_posts(path):
    conn, cur = connect_to_database()
    for event, elem in ET.iterparse(path):
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
                    ViewCount
                    ) values 
                    (%(Id)s, %(PostTypeId)s, %(AcceptedAnswerId)s, %(ParentId)s, 
                    %(CreationDate)s, %(Body)s, %(OwnerUserId)s, %(OwnerDisplayName)s, 
                    %(Title)s, %(Tags)s, %(ViewCount)s)
                    """,
                    row)
    conn.commit()
    cur.close()


def update_users(path):
    conn, cur = connect_to_database()
    for event, elem in ET.iterparse(path):
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
    cur = connect_to_database()
    insert_posts('resources/ebooks.meta.stackexchange.com/Posts.xml')
    print('1')
    update_users('resources/ebooks.meta.stackexchange.com/Users.xml')
    print('2')
    update_votes('resources/ebooks.meta.stackexchange.com/Votes.xml')
    print('3')
