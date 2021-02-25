using AutoMapper;
using Sortify.Contracts.Models;
using SpotifyAPI.Web;
using System.Linq;

namespace Sortify
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<SimplePlaylist, Playlist>()
                .ForMember(
                    dest => dest.OwnerId,
                    opt => opt.MapFrom(src => src.Owner.Id))
                .ForMember(
                    dest => dest.OwnerName,
                    opt => opt.MapFrom(src => src.Owner.DisplayName))
                .ForMember(
                    dest => dest.Size,
                    opt => opt.MapFrom(src => src.Tracks.Total))
                .ForMember(
                    dest => dest.Image,
                    opt => opt.MapFrom((src, dest) =>
                    {
                        var selectedImage = src.Images.OrderBy(x => x.Width * x.Height)
                                                     .Where(x => x.Width >= 100 && x.Height >= 100)
                                                     .FirstOrDefault();

                        return selectedImage ?? src.Images.FirstOrDefault();
                    }));

            CreateMap<FullTrack, Track>()
                .ForMember(
                    dest => dest.ArtistId,
                    opt => opt.MapFrom(src => src.Artists.FirstOrDefault().Id))
                .ForMember(
                    dest => dest.ArtistName,
                    opt => opt.MapFrom(src => src.Artists.FirstOrDefault().Name))
                .ForMember(
                    dest => dest.AlbumId,
                    opt => opt.MapFrom(src => src.Album.Id))
                .ForMember(
                    dest => dest.AlbumName,
                    opt => opt.MapFrom(src => src.Album.Name))
                .ForMember(
                    dest => dest.AlbumReleaseDate,
                    opt => opt.MapFrom(src => src.Album.ReleaseDate))
                .ForMember(
                    dest => dest.AlbumName,
                    opt => opt.MapFrom(src => src.Album.Name))
                .ForMember(
                    dest => dest.Duration,
                    opt => opt.MapFrom(src => src.DurationMs))
                .ForMember(
                    dest => dest.AudioFeatures,
                    opt => opt = null);

            CreateMap<TrackAudioFeatures, AudioFeatures>();

            CreateMap<PrivateUser, UserDetails>()
                .ForMember(
                    dest => dest.Image,
                    opt => opt.MapFrom(src => src.Images.FirstOrDefault()));
        }
    }
}
