using System;

namespace Library.Repository.Pattern.DataContext
{
    public interface IDataContext : IDisposable
    {
        int SaveChanges();
        
    }
}