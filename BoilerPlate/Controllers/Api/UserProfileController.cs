using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using BoilerPlate.Core;
using BoilerPlate.Core.Models;
using BoilerPlate.Data.Entities;
using BoilerPlate.Service.Services;

namespace BoilerPlate.Controllers.Api
{
    public class UserProfileController : BaseController
    {
        public UserProfileController(IUserProfileService userProfileService) : base(userProfileService)
        {
            _userProfileService = userProfileService;
        }

        [Route("api/UserProfile/GetCurrentUserInfo")]
        public UserProfileModel GetCurrentUserInfo()
        {
            return _userProfileService.GetUserProfileByUserName(User.Identity.Name);
        }
         
        // GET: api/Client
        [Route("api/UserProfile/Count")]
        public object GetCount(int page, int count,string orderByExpression = null, string whereCondition = null)
        {
            var filter = UserProfileFilter.Deserilize(whereCondition);
            return _userProfileService.GetCount(page, count, filter, orderByExpression);
        }

        public IEnumerable<UserProfileModel> Get(int page, int count,string orderByExpression = null, string whereCondition = null)
        {
            var filter = UserProfileFilter.Deserilize(whereCondition);
            return _userProfileService.Query(page, count, filter, orderByExpression);
        }

        // GET: api/UserProfile/5
        [ResponseType(typeof(UserProfileModel))]
        public IHttpActionResult Get(int id)
        {
            var userProfile = _userProfileService.GetById(id);
            if (userProfile == null)
            {
                return NotFound();
            }
            return Ok(userProfile);
        }
        [Route("api/UserProfile/Details"),HttpGet]
        public IHttpActionResult Details(int id)
        {
            var userProfile = _userProfileService.GetDetailsById(id);
            if (userProfile == null)
            {
                return NotFound();
            }
            return Ok(userProfile);
        }

        // PUT: api/UserProfile/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserProfile(UserProfileModel userProfile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _userProfileService.Edit(userProfile);
            return Ok();
            
        }

        // POST: api/UserProfile
         
        [ResponseType(typeof(UserProfileModel))]
        public async Task<IHttpActionResult> PostUserProfile(UserProfileModel model)
        {
            
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var roles = new List<string>() { RolesConstants.RoleNamesFromIdDictionary[model.RoleId] }; 
                model.Username = GenerateUsername(model.FirstName, model.LastName);
                var result = await CreateApplicationUser(model, roles);
                if (result != null)
                    return BadRequest(result);
                _userProfileService.Create(model);
                return Ok();
            }
             
            catch (DuplicateNameException exception)
            {
                return BadRequest(exception.Message);
            }
            catch (Exception ec)
            {
                DeleteUser(model);
                return BadRequest("An error occurred, Please try again!"+ec.Message);
            }
        }
         

        [Route("api/UserProfile/UpdateUserIdentity"), HttpPut]
        public async Task<IHttpActionResult> UpdateUserManager(UserProfileModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await UpdateUserIdentity(model);
            if (result != null)
                return BadRequest(result); 
            return Ok();
        }
         
        // DELETE: api/UserProfile/5
        [ResponseType(typeof(UserProfile))]
        public IHttpActionResult DeleteUserProfile(int id)
        {
            try
            {
                var model = _userProfileService.GetById(id);
                DeleteUser(model); //Delete from Identity Manager
                _userProfileService.Delete(id);
                return Ok();
            }
            catch (Exception ec)
            {
                return BadRequest("Unable to delete ");
            }   
            
        }

        [Route("api/UserProfile/GetRolesNameAndId"), HttpGet] 
        public IHttpActionResult GetRolesNameAndId()
        {
            return Ok(RolesConstants.RoleNameAndId);
        }
    }
}