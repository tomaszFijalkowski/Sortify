using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sortify.Extensions
{
    public static class NumeralExtensions
    {
        public static string ToPaddedArabic(this int number, int playlistCount)
        {
            var padding = Math.Max(2, playlistCount.ToString().Length);
            return number.ToString("D" + padding);
        }

        public static string ToRomanNumeral(this int number, bool toUpperCase = false)
        {
            var romanNumeral = new StringBuilder(5);
            var valueMap = new SortedDictionary<int, string>
                               {
                                   { 1, "I" },
                                   { 4, "IV" },
                                   { 5, "V" },
                                   { 9, "IX" },
                                   { 10, "X" },
                                   { 40, "XL" },
                                   { 50, "L" },
                                   { 90, "XC" },
                                   { 100, "C" },
                                   { 400, "CD" },
                                   { 500, "D" },
                                   { 900, "CM" },
                                   { 1000, "M" },
                               };

            foreach (var keyValuePair in valueMap.Reverse())
            {
                while (number >= keyValuePair.Key)
                {
                    number -= keyValuePair.Key;
                    romanNumeral.Append(keyValuePair.Value);
                }
            }

            return toUpperCase ? romanNumeral.ToString() : romanNumeral.ToString().ToLower();
        }

        public static string ToAlphabetNumeral(this int number, bool toUpperCase = false)
        {
            string alphabetNumeral = "";
            char c = toUpperCase ? 'A' : 'a';
            while (--number >= 0)
            {
                alphabetNumeral = (char)(c + number % 26) + alphabetNumeral;
                number /= 26;
            }

            return alphabetNumeral;
        }
    }
}
