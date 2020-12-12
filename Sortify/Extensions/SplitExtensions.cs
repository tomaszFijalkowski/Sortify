using Sortify.Contracts.Enums;
using Sortify.Contracts.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sortify.Extensions
{
    public static class SplitExtensions
    {
        public static HashSet<int> GetSplitIndicesByTracks(this IEnumerable<Track> enumerable, int n)
        {
            var count = enumerable.Count();
            var splitIndices = new HashSet<int>();

            for (int i = n; i < count; i += n)
            {
                splitIndices.Add(i);
            }

            splitIndices.Add(count);

            return splitIndices;
        }

        public static HashSet<int> GetSplitIndicesByPlaylists(this IEnumerable<Track> enumerable, int n)
        {
            var index = 0;
            var count = enumerable.Count();
            var splitIndices = new HashSet<int>(0);

            foreach (var split in DivideEvenly(count, n))
            {
                splitIndices.Add(index += split);
            }

            return splitIndices;
        }

        private static IEnumerable<int> DivideEvenly(int nominator, int denominator)
        {
            int div = Math.DivRem(nominator, denominator, out int rem);

            for (int i = 0; i < denominator; i++)
            {
                yield return i < rem ? div + 1 : div;
            }
        }
    }
}
