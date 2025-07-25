package com.theeasteregg.model.services;

import com.theeasteregg.model.common.exceptions.DuplicateInstanceException;
import com.theeasteregg.model.common.exceptions.DuplicateUserNameException;
import com.theeasteregg.model.common.exceptions.InstanceNotFoundException;
import com.theeasteregg.model.entities.User;
import com.theeasteregg.model.services.exceptions.IncorrectLoginException;
import com.theeasteregg.model.services.exceptions.IncorrectPasswordException;

/**
 * The Interface UserService.
 */
public interface UserService {
	
	/**
	 * Sign up.
	 *
	 * @param user the user
	 * @throws DuplicateInstanceException the duplicate instance exception
	 */
	void signUp(User user) throws DuplicateInstanceException, DuplicateUserNameException;
	
	/**
	 * Login.
	 *
	 * @param email the email
	 * @param password the password
	 * @return the user
	 * @throws IncorrectLoginException the incorrect login exception
	 */
	User login(String email, String password) throws IncorrectLoginException;
	
	/**
	 * Login from id.
	 *
	 * @param id the id
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	User loginFromId(Long id) throws InstanceNotFoundException;
	
	/**
	 * Update profile.
	 *
	 * @param id the id
	 * @param userName the user name
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	User updateProfile(Long id, String userName) throws InstanceNotFoundException, DuplicateInstanceException;
	
	/**
	 * Change password.
	 *
	 * @param id the id
	 * @param oldPassword the old password
	 * @param newPassword the new password
	 * @throws InstanceNotFoundException the instance not found exception
	 * @throws IncorrectPasswordException the incorrect password exception
	 */
	void changePassword(Long id, String oldPassword, String newPassword)
		throws InstanceNotFoundException, IncorrectPasswordException;

}
