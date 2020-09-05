using AutoMapper;
using Sortify.Contracts.Responses;
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
                    dest => dest.Owner,
                    opt => opt.MapFrom(src => src.Owner.DisplayName))
                .ForMember(
                    dest => dest.Size,
                    opt => opt.MapFrom(src => src.Tracks.Total))
                .ForMember(
                    dest => dest.Image,
                    opt => opt.MapFrom(src => src.Images.FirstOrDefault()));
        }
    }
}
