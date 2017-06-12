using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using AutoMapper;
using BoilerPlate.Controllers.Api;
using BoilerPlate.Core.Models;
using BoilerPlate.Models;
using BoilerPlate.Service.Services;
using Library.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security; 
namespace BoilerPlate.Controllers
{
    [EnableCors("*", "*", "POST,PUT,GET,OPTIONS")]
    [RoutePrefix("api/Account")]
    [Authorize]
    public class AccountController : BaseController
    {
       
        public AccountController(IUserProfileService userProfileService)
            : base(userProfileService)
        { 
            _userProfileService = userProfileService;
        }

        public UserProfileModel GetUserProfile
        {
            get
            {
                var user = _userProfileService.GetUserProfileByUserName(User.Identity.Name);
                return user ?? new UserProfileItem();
            }
        }

        [Route("GetRoles")]
        public IHttpActionResult GetRoles()
        {
            SetupHelper.SetupRoles(RoleManager);
            var roles = RoleManager.Roles.Select(a => new { a.Name, a.Users.Count });

            return Ok(new
            {
                Total = roles.Count(),
                Items = roles
            });
        }
        

        public class RoleModel
        {
            public string Name { get; set; }
        }
        [Route("CreateRole")]
        [HttpPost]
        public IHttpActionResult PostRole([FromBody] RoleModel roleModel)
        {
            RoleManager.Create(new IdentityRole(roleModel.Name));
            return Ok();
        }

        [Route("DeleteRole")]
        public IHttpActionResult DeleteRole(string name)
        {
            var role = RoleManager.Roles.FirstOrDefault(r => r.Name.ToLower() == name);
            if (role != null && role.Users.Count == 0)
            {
                RoleManager.Delete(role);
                return Ok();
            }
            return BadRequest();
        }

        #region Base
        private const string LocalLoginProvider = "Local";



        public AccountController(ApplicationUserManager userManager, IUserProfileService userProfileService)
            : base(userProfileService)
        {
            UserManager = userManager; 
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        private SignInHelper _helper;
        private SignInHelper SignInHelper
        {
            get
            {
                if (_helper == null)
                {
                    _helper = new SignInHelper(UserManager, Authentication);
                }
                return _helper;
            }
        }
        #endregion


        #region Reset Password
        // POST api/Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [Route("ForgotPassword")]
        public async Task<IHttpActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist or is not confirmed
                ModelState.AddModelError("", "That user does not exist");
                return BadRequest(ModelState);
            }

            var userProfile = _userProfileService.GetUserProfileByEmail(user.Email);
            var code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
             
            //var callbackUrl = AutoNise.Utility.Utility.AbsoluteUrl("/ResetPassword?code=" + HttpUtility.UrlEncode(code));
            //await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking here: <a href=\"" + callbackUrl + "\">link</a>");
            return Ok(new { message = "An email with the link to reset your password has been sent to " + user.Email });

        }
        
        
        // POST api/Account/GenerateEmailConfirmationCode
        [HttpPost]
        [AllowAnonymous]
        [Route("GenerateEmailConfirmationCode")]
        public async Task<IHttpActionResult> GenerateEmailConfirmationCode(EmailConfirmationCodeModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await UserManager.FindByEmailAsync(model.EmailAddress);
            if (user == null)
            {
                // Don't reveal that the user does not exist or is not confirmed
                ModelState.AddModelError("", "That user does not exist");
                return BadRequest(ModelState);
            }

            var userProfile = _userProfileService.GetUserProfileByEmail(user.Email);
            var code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
            var emailmodel = Mapper.Map<UserProfileModel, UserCreationMessageModel>(userProfile);
            if (String.IsNullOrWhiteSpace(emailmodel.TempPassword))
                emailmodel.TempPassword = "password1";
            emailmodel.CallBackUrl = "http://" + HttpContext.Current.Request.Url.Authority +
                                     "/account/confirmemail?userId=" +
                                     emailmodel.UserId + "&code=" + code;
             
            return Ok(new { message = "Account verification email has been sent to " + user.Email });

        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [Route("ResetPassword")]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var user = await UserManager.FindByNameAsync(model.Email);
            model.Code = model.Code.Replace("%3D", "=="); 
            
            if (user != null)
            {
                var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
                var errorResult = GetErrorResult(result);
                if (errorResult != null) return BadRequest(errorResult);
            }

            return Ok(new { message = "Your Password has been reset." });
        }
        #endregion


        #region Manage Account
        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);

            var user = _userProfileService.GetUserProfileByUserName(User.Identity.Name);
            user.PasswordChanged = true;
            _userProfileService.UpdateUserProfile(user);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return BadRequest(errorResult);
            }

            return Ok();
        }
        #endregion 

        // GET api/Account/ConfirmEmail
        [AllowAnonymous]
        [Route("ConfirmEmail")]
        [HttpGet]
        public async Task<IHttpActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null) return BadRequest("Missing email confirmation token");
            code = code.Replace(" ", "+");
            // code = HttpUtility.UrlDecode(code);
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            var errorResult = GetErrorResult(result);
            if (errorResult != null) return BadRequest(errorResult);

            return Ok(new { message = "Your account  has been verified" });
        }



        #region Helpers
        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }



        public class ChallengeResult : IHttpActionResult
        {
            public ChallengeResult(string loginProvider, ApiController controller)
            {
                LoginProvider = loginProvider;
                Request = controller.Request;
            }

            public string LoginProvider { get; set; }
            public HttpRequestMessage Request { get; set; }

            public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
            {
                Request.GetOwinContext().Authentication.Challenge(LoginProvider);

                var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                response.RequestMessage = Request;
                return Task.FromResult(response);
            }
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;
                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UserManager.Dispose();
            }

            base.Dispose(disposing);
        }
        #endregion



    }

    public class UserCreationMessageModel
    {
        public string CallBackUrl { get; set; }
        public string TempPassword { get; set; }
        public string UserId { get; set; }
    }
}
