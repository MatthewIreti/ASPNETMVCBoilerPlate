using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Autofac;
using BoilerPlate.Core;
using BoilerPlate.Models;
using BoilerPlate.Service.Services;
using Library.AutoFac;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;

namespace BoilerPlate.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }
            _publicClientId = publicClientId;
        }
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

            ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);
            
            if (user == null)
            {
                var u = await userManager.FindByEmailAsync(context.UserName);
                if (u != null)
                    await userManager.AccessFailedAsync(u.Id);
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }
            //to do
            var person = EngineContext.Current.Resolve<IUserProfileService>().GetUserProfileByUserName(user.UserName);
             

            if (person == null)
            {
                context.SetError("no_user", "No user was found. Please contact the administrator");
                return;
            }
            if (person.RoleId == (int)RolesConstants.Enum.SuperAdmin)
            {
                var roleManager = HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();
                SetupHelper.SetupRoles(roleManager); 
            }
            ////if (!person.IsActive)
            ////{
            ////    context.SetError("account_deactivated", "Account has not been activated yet, please activate through the link that was sent to your email");
            ////    return;
            ////}
                //if (!(await userManager.IsEmailConfirmedAsync(user.Id)))
                //{
                //        context.SetError("email_not_confirmed", "account awaiting confirmation, please confirm through the link sent to your mailbox");
                //        return;
                //}
            
            var userRoles = userManager.GetRoles(user.Id);


            if (await userManager.IsLockedOutAsync(user.Id))
            {
                context.SetError("lock_out", "The account is locked.");
                return;
            }
              
            await userManager.ResetAccessFailedCountAsync(user.Id);
            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, context.Options.AuthenticationType);
            //oAuthIdentity.AddClaim(new Claim("PSK", user.PSK));
            ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager, DefaultAuthenticationTypes.ApplicationCookie);

            AuthenticationProperties properties = CreateProperties(user.UserName);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            context.Validated(ticket);
            context.Request.Context.Authentication.SignIn(cookiesIdentity);

        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string userName, bool isPersistent = false)
        {
            IDictionary<string, string> data = new Dictionary<string, string>{
                { "UserName", userName }
            };
            var properties = new AuthenticationProperties(data)
            {
                ExpiresUtc = DateTime.Now.AddDays(30),
                IsPersistent = isPersistent
            };

            return properties;
        }
    }
}