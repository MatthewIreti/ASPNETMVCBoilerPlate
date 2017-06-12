using System;
using System.Data;
using Library.Repository.Pattern.Repositories;

namespace Library.Repository.Pattern.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        int SaveChanges();
        void Dispose(bool disposing);
        IRepository<TEntity> GetRepository<TEntity>() where TEntity : class;
        void BeginTransaction(IsolationLevel isolationLevel = IsolationLevel.Unspecified);
        bool Commit();
        void Rollback();
    }
}