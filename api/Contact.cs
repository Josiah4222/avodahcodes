using System.Net.Mail;
using System.Text;
using System.Text.Json;
using Microsoft.Data.Sqlite;

namespace Api;

public static class ProjectTypes
{
    public static readonly IReadOnlyDictionary<string, string> Labels = new Dictionary<string, string>
    {
        ["website"] = "Website",
        ["business_system"] = "Business System",
        ["product"] = "Product",
        ["not_sure"] = "Not sure yet",
    };

    public static string Label(string value) => Labels.TryGetValue(value, out var label) ? label : "-";
}

public sealed record ContactResult(int Status, object Payload);

public static class Contact
{
    public static async Task<ContactResult> Post(ContactOptions options, Database database, HttpContext context)
    {
        var ip = database.ClientIp(context);

        if (ThrottleExceeded(database, ip, options.ThrottlePerHour))
        {
            return new ContactResult(429, new { detail = "Request was throttled." });
        }

        string raw;

        using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8))
        {
            raw = await reader.ReadToEndAsync();
        }

        JsonElement payload;

        try
        {
            using var document = JsonDocument.Parse(raw);

            if (document.RootElement.ValueKind != JsonValueKind.Object)
            {
                return new ContactResult(400, new { detail = "Malformed JSON body." });
            }

            payload = document.RootElement.Clone();
        }
        catch (JsonException)
        {
            return new ContactResult(400, new { detail = "Malformed JSON body." });
        }

        var honeypot = Text(payload, options.HoneypotField).Trim();

        if (honeypot.Length > 0)
        {
            return Accepted();
        }

        var renderedAt = Number(payload, "rendered_at");
        var elapsed = DateTimeOffset.UtcNow.ToUnixTimeSeconds() - renderedAt;

        if (renderedAt > 0 && elapsed >= 0 && elapsed < options.MinSecondsOnForm)
        {
            return Accepted();
        }

        var name = Text(payload, "name").Trim();
        var email = Text(payload, "email").Trim();
        var org = Text(payload, "org").Trim();
        var projectType = Text(payload, "project_type").Trim();
        var brief = Text(payload, "brief").Trim();

        var errors = new Dictionary<string, string[]>();

        if (name.Length == 0)
        {
            errors["name"] = ["This field is required."];
        }
        else if (Length(name) < 2)
        {
            errors["name"] = ["Please enter your name."];
        }
        else if (Length(name) > 120)
        {
            errors["name"] = ["Ensure this field has no more than 120 characters."];
        }

        if (email.Length == 0)
        {
            errors["email"] = ["This field is required."];
        }
        else if (Length(email) > 254 || !IsEmail(email))
        {
            errors["email"] = ["Enter a valid email address."];
        }

        if (Length(org) > 160)
        {
            errors["org"] = ["Ensure this field has no more than 160 characters."];
        }

        if (projectType.Length > 0 && !ProjectTypes.Labels.ContainsKey(projectType))
        {
            errors["project_type"] = ["Select a valid project type."];
        }

        if (brief.Length == 0)
        {
            errors["brief"] = ["This field is required."];
        }
        else if (Length(brief) < 10)
        {
            errors["brief"] = ["Please tell us a little more about the project."];
        }
        else if (Length(brief) > 5000)
        {
            errors["brief"] = ["Ensure this field has no more than 5000 characters."];
        }

        if (errors.Count > 0)
        {
            return new ContactResult(400, errors);
        }

        long id;

        using (var connection = database.Open())
        using (var command = connection.CreateCommand())
        {
            command.CommandText = """
                INSERT INTO inquiries (name, email, org, project_type, brief)
                VALUES ($name, $email, $org, $projectType, $brief);
                SELECT last_insert_rowid();
                """;

            command.Parameters.AddWithValue("$name", name);
            command.Parameters.AddWithValue("$email", email);
            command.Parameters.AddWithValue("$org", org);
            command.Parameters.AddWithValue("$projectType", projectType);
            command.Parameters.AddWithValue("$brief", brief);

            id = Convert.ToInt64(command.ExecuteScalar());
        }

        Notify(options, new Inquiry(id, name, email, org, projectType, brief), context);

        return new ContactResult(201, new { id, detail = "Message received." });
    }

    private static ContactResult Accepted() => new(201, new { id = 0, detail = "Message received." });

    private static bool ThrottleExceeded(Database database, string ip, int limit)
    {
        using var connection = database.Open();

        using (var insert = connection.CreateCommand())
        {
            insert.CommandText = "INSERT INTO throttle_hits (ip) VALUES ($ip)";
            insert.Parameters.AddWithValue("$ip", ip);
            insert.ExecuteNonQuery();
        }

        using var count = connection.CreateCommand();
        count.CommandText = """
            SELECT COUNT(*) FROM throttle_hits WHERE ip = $ip AND created_at >= datetime("now", "-1 hour")
            """;
        count.Parameters.AddWithValue("$ip", ip);

        return Convert.ToInt64(count.ExecuteScalar()) > limit;
    }

    private static void Notify(ContactOptions options, Inquiry inquiry, HttpContext context)
    {
        var recipient = options.NotifyEmail;

        if (recipient.Length == 0)
        {
            return;
        }

        if (recipient.Contains('\r') || recipient.Contains('\n'))
        {
            return;
        }

        try
        {
            var body = string.Join("\n",
                "Name: " + inquiry.Name,
                "Email: " + inquiry.Email,
                "Organisation: " + (inquiry.Org.Length > 0 ? inquiry.Org : "-"),
                "Looking to build: " + ProjectTypes.Label(inquiry.ProjectType),
                "",
                "Brief:",
                inquiry.Brief);

            using var message = new MailMessage
            {
                From = new MailAddress("Avodah Studio <" + SenderAddress(options, context) + ">"),
                Subject = options.NotifySubject,
                Body = body,
                IsBodyHtml = false,
                BodyEncoding = Encoding.UTF8,
            };

            message.To.Add(recipient);

            using var client = new SmtpClient();
            client.Send(message);
        }
        catch (Exception exception)
        {
            var logger = context.RequestServices.GetRequiredService<ILoggerFactory>()
                .CreateLogger("Api.Contact.Notify");

            logger.LogWarning(exception, "Could not send the inquiry notification email.");
        }
    }

    private static string SenderAddress(ContactOptions options, HttpContext context)
    {
        var configured = options.NotifyFromEmail;

        if (configured.Length > 0 && IsEmail(configured))
        {
            return configured;
        }

        var host = context.Request.Host.Host;
        var trimmed = host.StartsWith("www.", StringComparison.OrdinalIgnoreCase) ? host[4..] : host;

        return trimmed.Contains('.') ? "no-reply@" + trimmed : "no-reply@localhost";
    }

    private static bool IsEmail(string value)
    {
        var trimmed = value.Trim();

        if (trimmed.Length == 0 || trimmed.Any(char.IsWhiteSpace))
        {
            return false;
        }

        return MailAddress.TryCreate(trimmed, out var address)
            && address.Address == trimmed
            && trimmed.Count(character => character == '@') == 1;
    }

    private static string Text(JsonElement payload, string name)
    {
        if (!payload.TryGetProperty(name, out var value))
        {
            return "";
        }

        return value.ValueKind switch
        {
            JsonValueKind.String => value.GetString() ?? "",
            JsonValueKind.Number or JsonValueKind.True or JsonValueKind.False => value.ToString(),
            _ => "",
        };
    }

    private static long Number(JsonElement payload, string name)
    {
        if (!payload.TryGetProperty(name, out var value))
        {
            return 0;
        }

        if (value.ValueKind == JsonValueKind.Number && value.TryGetInt64(out var number))
        {
            return number;
        }

        if (value.ValueKind == JsonValueKind.String && long.TryParse(value.GetString(), out var parsed))
        {
            return parsed;
        }

        return 0;
    }

    private static int Length(string value)
    {
        var count = 0;

        foreach (var _ in value.EnumerateRunes())
        {
            count++;
        }

        return count;
    }
}

public sealed record Inquiry(long Id, string Name, string Email, string Org, string ProjectType, string Brief);