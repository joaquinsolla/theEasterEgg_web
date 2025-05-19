package com.theeasteregg.model.services;

import com.theeasteregg.model.common.exceptions.DuplicateInstanceException;
import com.theeasteregg.model.common.exceptions.InstanceNotFoundException;
import com.theeasteregg.model.entities.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import javax.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * The Class UserServiceTest.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class FavoriteGameServiceTest {

	/** The user service. */
	@Autowired
	private UserService userService;

	@Autowired
	private FavoriteGameService favoriteGameService;

	private User createUser(String userName) {
		return new User(userName, "password", userName + "@" + userName + ".com");
	}

	/**
	 * Test sign up and login from id.
	 *
	 * @throws DuplicateInstanceException the duplicate instance exception
	 * @throws InstanceNotFoundException  the instance not found exception
	 */
	@Test
	public void testGetFavorites() throws DuplicateInstanceException, InstanceNotFoundException {

		User user = createUser("user");

		userService.signUp(user);

		User loggedInUser = userService.loginFromId(user.getId());

		List<Long> favs = favoriteGameService.getFavoriteGameIds(loggedInUser.getId());
		List<Long> sample = new ArrayList<>();

		assertEquals(sample, favs);

		favoriteGameService.addFavoriteGame(loggedInUser.getId(), 10L);
		favoriteGameService.addFavoriteGame(loggedInUser.getId(), 1230L);
		favs = favoriteGameService.getFavoriteGameIds(loggedInUser.getId());

		sample.add(10L);
		sample.add(1230L);

		assertEquals(sample, favs);

		favoriteGameService.removeFavoriteGame(loggedInUser.getId(), 10L);
		favs = favoriteGameService.getFavoriteGameIds(loggedInUser.getId());
		sample.remove(10L);

		assertEquals(sample, favs);

		favoriteGameService.removeFavoriteGame(loggedInUser.getId(), 1230L);
		favs = favoriteGameService.getFavoriteGameIds(loggedInUser.getId());
		sample.remove(1230L);

		assertEquals(sample, favs);

	}
}
