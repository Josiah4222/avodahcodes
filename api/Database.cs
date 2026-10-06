using Microsoft.Data.Sqlite;

namespace Api;

public sealed class Database
{
    private readonly string _connectionString;

    public Database(ContactOptions options, string contentRoot)
    {
        var dbPath = options.DbPath;

        if (!Path.IsPathRooted(dbPath))
        {
            dbPath = Path.Combine(contentRoot, dbPath);
        }

        var directory = Path.GetDirectoryName(dbPath);

        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }

        _connectionString = new SqliteConnectionStringBuilder
        {
            DataSource = dbPath,
            Mode = SqliteOpenMode.ReadWriteCreate,
            Cache = SqliteCacheMode.Shared,
        }.ToString();

        using var connection = Open();
        Migrate(connection);
    }

    public SqliteConnection Open()
    {
        var connection = new SqliteConnection(_connectionString);
        connection.Open();
        return connection;
    }

    public string ClientIp(HttpContext context)
    {
        var ip = context.Connection.RemoteIpAddress;

        return ip is null ? "unknown" : ip.ToString();
    }

    private static void Migrate(SqliteConnection connection)
    {
        Execute(connection, """
            CREATE TABLE IF NOT EXISTS inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                org TEXT NOT NULL DEFAULT "",
                project_type TEXT NOT NULL DEFAULT "",
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
            """);

        Execute(connection, """DELETE FROM throttle_hits WHERE created_at < datetime("now", "-2 days")""");
    }

    private static void Execute(SqliteConnection connection, string sql)
    {
        using var command = connection.CreateCommand();
        command.CommandText = sql;

        command.ExecuteNonQuery();
    }
}