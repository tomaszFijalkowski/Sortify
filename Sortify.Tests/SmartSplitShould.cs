using NUnit.Framework;
using Sortify.Contracts.Enums;
using Sortify.Contracts.Models;
using Sortify.Extensions;
using System.Collections.Generic;

namespace Sortify.Tests
{
    public class SmartSplitShould
    {
        private Track[] tracks;

        [OneTimeSetUp]
        public void SetupTracks()
        {
            tracks = SmartSplitTestData.GetTestTracks();
        }

        [Test]
        [TestCaseSource(typeof(SmartSplitTestData), "AdjustConsideringAlbums_TestCases")]
        public HashSet<int> AdjustConsideringAlbums(HashSet<int> splitIndices)
        {
            splitIndices.AdjustWithSmartSplit(tracks, SmartSplitType.Albums);

            return splitIndices;
        }

        [Test]
        [TestCaseSource(typeof(SmartSplitTestData), "AdjustConsideringArtists_TestCases")]
        public HashSet<int> AdjustConsideringArtists(HashSet<int> splitIndices)
        {
            splitIndices.AdjustWithSmartSplit(tracks, SmartSplitType.Artists);

            return splitIndices;
        }

        [Test]
        [TestCaseSource(typeof(SmartSplitTestData), "FavorHigherIndexOnStart_TestCases")]
        public HashSet<int> FavorHigherIndexOnStart(HashSet<int> splitIndices, SmartSplitType type)
        {
            var tracks = SmartSplitTestData.GetFavorHigherIndexOnStartTestTracks();

            splitIndices.AdjustWithSmartSplit(tracks, type);

            return splitIndices;
        }
    }
}
