using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using BoilerPlate.Core;
using BoilerPlate.Core.Models;
using BoilerPlate.Models;
using BoilerPlate.Service.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using WebGrease.Css.Extensions;

namespace BoilerPlate.Controllers.Api

{
    [EnableCors("*", "*", "POST,PUT,GET,OPTIONS")]
    
    public class BaseController : ApiController
    {
        private const int PasswordRequiredLength = 8;
        protected IUserProfileService _userProfileService;

       

        protected BaseController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;

        }

        private ApplicationUserManager _userManager;
        private ApplicationRoleManager _roleManager;

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set { _userManager = value; }
        }
         
        
        public ApplicationRoleManager RoleManager
        {
            get { return _roleManager ?? HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>(); }
            set { _roleManager = value; }
        }
        
        protected ModelStateDictionary GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return null;
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                return ModelState;
            }

            return null;
        }
         
        protected async Task<string> GeneratedRandomPassword()
        {
            const string lower = @"abcdefghijklmnopqrstuvwxyz";
            const string upper = @"ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string digits = @"1234567890";
            const string nonld = @"~!@#$%^&*()-_=+[{]}\|;"":',<.>/?";

            // See note at the the top (constants)
            // using required character sets, create appropriate source 
            var source = String.Format("{0}{1}{2}{3}{4}{5}{6}{7}", (lower), (upper), (digits), (lower), (lower), (nonld),
                (upper), (lower));
            // sanity check, this should never occur
            if (source.Length == 0)
            {
                throw new InvalidOperationException("Source character set is empty!");
            }

            var sourceChars = source.ToCharArray();
            var data = new byte[PasswordRequiredLength];
            var crypto = new RNGCryptoServiceProvider();
            crypto.GetNonZeroBytes(data);
            var result = new StringBuilder(PasswordRequiredLength);
            foreach (var b in data)
            {
                result.Append(sourceChars[b%(sourceChars.Length)]);
            }
            var generatedPassword = result.ToString();

            // sanity check, this should never occur

            var isValid = await UserManager.PasswordValidator.ValidateAsync(generatedPassword);
            if (!isValid.Succeeded)
            {
                throw new InvalidOperationException("Generated password failed validation!");
            }

            return generatedPassword;
        }
        protected string GenerateUsername(string firstName, string lastName)
        {
            var tempUsername = String.Format("{0}{1}", firstName[0], lastName);
            var username = tempUsername.ToLowerInvariant();
            var index = 1;
             
            while (_userProfileService.UserNameExist(username) && _userManager.Users.Any(c => c.UserName == username))
            {
                var lastCharacter = username[username.Length - 1];
                if (Char.IsNumber(lastCharacter))
                {
                    var newValue = int.Parse(lastCharacter.ToString()) + 1;
                    var usernameToCharArray = username.ToCharArray();
                    var newValueToCharArray = newValue.ToString().ToCharArray();
                    usernameToCharArray[usernameToCharArray.Length - 1] = newValueToCharArray[0];

                    username = new string(usernameToCharArray);
                }
                else
                {
                    username = username + index;
                }

                index++;
            }
            return username.ToLowerInvariant();
        }
        protected IEnumerable<int> ProcessRolesFilter()
        {
            var currentUserRoles = UserManager.GetRoles(User.Identity.GetUserId());
            var rolesToFilter = new List<int>();
            currentUserRoles.ForEach(r =>
            {
                if (r == Enum.GetName(typeof(RolesConstants.Enum), RolesConstants.Enum.SuperAdmin))
                {
                    rolesToFilter.AddRange(new int[]
                    {
                        RolesConstants.RoleIdsDictionary[Enum.GetName(typeof (RolesConstants.Enum), RolesConstants.Enum.Admin)]
                    });

                }
                
            });
            return rolesToFilter;
        }
        public UserProfileModel CurrentPersonalInfo
        {
            get
            {
                var username = User.Identity.Name;
                if (username == null) return new UserProfileModel();
                var user = _userProfileService.GetUserProfileByUserName(username);
                return user;
            }
        }
        protected UserProfileModel GetPersonalInfoById(int userProfileId)
        {
            return _userProfileService.GetById(userProfileId);
        }
        
        protected void DeleteUser(UserProfileModel model)
        {
            var user = UserManager.FindByName(model.Username);
            if (user != null)
                UserManager.Delete(user);
        }
        protected async Task<ModelStateDictionary> UpdateUserIdentity(UserProfileModel model)
        {
            var result = await UserManager.FindByNameAsync(model.Username);
            result.Email = model.EmailAddress;
            var res = await UserManager.UpdateAsync(result);
            if (!res.Succeeded)
            {
                var errorResult = GetErrorResult(res);
                return errorResult;
            }

            return null;
        }
        protected async Task<ModelStateDictionary> CreateApplicationUser(UserProfileModel model, IList<string> roles)
        {
            var user = new ApplicationUser()
            {
                UserName = model.Username,
                Email = model.EmailAddress,
                EmailConfirmed = false,
                TwoFactorEnabled = true,
                // Psk = TimeSensitivePassCode.GeneratePresharedKey()
            };
            //uncomment this lattewr
           // var password = await GeneratedRandomPassword();
            string password = model.Password??"password1";
            var result = await UserManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                var errorResult = GetErrorResult(result);
                return errorResult;
            }

            var code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
            var locResult = await UserManager.SetLockoutEnabledAsync(user.Id, true);
            if (!locResult.Succeeded)
            {
                UserManager.Delete(user);
                return GetErrorResult(locResult);
            }
            if (roles.Any())
                await UserManager.AddUserToRolesAsync(user.Id, roles);
            model.UserId = user.Id;
            model.TempPassword = password;
            model.ConfirmationCode = code;

            return null;
        }
    }
}
