using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Autofac;
using BoilerPlate.Core;
using BoilerPlate.Core.Models;
using BoilerPlate.Service.Services;
using Library.AutoFac;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;

namespace BoilerPlate.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType = "Bearer")
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }
        static ApplicationDbContext()
        {
            // Set the database intializer which is run once during application start
            // This seeds the database with admin user credentials and admin role
            Database.SetInitializer(new ApplicationDbInitializer());
        }
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }

    public class ApplicationDbInitializer : DropCreateDatabaseIfModelChanges<ApplicationDbContext>
    {

        protected override void Seed(ApplicationDbContext context)
        {
            InitializeIdentityForEf(context);
            base.Seed(context);
        }

        public class DefaultLogin
        {
            public string RoleName { get; set; }
            public string Password { get; set; }
            public string LastName { get; set; }
            public string FirstName { get; set; }
            public string EmailAddress { get; set; }
            public string UserName { get; set; }
            public string PhoneNumber { get; set; }
        }

        public static void InitializeIdentityForEf(ApplicationDbContext db)
        {
            var userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var roleManager = HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();
            SetupHelper.SetupRoles(roleManager);
            CrateStartupAdminUsers(userManager);
            //make sure you check the default connection database pointer
        }

        private static void CrateStartupAdminUsers(ApplicationUserManager userManager)
        {
            var logins = new List<DefaultLogin>()
            {
                new DefaultLogin
                { 
                    Password = "password1",
                    RoleName = "SuperAdmin",
                    FirstName = "Super",
                    LastName = "Admin",
                    EmailAddress = "superadmin@abc.com",
                    UserName = "superadmin"
                },
            };
            logins.ForEach(login =>
            {
                if (!userManager.Users.Any(u => u.UserName == login.UserName))
                {
                    var user = new ApplicationUser
                    {
                        UserName = login.UserName,
                        Email = login.EmailAddress,
                        TwoFactorEnabled = true,
                        EmailConfirmed = true//bypassing the email confirmation----take note
                    };
                    userManager.Create(user, login.Password);
                    userManager.SetLockoutEnabled(user.Id, false);

                    if (!userManager.IsInRole(user.Id, login.RoleName))
                        userManager.AddToRole(user.Id, login.RoleName);
                    var code = userManager.GenerateEmailConfirmationToken(user.Id);

                    var userProfileService = EngineContext.Current.Resolve<IUserProfileService>();
                    userProfileService.Create(new UserProfileModel()
                    {
                        FirstName = login.FirstName,
                        LastName = login.LastName,
                        MiddleName = "",
                        EmailAddress = user.Email,
                        UserId = user.Id,
                        RoleId = (int)RolesConstants.Enum.SuperAdmin,
                        Username = login.UserName,
                        Address = "",
                        TempPassword = login.Password,
                        ConfirmationCode = code,
                        PasswordChanged = true
                    });

                }
            });
        }
          

    }
}