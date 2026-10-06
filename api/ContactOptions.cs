namespace Api;

public sealed class ContactOptions
{
    public string DbPath { get; set; } = Path.Combine("data", "inquiries.sqlite");

    public string[] CorsOrigins { get; set; } = ["http://localhost:4200"];

    public int ThrottlePerHour { get; set; } = 30;

    public string NotifyEmail { get; set; } = "";

    public string NotifySubject { get; set; } = "New inquiry from avodah.studio";

    public string NotifyFromEmail { get; set; } = "";

    public string HoneypotField { get; set; } = "company_website";

    public int MinSecondsOnForm { get; set; } = 2;

    public static ContactOptions FromConfiguration(IConfiguration configuration)
    {
        return new ContactOptions
        {
            DbPath = Value(configuration, "CONTACT_DB_PATH", Path.Combine("data", "inquiries.sqlite")),
            CorsOrigins = Value(configuration, "CONTACT_CORS_ORIGINS", "http://localhost:4200")
                .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries),
            ThrottlePerHour = Integer(configuration, "CONTACT_THROTTLE_PER_HOUR", 30),
            NotifyEmail = Value(configuration, "CONTACT_NOTIFY_EMAIL", ""),
            NotifySubject = Value(configuration, "CONTACT_NOTIFY_SUBJECT", "New inquiry from avodah.studio"),
            NotifyFromEmail = Value(configuration, "CONTACT_NOTIFY_FROM", ""),
            HoneypotField = "company_website",
            MinSecondsOnForm = Integer(configuration, "CONTACT_MIN_FORM_SECONDS", 2),
        };
    }

    private static string Value(IConfiguration configuration, string key, string fallback)
    {
        var value = configuration[key];

        return string.IsNullOrEmpty(value) ? fallback : value;
    }

    private static int Integer(IConfiguration configuration, string key, int fallback)
    {
        var value = configuration[key];

        return int.TryParse(value, out var parsed) ? parsed : fallback;
    }
}