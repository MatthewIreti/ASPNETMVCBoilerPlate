using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using BoilerPlate.Data.Entities;
using Library.Repository.Pattern.DataContext;

namespace BoilerPlate.Models
{
    public class BoilerContext:DbContext, IDataContextAsync
    {
        public BoilerContext()
            : base("name=BoilerContext")
        {
            
        }
        public DbSet<UserProfile> UserProfile { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
