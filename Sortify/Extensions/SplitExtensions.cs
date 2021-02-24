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

        public static void AdjustWithSmartSplit(this HashSet<int> splitIndices, IEnumerable<Track> tracks, SmartSplitType type)
        {
            var availableSplitIndices = GetAvailableSplitIndices(tracks.ToArray(), type);
            var tempSplitIndices = new HashSet<int>(splitIndices);
            var favorLowerIndex = false;

            splitIndices.Clear();

            foreach (var index in tempSplitIndices)
            {
                if (availableSplitIndices.Contains(index) == false || splitIndices.Contains(index))
                {
                    var lowerIndex = availableSplitIndices.OrderBy(x => Math.Abs(x - index))
                                                          .Where(x => x < index && !splitIndices.Contains(x))
                                                          .FirstOrDefault();

                    var higherIndex = availableSplitIndices.OrderBy(x => Math.Abs(x - index))
                                                           .Where(x => x > index && !splitIndices.Contains(x))
                                                           .FirstOrDefault();

                    var chooseLowerIndex = (index - lowerIndex < higherIndex - index) || (index - lowerIndex == higherIndex - index && favorLowerIndex);

                    if (chooseLowerIndex && lowerIndex > 0)
                    {
                        splitIndices.Add(lowerIndex);
                        favorLowerIndex = true;
                    }
                    else if (higherIndex > 0)
                    {
                        splitIndices.Add(higherIndex);
                        favorLowerIndex = false;
                    }
                }
                else
                {
                    splitIndices.Add(index);
                }
            }
        }

        private static HashSet<int> GetAvailableSplitIndices(Track[] tracks, SmartSplitType type)
        {
            var tracksLength = tracks.Count();
            var availableSplitIndices = new HashSet<int>();

            for (int i = 1; i < tracksLength; i++)
            {
                var currentValue = type == SmartSplitType.Albums ? tracks[i].AlbumId : tracks[i].ArtistId;
                var previousValue = type == SmartSplitType.Albums ? tracks[i - 1].AlbumId : tracks[i - 1].ArtistId;

                if (currentValue != previousValue)
                {
                    availableSplitIndices.Add(i);
                }
            }
            availableSplitIndices.Add(tracksLength);

            return availableSplitIndices;
        }
    }
}
