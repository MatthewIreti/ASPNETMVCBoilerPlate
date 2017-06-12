using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace BoilerPlate.Core.Models
{
    public class UserProfileModel
    {

        public long Id { get; set; }
        public string UserId { get; set; }
        
        [DisplayName("Email Address")]
        public string EmailAddress { get; set; }
        [Required]
        [DisplayName("First Name")]
        public string FirstName { get; set; }
         [Required]
         [DisplayName("Last Name")]
        public string LastName { get; set; }
         [DisplayName("Middle Name")]
        public string MiddleName { get; set; }
        public int RoleId { get; set; }
         [ Required, DataType(DataType.PhoneNumber)]
         [DisplayName("Phone Number")]
        public string PhoneNumber { get; set; }
         
         [DisplayName("Address")]
        public string Address { get; set; }
        public int? StateId { get; set; }
        [RegularExpression(@"^\S*$", ErrorMessage = "Username doesn't allow white space")]
        public string Username { get; set; }
        public string Password { get; set; }
        public string TempPassword { get; set; }
        public string ConfirmationCode { get; set; }
        public bool PasswordChanged { get; set; }
         [DisplayName("Date of birth")]
        public DateTime? Birthday { get; set; } 
        public string ProfileImageUrl { get; set; }
        public bool IsActive { get; set; }
        public List<int> RoleIds { get; set; }
    }

    public class UserProfileItem : UserProfileModel
    {
        public DateTime DateCreated { get; set; }
        public string RoleName { get; set; } 
        public DateTime? LastActiveTime { get; set; }
        public object SubscriptionExpiryDate { get; set; }
    }
    public class UserProfileFilter : UserProfileItem
    {
        public static UserProfileFilter Deserilize(string whereCondition)
        {
            UserProfileFilter filter = null;
            if (whereCondition != null)
            {
                filter = JsonConvert.DeserializeObject<UserProfileFilter>(whereCondition);
            }
            return filter;
        }

        public IEnumerable<int> InRoles { get; set; }
        public string Name { get; set; }
        public DateTime? DateCreatedFrom { get; set; }
        public DateTime? DateCreatedTo { get; set; }
        public IEnumerable<long> UserProfileIds { get; set; }
    }
    public class UserProfileInfo
    {
        public string Email { get; set; }

        public string UserName { get; set; }

        public long Id { get; set; }

        public string Role { get; set; }

        public int? RoleId { get; set; }
    }
    public class UserProfileCookieInfo : UserProfileInfo { }
        
}
