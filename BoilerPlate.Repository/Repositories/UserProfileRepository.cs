using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using BoilerPlate.Core.Models;
using BoilerPlate.Data.Entities;
using Library.Models;
using Library.Repository.Pattern.DataContext;
using Library.Repository.Pattern.EntityFramework;
using Library.Repository.Pattern.QueryObject;
using Library.Repository.Pattern.Repositories;
using Library.Repository.Pattern.UnitOfWork;

namespace BoilerPlate.Repository.Repositories
{
    public interface IUserProfileRepository:IRepositoryAsync<UserProfile>
    {
        IEnumerable<UserProfile> GetUserProfilePaged(int page, int count, out int totalCount, UserProfileFilter filter = null, OrderExpression orderExpression = null);
        IEnumerable<UserProfile> GetUserProfilePaged(int page, int count, UserProfileFilter filter = null, OrderExpression orderExpression = null);
        IEnumerable<UserProfile> GetUserProfileFilteredQueryable(UserProfileFilter filter = null);
        UserProfile GetUserProfileByUserName(string emailAddress);
        UserProfile GetUserProfileByEmail(string email);
        IEnumerable<UserProfile> GetUserProfileByRoleId(int roleId);
        bool UserNameExist(string username);
        bool EmailExists(UserProfileModel model);
    }
    public class UserProfileRepository:Repository<UserProfile>,IUserProfileRepository
    {
        public UserProfileRepository(IDataContextAsync context, IUnitOfWorkAsync unitOfWork) : base(context, unitOfWork)
        {
        }

        public IEnumerable<UserProfile> GetUserProfilePaged(int page, int count, out int totalCount, UserProfileFilter filter = null,
            OrderExpression orderExpression = null)
        {
            var expression = new UserProfileQueryObject(filter).Expression;
            totalCount = Count(expression);
            return UserProfilePaged(page, count, expression, orderExpression);
        }

        private IEnumerable<UserProfile> UserProfilePaged(int page, int count, Expression<Func<UserProfile, bool>> expression, OrderExpression orderExpression)
        {
            var order = ProcessOrderFunc(orderExpression);
            return Fetch(expression, order, page, count);
        }

        private Func<IQueryable<UserProfile>, IOrderedQueryable<UserProfile>> ProcessOrderFunc(OrderExpression orderDeserilizer = null)
        {
            Func<IQueryable<UserProfile>, IOrderedQueryable<UserProfile>> orderFuction = (queryable) =>
            {
                var orderQueryable = queryable.OrderByDescending(a => a.Id).ThenBy(x => x.DateCreated);
                if (orderDeserilizer != null)
                {
                    switch (orderDeserilizer.Column)
                    {
                        //ignore
                    }
                }
                return orderQueryable;
            };
            return orderFuction;
        }

        public IEnumerable<UserProfile> GetUserProfilePaged(int page, int count, UserProfileFilter filter = null,
            OrderExpression orderExpression = null)
        {
            var expression = new UserProfileQueryObject(filter).Expression;
            return UserProfilePaged(page, count, expression, orderExpression);
        }

        public IEnumerable<UserProfile> GetUserProfileFilteredQueryable(UserProfileFilter filter = null)
        {
            var expression = new UserProfileQueryObject(filter).Expression;
            return Fetch(expression);
        }

        public UserProfile GetUserProfileByUserName(string username)
        {
            return Table.SingleOrDefault(x => x.Username.Equals(username));
        }

        public UserProfile GetUserProfileByEmail(string email)
        {
            return Table.SingleOrDefault(x => x.EmailAddress.Equals(email));
        }

        public IEnumerable<UserProfile> GetUserProfileByRoleId(int roleId)
        {
            return Table.Where(x => x.RoleId == roleId);
        }

        public bool UserNameExist(string username)
        {
            return Table.Any(c => c.Username.Equals(username));
        }

        public bool EmailExists(UserProfileModel model)
        {
            return Table.Any(c => c.EmailAddress.Equals(model.EmailAddress) && c.Id!=model.Id);
        }
    }
    public class UserProfileQueryObject : QueryObject<UserProfile>
    {
        public UserProfileQueryObject(UserProfileFilter filter)
        {
            if (filter != null)
            {
                if (filter.Id > 0)
                    And(c => c.Id == filter.Id);
                if (filter.RoleId > 0)
                    And(c => c.RoleId == filter.RoleId);

                if (filter.InRoles != null)
                    And(x => filter.InRoles.Contains(x.RoleId)); 
                if (filter.StateId != 0)
                    And(x => x.StateId == filter.StateId);

                if (!string.IsNullOrWhiteSpace(filter.Name))
                    And(c => c.FirstName.Contains(filter.Name) || c.LastName.Contains(filter.Name));

                if (!string.IsNullOrWhiteSpace(filter.EmailAddress))
                    And(c => c.EmailAddress.Contains(filter.EmailAddress));

                if (!string.IsNullOrWhiteSpace(filter.PhoneNumber))
                    And(c => c.PhoneNumber.Contains(filter.PhoneNumber));

                if (filter.DateCreatedFrom.HasValue)
                    And(c => c.DateCreated >= filter.DateCreatedFrom.Value);

                if (filter.DateCreatedTo.HasValue)
                    And(c => c.DateCreated <= filter.DateCreatedTo.Value);
                 
                if (filter.UserProfileIds != null)
                    And(c => filter.UserProfileIds.Contains(c.Id));
            }
        }
    }
}
