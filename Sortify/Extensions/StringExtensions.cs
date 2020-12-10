using System;

namespace Sortify.Extensions
{
    public static class StringExtensions
    {
        public static string TrimNumeral(this string name, string numeral)
        {
            const int MaxNameLength = 100;

            return name.Substring(0, Math.Min(MaxNameLength - numeral.Length, name.Length));
        }
    }
}
