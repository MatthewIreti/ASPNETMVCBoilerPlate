using System;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http; 
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using BoilerPlate.Core;
using BoilerPlate.Core.Models;
using BoilerPlate.Providers;
using BoilerPlate.Repository.Repositories;
using BoilerPlate.Service.Services;
using Library.AutoFac;
using Library.Repository.Pattern.DataContext;
using Library.Repository.Pattern.EntityFramework;
using Library.Repository.Pattern.Repositories;
using Library.Repository.Pattern.UnitOfWork;
using Newtonsoft.Json;
using BoilerContext = BoilerPlate.Models.BoilerContext;

namespace BoilerPlate
{
    public class AutoFacConfig
    {
        public static void Register()
        {
            var builder = new ContainerBuilder();

            var config = GlobalConfiguration.Configuration;
            builder.RegisterControllers(Assembly.GetExecutingAssembly()); //Register MVC Controllers
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly()); //Register WebApi Controllers
            builder.RegisterHttpRequestMessage(GlobalConfiguration.Configuration);

            RegisterEntityFramworkInstance(builder);

            builder.RegisterAssemblyTypes(typeof(UserProfileService).Assembly)
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.Register(c =>
            {
                var response = InWebRequest.GetResponse("/api/UserProfile/GetCurrentUserInfo");
                var currentUser = JsonConvert.DeserializeObject<UserProfileItem>(response);

                return new UserProfileCookieInfo()
                {
                    Email = currentUser.EmailAddress,
                    UserName = currentUser.Username,
                    Id = currentUser.Id,
                    Role = currentUser.RoleName,
                    RoleId = currentUser.RoleId
                };
            }).As<UserProfileCookieInfo>();
            builder.Register(c =>
            {
                var personalInfoRepository = EngineContext.Resolve<IUserProfileRepository>();
                if (!String.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
                {
                    var currentUser = personalInfoRepository.Table.Single(x => x.Username == HttpContext.Current.User.Identity.Name);

                    return new UserProfileInfo()
                    {
                        Email = currentUser.EmailAddress,
                        UserName = currentUser.Username,
                        Id = currentUser.Id,
                        Role = RolesConstants.RoleNamesFromIdDictionary[currentUser.RoleId],
                        RoleId = currentUser.RoleId
                    };
                }
                return new UserProfileInfo();

            }).As<UserProfileInfo>();
            var container = builder.Build();

            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
        private static void RegisterEntityFramworkInstance(ContainerBuilder builder)
        {
            builder.RegisterType<BoilerContext>().As<IDataContextAsync>().InstancePerRequest();
            builder.RegisterType<EntityFrameorkUnitOfWork>().As<IUnitOfWorkAsync>().InstancePerRequest();
            builder.RegisterGeneric(typeof(Repository<>))
                .As(typeof(IRepositoryAsync<>)).InstancePerRequest();
            builder.RegisterGeneric(typeof(Repository<>))
               .As(typeof(IRepository<>)).InstancePerRequest();

            builder.RegisterAssemblyTypes(typeof(UserProfileRepository).Assembly)
                .Where(t => t.Namespace != null && t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces().InstancePerLifetimeScope();

        }
    }


}