﻿using AutoMapper;
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
                    dest => dest.Owner,
                    opt => opt.MapFrom(src => src.Owner.DisplayName))
                .ForMember(
                    dest => dest.Size,
                    opt => opt.MapFrom(src => src.Tracks.Total))
                .ForMember(
                    dest => dest.Image,
                    opt => opt.MapFrom(src => src.Images.FirstOrDefault()));

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

            CreateMap<PrivateUser, UserDetails>();
        }
    }
}
