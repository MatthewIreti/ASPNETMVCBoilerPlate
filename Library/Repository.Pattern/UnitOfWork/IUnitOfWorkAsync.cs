using System.Threading;
using System.Threading.Tasks;
using Library.Repository.Pattern.Repositories;

namespace Library.Repository.Pattern.UnitOfWork
{
    public interface IUnitOfWorkAsync : IUnitOfWork
    {
        Task<int> SaveChangesAsync();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        IRepositoryAsync<TEntity> GetRepositoryAsync<TEntity>() where TEntity : class;
    }
}