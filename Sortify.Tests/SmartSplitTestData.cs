using NUnit.Framework;
using Sortify.Contracts.Enums;
using Sortify.Contracts.Models;
using System.Collections.Generic;
using System.Linq;

namespace Sortify.Tests
{
    public class SmartSplitTestData
    {
        public static Track[] GetTestTracks()
        {
            return new Track[] {
                new Track() { ArtistId = "A", AlbumId = "A" },
                new Track() { ArtistId = "A", AlbumId = "A" },
                new Track() { ArtistId = "A", AlbumId = "B" },
                new Track() { ArtistId = "A", AlbumId = "B" },
                new Track() { ArtistId = "B", AlbumId = "C" },
                new Track() { ArtistId = "B", AlbumId = "C" },
                new Track() { ArtistId = "B", AlbumId = "C" },
                new Track() { ArtistId = "B", AlbumId = "D" },
                new Track() { ArtistId = "B", AlbumId = "D" },
                new Track() { ArtistId = "C", AlbumId = "D" },
                new Track() { ArtistId = "C", AlbumId = "E" },
                new Track() { ArtistId = "C", AlbumId = "E" },
                new Track() { ArtistId = "C", AlbumId = "E" },
                new Track() { ArtistId = "C", AlbumId = "E" },
                new Track() { ArtistId = "C", AlbumId = "F" },
                new Track() { ArtistId = "C", AlbumId = "G" },
                new Track() { ArtistId = "C", AlbumId = "G" },
                new Track() { ArtistId = "D", AlbumId = "H" },
                new Track() { ArtistId = "D", AlbumId = "H" },
                new Track() { ArtistId = "D", AlbumId = "I" }
            };
        }

        public static Track[] GetFavorHigherIndexOnStartTestTracks()
        {
            return new Track[] {
                new Track() { ArtistId = "A", AlbumId = "A" },
                new Track() { ArtistId = "A", AlbumId = "A" },
                new Track() { ArtistId = "A", AlbumId = "A" },
                new Track() { ArtistId = "B", AlbumId = "B" },
                new Track() { ArtistId = "C", AlbumId = "C" },
                new Track() { ArtistId = "C", AlbumId = "C" },
                new Track() { ArtistId = "D", AlbumId = "D" },
                new Track() { ArtistId = "D", AlbumId = "D" },
                new Track() { ArtistId = "E", AlbumId = "E" },
                new Track() { ArtistId = "E", AlbumId = "E" }
            };
        }

        public static IEnumerable<TestCaseData> AdjustConsideringAlbums_TestCases
        {
            get
            {
                yield return new TestCaseData(new HashSet<int> { 20 }).Returns(new HashSet<int> { 20 });
                yield return new TestCaseData(new HashSet<int> { 10, 20 }).Returns(new HashSet<int> { 10, 20 });
                yield return new TestCaseData(new HashSet<int> { 7, 14, 20 }).Returns(new HashSet<int> { 7, 14, 20 });
                yield return new TestCaseData(new HashSet<int> { 5, 10, 15, 20 }).Returns(new HashSet<int> { 4, 10, 15, 20 });
                yield return new TestCaseData(new HashSet<int> { 4, 8, 12, 16, 20 }).Returns(new HashSet<int> { 4, 7, 10, 15, 20 });
                yield return new TestCaseData(new HashSet<int> { 4, 8, 11, 14, 17, 20 }).Returns(new HashSet<int> { 4, 7, 10, 14, 17, 20 });
                yield return new TestCaseData(Enumerable.Range(1, 10).Select(x => x * 2).ToHashSet()).Returns(new HashSet<int> { 2, 4, 7, 10, 14, 15, 17, 19, 20 });
                yield return new TestCaseData(Enumerable.Range(1, 20).ToHashSet()).Returns(new HashSet<int> { 2, 4, 7, 10, 14, 15, 17, 19, 20 });
            }
        }

        public static IEnumerable<TestCaseData> AdjustConsideringArtists_TestCases
        {
            get
            {
                yield return new TestCaseData(new HashSet<int> { 20 }).Returns(new HashSet<int> { 20 });
                yield return new TestCaseData(new HashSet<int> { 10, 20 }).Returns(new HashSet<int> { 9, 20 });
                yield return new TestCaseData(new HashSet<int> { 7, 14, 20 }).Returns(new HashSet<int> { 9, 17, 20 });
                yield return new TestCaseData(new HashSet<int> { 5, 10, 15, 20 }).Returns(new HashSet<int> { 4, 9, 17, 20 });
                yield return new TestCaseData(new HashSet<int> { 4, 8, 12, 16, 20 }).Returns(new HashSet<int> { 4, 9, 17, 20 });
                yield return new TestCaseData(new HashSet<int> { 4, 8, 11, 14, 17, 20 }).Returns(new HashSet<int> { 4, 9, 17, 20 });
                yield return new TestCaseData(Enumerable.Range(1, 10).Select(x => x * 2).ToHashSet()).Returns(new HashSet<int> { 4, 9, 17, 20 });
                yield return new TestCaseData(Enumerable.Range(1, 20).ToHashSet()).Returns(new HashSet<int> { 4, 9, 17, 20 });
            }
        }

        public static IEnumerable<TestCaseData> FavorHigherIndexOnStart_TestCases
        {
            get
            {
                yield return new TestCaseData(new HashSet<int> { 5, 10 }, SmartSplitType.Albums).Returns(new HashSet<int> { 6, 10 });
                yield return new TestCaseData(new HashSet<int> { 4, 7, 10 }, SmartSplitType.Artists).Returns(new HashSet<int> { 4, 8, 10 });
                yield return new TestCaseData(new HashSet<int> { 3, 6, 8, 10 }, SmartSplitType.Albums).Returns(new HashSet<int> { 3, 6, 8, 10 });
                yield return new TestCaseData(new HashSet<int> { 2, 4, 6, 8, 10 }, SmartSplitType.Artists).Returns(new HashSet<int> { 3, 4, 6, 8, 10 });
            }
        }
    }
}
