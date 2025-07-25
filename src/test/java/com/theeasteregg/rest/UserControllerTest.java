package com.theeasteregg.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.theeasteregg.model.entities.User;
import com.theeasteregg.model.entities.UserDao;
import com.theeasteregg.model.services.exceptions.IncorrectLoginException;
import com.theeasteregg.rest.controllers.UserController;
import com.theeasteregg.rest.dtos.AuthenticatedUserDto;
import com.theeasteregg.rest.dtos.LoginParamsDto;

/**
 * The Class UserControllerTest.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class UserControllerTest {
	
	/** The Constant PASSWORD. */
	private final static String PASSWORD = "password";

	/** The mock mvc. */
	@Autowired
	private MockMvc mockMvc;

	/** The password encoder. */
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	/** The user dao. */
	@Autowired
	private UserDao userDao;

	/** The user controller. */
	@Autowired
	private UserController userController;

	/**
	 * Creates the authenticated user.
	 *
	 * @return the authenticated user dto
	 * @throws IncorrectLoginException the incorrect login exception
	 */
	private AuthenticatedUserDto createAuthenticatedUser()
			throws IncorrectLoginException {

		User user = new User("test1", PASSWORD, "user@test.com");

		user.setPassword(passwordEncoder.encode(user.getPassword()));

		userDao.save(user);

		LoginParamsDto loginParams = new LoginParamsDto();
		loginParams.setEmail(user.getEmail());
		loginParams.setPassword(PASSWORD);

		return userController.login(loginParams);

	}

	/**
	 * Test post login ok.
	 *
	 * @throws Exception the exception
	 */
	@Test
	public void testPostLogin_Ok() throws Exception {

		AuthenticatedUserDto user = createAuthenticatedUser();

		LoginParamsDto loginParams = new LoginParamsDto();
		loginParams.setEmail(user.getUserDto().getEmail());
		loginParams.setPassword(PASSWORD);

		ObjectMapper mapper = new ObjectMapper();

		mockMvc.perform(post("/api/users/login").header("Authorization", "Bearer " + user.getServiceToken())
				.contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsBytes(loginParams)))
				.andExpect(status().isOk());

	}
}
