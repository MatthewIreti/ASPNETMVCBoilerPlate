using AutoMapper;
using BoilerPlate.Core.Models;
using BoilerPlate.Data.Entities;

namespace BoilerPlate
{
    public class AutoMapperConfig
    {
        public static void Map()
        {
            Mapper.Initialize(cfg =>
            {
                UserProfileMap(cfg);
            });
        }

        public static void UserProfileMap(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<UserProfile, UserProfileModel>();
            cfg.CreateMap<UserProfileModel, UserProfile>();
        }
    }
}