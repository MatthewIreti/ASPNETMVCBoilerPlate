using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using AutoMapper;
using BoilerPlate.Core;
using BoilerPlate.Core.Models;
using BoilerPlate.Data.Entities;
using BoilerPlate.Repository.Repositories;
using Library.AutoFac;
using Library.Models;
using Library.Repository.Pattern.UnitOfWork;

namespace BoilerPlate.Service.Services
{
    public interface IUserProfileService
    {
        void Create(UserProfileModel model); 
        void Edit(UserProfileModel model);
        void Delete(int id);
        UserProfileModel GetById(int id);  
        UserProfileItem GetDetailsById(int id); 
        IEnumerable<UserProfileModel> Query(int page, int count, UserProfileFilter filter,string orderByExpression = null);
        CountModel<UserProfileModel> GetCount(int page, int count, UserProfileFilter filter,string orderByExpression = null);

        UserProfileModel GetUserProfileByUserName(string userName);
         
        UserProfileModel GetUserProfileByEmail(string email);
        void UpdateUserProfile(UserProfileModel user);
        IList<UserProfileModel> GetByRole(int roleId);
        void UpdateLoginUser();
        object GetUserProfiles(UserProfileFilter filter);
        bool UserNameExist(string username);
         
        void CreateWithoutUnitOfWork(UserProfileModel model);
        void ToggleActive(long id);

        bool UserNameExistInAspNetUser(string username);
    }
    public class UserProfileService:IUserProfileService
    {
        private readonly IUserProfileRepository _repository;
        private readonly IUnitOfWorkAsync _unitOfWork; 
        public UserProfileService(IUserProfileRepository repository, IUnitOfWorkAsync unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public void Create(UserProfileModel model)
        {
            try
            {
                _unitOfWork.BeginTransaction();
                if (!String.IsNullOrEmpty(model.EmailAddress))
                {
                    if (_repository.EmailExists(model))
                    {
                        throw new DuplicateNameException("A user with that e-mail address already exists!");
                    }
                }
                
                var entity = Mapper.Map<UserProfileModel, UserProfile>(model);
                entity.DateCreated = DateTime.Now;
                _repository.Insert(entity);
                model.Id = entity.Id;
                _unitOfWork.Commit();  
                
            }
            catch (DuplicateNameException ec)
            { 
                throw new Exception("An error has occured " + ec.Message);
            }
            catch (Exception ec)
            {
                _unitOfWork.Rollback();
                throw new Exception("An error has occured " + ec.Message);
            }
        }

        public void Edit(UserProfileModel model)
        {
            try
            {
                _unitOfWork.BeginTransaction();
                var entity = _repository.Find(model.Id);
                bool suppliedEmail = String.IsNullOrEmpty(entity.EmailAddress) && !String.IsNullOrEmpty(model.EmailAddress);
                Mapper.Map(model,entity);
                _repository.Update(entity); 
                _unitOfWork.Commit(); 
            }
            catch (Exception ec)
            {
                _unitOfWork.Rollback();
                throw new Exception("An error has occured " + ec.Message);
            }
        }

        public void Delete(int id)
        {
            try
            {
                _unitOfWork.BeginTransaction();
                var entity = _repository.Find(id); 
                _repository.Delete(entity);
                _unitOfWork.Commit();
            }
            catch (Exception ec)
            {
                _unitOfWork.Rollback();
                throw new Exception("An error has occured " + ec.Message);

            }
        }

        public UserProfileModel GetById(int id)
        {
            var model = Mapper.Map<UserProfile, UserProfileModel>(_repository.Find(id));
            return model;
        }

        public UserProfileItem GetDetailsById(int id)
        {
            return Mapper.Map<UserProfile, UserProfileItem>(_repository.Find(id));
        }

        public IEnumerable<UserProfileModel> Query(int page, int count, UserProfileFilter filter, string orderByExpression = null)
        {
            var orderExpression = OrderExpression.Deserilizer(orderByExpression);

            var entities = _repository.GetUserProfilePaged(page, count, filter, orderExpression).ToList();
            return ProcessItemQuery(entities);
        }

        private IEnumerable<UserProfileItem> ProcessItemQuery(List<UserProfile> entities)
        {
            return entities.Select(c => new UserProfileItem()
            {
                Id = c.Id,
                DateCreated = c.DateCreated,
                FirstName = c.FirstName,
                LastName = c.LastName,
                MiddleName = c.MiddleName,
                EmailAddress = c.EmailAddress,
                Address = c.Address,
                PhoneNumber = c.PhoneNumber,
                RoleName = c.RoleId > 0 ? RolesConstants.RoleNamesDictionary[RolesConstants.RoleNamesFromIdDictionary[c.RoleId]] : null
            }).ToList();
        }

         

        public CountModel<UserProfileModel> GetCount(int page, int count, UserProfileFilter filter, string orderByExpression = null)
        {
            int totalCount;
            var orderExpression = OrderExpression.Deserilizer(orderByExpression);

            var entities = _repository.GetUserProfilePaged(page, count, out totalCount, filter, orderExpression).ToList();

            return new CountModel<UserProfileModel>()
            {
                Total = totalCount,
                Items = ProcessItemQuery(entities)
            };
        }

        public UserProfileModel GetUserProfileByUserName(string userName)
        {
            var entity = _repository.GetUserProfileByUserName(userName);
            var item = Mapper.Map<UserProfile, UserProfileModel>(entity);
            return item;
        }

          
        public void CreateWithoutUnitOfWork(UserProfileModel model)
        {
             
            var entity = Mapper.Map<UserProfileModel, UserProfile>(model);
            entity.DateCreated = DateTime.Now;
            _repository.Insert(entity);
            model.Id = entity.Id; 
            
               
        }

        public void ToggleActive(long id)
        {
            var entity = _repository.Find(id);
             
            _repository.Update(entity);
             
        }

        public bool UserNameExistInAspNetUser(string username)
        {
//            var exists = _repository.GetRepository<AspNetUser>().Table.Any(c => c.UserName == username);
//            return exists;
            return true;
        }


        public IList<UserProfileItem> DownloadReport(UserProfileFilter filter)
        {
            return ProcessItemQuery(_repository.GetUserProfileFilteredQueryable(filter).ToList()).ToList();
        }

          

        public UserProfileModel GetUserProfileByEmail(string email)
        {
            return Mapper.Map<UserProfile, UserProfileModel>(_repository.GetUserProfileByEmail(email));
        }

        public void UpdateUserProfile(UserProfileModel user)
        {
            try
            {
                _unitOfWork.BeginTransaction();
                var entity = _repository.Find(user.Id);
                if(entity==null)
                    throw new Exception("User not found");

                Mapper.Map(user, entity); 
                _repository.Update(entity);
                user.Id = entity.Id;
                _unitOfWork.Commit(); 
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
            
        }

        public IList<UserProfileModel> GetByRole(int roleId)
        {
            var userInfos = _repository.GetUserProfileByRoleId(roleId);
            return Mapper.Map<IEnumerable<UserProfile>, IList<UserProfileModel>>(userInfos);

        }

        public void UpdateLoginUser()
        {
            var user = _repository.GetUserProfileByUserName(EngineContext.Resolve<UserProfileInfo>().UserName);
            user.LastActiveTime = DateTime.Now.AddHours(1);
            _repository.Update(user);
        }

        public object GetUserProfiles(UserProfileFilter filter)
        {
            var users =  _repository.Table.Where(x=>filter.UserProfileIds.Contains(x.Id)).Select(x => new
            {
                x.ProfileImageUrl,
                x.Id,
                Birthday = x.Birthday??new DateTime(),
                x.FirstName,
                x.LastName
            });
            return users;
        }

        public bool UserNameExist(string username)
        {
            var exists  = _repository.UserNameExist(username);
            return exists;
        }

         
    }

   
}
