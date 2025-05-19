package com.theeasteregg.model.services;

import java.util.List;

/**
 * The Interface UserService.
 */
public interface FavoriteGameService {

	void addFavoriteGame(Long userId, Long gameId);

	void removeFavoriteGame(Long userId, Long gameId);

	List<Long> getFavoriteGameIds(Long userId);

}
