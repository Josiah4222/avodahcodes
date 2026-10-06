using Api;

var builder = WebApplication.CreateBuilder(args);

var options = ContactOptions.FromConfiguration(builder.Configuration);
builder.Services.AddSingleton(options);

builder.Services.AddSingleton(provider =>
    new Database(options, provider.GetRequiredService<IWebHostEnvironment>().ContentRootPath));

builder.Services.AddProblemDetails();

var app = builder.Build();

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["Referrer-Policy"] = "same-origin";
    await next();
});

app.UseCorsPolicy(app.Environment, options);
app.UseOptionsHandler();

app.MapGet("/", () => Results.Json(new
{
    service = "Avodah Studio contact API",
    endpoints = new[] { "POST /api/contact/", "GET /api/health/" },
}));

app.MapGet("/api", () => Results.Json(new
{
    service = "Avodah Studio contact API",
    endpoints = new[] { "POST /api/contact/", "GET /api/health/" },
}));

app.MapPost("/api/contact/", HandleContact);
app.MapPost("/contact", HandleContact);

app.MapGet("/api/health/", HandleHealth);
app.MapGet("/health", HandleHealth);

app.Run();

static IResult HandleHealth(Database database)
{
    using var connection = database.Open();
    using var command = connection.CreateCommand();
    command.CommandText = "SELECT 1";
    command.ExecuteScalar();

    return Results.Json(new { status = "ok" });
}

static async Task<IResult> HandleContact(ContactOptions options, Database database, HttpContext context)
{
    var result = await Contact.Post(options, database, context);

    if (result.Status == 201)
    {
        return Results.Json(result.Payload, statusCode: StatusCodes.Status201Created);
    }

    return Results.Json(result.Payload, statusCode: result.Status);
}

public static class HttpExtensions
{
    public static IApplicationBuilder UseCorsPolicy(this IApplicationBuilder app, IWebHostEnvironment environment, ContactOptions options)
    {
        return app.Use(async (context, next) =>
        {
            var origin = context.Request.Headers.Origin.ToString();
            var allowed = environment.IsDevelopment() || options.CorsOrigins.Contains(origin, StringComparer.Ordinal);

            if (allowed && origin.Length > 0)
            {
                context.Response.Headers["Access-Control-Allow-Origin"] = origin;
                context.Response.Headers.Vary = "Origin";
                context.Response.Headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
                context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type";
                context.Response.Headers["Access-Control-Max-Age"] = "86400";
            }

            await next();
        });
    }

    public static IApplicationBuilder UseOptionsHandler(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            if (HttpMethods.IsOptions(context.Request.Method))
            {
                context.Response.StatusCode = StatusCodes.Status204NoContent;
                return;
            }

            await next();
        });
    }
}