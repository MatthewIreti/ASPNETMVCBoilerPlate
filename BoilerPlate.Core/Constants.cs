using System;
using System.Collections.Generic; 

namespace BoilerPlate.Core
{
    public class NameAndId
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class RolesConstants
    {
        public static Dictionary<string, int> RoleIdsDictionary = new Dictionary<string, int>();
        public static Dictionary<string, string> RoleNamesDictionary = new Dictionary<string, string>();
        public static Dictionary<int, string> RoleNamesFromIdDictionary = new Dictionary<int, string>();

        public enum Enum
        {
            SuperAdmin   = 1,
            Admin = 2
        }

        public static List<NameAndId> RoleNameAndId = new List<NameAndId>()
        {
            new NameAndId(){Id=1,Name = "Super Admin"},
            new NameAndId(){Id=2,Name = "Admin"}
        };
        static RolesConstants()
        {
            RoleNamesDictionary.Add(System.Enum.GetName(typeof(Enum), Enum.SuperAdmin), "Super Admin ");
            RoleNamesDictionary.Add(System.Enum.GetName(typeof(Enum), Enum.Admin), " Admin"); 
            
            RoleIdsDictionary.Add(System.Enum.GetName(typeof(Enum), Enum.SuperAdmin), (int)Enum.SuperAdmin);
            RoleIdsDictionary.Add(System.Enum.GetName(typeof(Enum), Enum.Admin), (int)Enum.Admin); 
            
            RoleNamesFromIdDictionary.Add((int)Enum.SuperAdmin, System.Enum.GetName(typeof(Enum), Enum.SuperAdmin));
            RoleNamesFromIdDictionary.Add((int)Enum.Admin, System.Enum.GetName(typeof(Enum), Enum.Admin)); 
        }

    }
      
}
