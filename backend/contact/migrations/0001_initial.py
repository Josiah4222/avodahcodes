from django.db import migrations

SCHEMA = """
CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    org TEXT NOT NULL DEFAULT '',
    project_type TEXT NOT NULL DEFAULT '',
    brief TEXT NOT NULL,
    is_handled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS inquiries_created_at ON inquiries (created_at DESC);

CREATE TABLE IF NOT EXISTS throttle_hits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS throttle_hits_ip ON throttle_hits (ip, created_at DESC);
"""


class Migration(migrations.Migration):
    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
    ]

    operations = [
        migrations.RunSQL(SCHEMA),
        migrations.RunSQL(
            """DELETE FROM throttle_hits
               WHERE created_at < datetime('now', '-2 days')"""
        ),
    ]