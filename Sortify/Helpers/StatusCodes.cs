namespace Sortify.Helpers
{
    public static class StatusCodes
    {
        public static int Ok { get => 200; }

        public static int BadRequest { get => 400; }

        public static int Unauthorized { get => 401; }

        public static int InternalServerError { get => 500; }
    }
}
