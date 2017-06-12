using System;

namespace BoilerPlate.Data.Entities
{
    public partial class UserProfile
    {
         
        public long Id { get; set; }
        public string UserId { get; set; }
        public string EmailAddress { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public int RoleId { get; set; }
        public DateTime DateCreated { get; set; }
        public string Address { get; set; }
        public int? StateId { get; set; }
        public string Username { get; set; }
        public DateTime? Birthday { get; set; }
        public DateTime? LastActiveTime { get; set; }
        public string ProfileImageUrl { get; set; }
        public string PhoneNumber { get; set; }
        public bool PasswordChanged { get; set; }
    
        
    }
}
