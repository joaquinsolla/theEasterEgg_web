package com.theeasteregg.model.services;

import java.util.Optional;

import com.theeasteregg.model.common.exceptions.DuplicateUserNameException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.theeasteregg.model.common.exceptions.DuplicateInstanceException;
import com.theeasteregg.model.common.exceptions.InstanceNotFoundException;
import com.theeasteregg.model.entities.User;
import com.theeasteregg.model.entities.UserDao;
import com.theeasteregg.model.services.exceptions.IncorrectLoginException;
import com.theeasteregg.model.services.exceptions.IncorrectPasswordException;

/**
 * The Class UserServiceImpl.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

	/** The permission checker. */
	@Autowired
	private PermissionChecker permissionChecker;

	/** The password encoder. */
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	/** The user dao. */
	@Autowired
	private UserDao userDao;

	/**
	 * Sign up.
	 *
	 * @param user the user
	 * @throws DuplicateInstanceException the duplicate instance exception
	 */
	@Override
	public void signUp(User user) throws DuplicateInstanceException, DuplicateUserNameException {

		if (userDao.existsByEmail(user.getEmail())) {
			throw new DuplicateInstanceException("project.entities.user", user.getEmail());
		}

		if (userDao.existsByUserName(user.getUserName())) {
			throw new DuplicateUserNameException("project.entities.user", user.getUserName());
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		userDao.save(user);

	}

	/**
	 * Login.
	 *
	 * @param email El correo electrónico del usuario.
	 * @param password La contraseña del usuario.
	 * @return El objeto Users que representa al usuario que inició sesión.
	 * @throws IncorrectLoginException si el email o la contraseña son
	 * incorrectos.
	 */
	@Override
	@Transactional(readOnly = true)
	public User login(String email, String password) throws IncorrectLoginException {

		Optional<User> user = userDao.findByEmail(email);

		if (!user.isPresent()) {
			throw new IncorrectLoginException(email, password);
		}

		if (!passwordEncoder.matches(password, user.get().getPassword())) {
			throw new IncorrectLoginException(email, password);
		}

		return user.get();

	}

	/**
	 * Login from id.
	 *
	 * @param id the id
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	@Override
	@Transactional(readOnly = true)
	public User loginFromId(Long id) throws InstanceNotFoundException {
		return permissionChecker.checkUser(id);
	}

	/**
	 * Update profile.
	 *
	 * @param id        the id
	 * @param userName     the user name
	 * @return the user
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	@Override
	public User updateProfile(Long id, String userName)
            throws InstanceNotFoundException, DuplicateInstanceException {

		if (userDao.existsByUserName(userName)) {
			throw new DuplicateInstanceException("project.entities.user", userName);
		}

		User user = permissionChecker.checkUser(id);
		user.setUserName(userName);

		return user;
	}

	/**
	 * Change password.
	 *
	 * @param id          the id
	 * @param oldPassword the old password
	 * @param newPassword the new password
	 * @throws InstanceNotFoundException  the instance not found exception
	 * @throws IncorrectPasswordException the incorrect password exception
	 */
	@Override
	public void changePassword(Long id, String oldPassword, String newPassword)
			throws InstanceNotFoundException, IncorrectPasswordException {

		User user = permissionChecker.checkUser(id);

		if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
			throw new IncorrectPasswordException();
		} else {
			user.setPassword(passwordEncoder.encode(newPassword));
		}

	}

}
