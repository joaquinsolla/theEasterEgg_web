package com.theeasteregg.model.services;

import com.theeasteregg.model.entities.UserFavoriteGame;
import com.theeasteregg.model.entities.UserFavoriteGameDao;
import com.theeasteregg.model.entities.UserFavoriteGameId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteGameServiceImpl implements FavoriteGameService {

    private final UserFavoriteGameDao userFavoriteGameDao;

    @Autowired
    public FavoriteGameServiceImpl(UserFavoriteGameDao userFavoriteGameDao) {
        this.userFavoriteGameDao = userFavoriteGameDao;
    }

    @Override
    public void addFavoriteGame(Long userId, Long gameId) {
        UserFavoriteGame favorite = new UserFavoriteGame(userId, gameId);
        userFavoriteGameDao.save(favorite);
    }

    @Override
    public void removeFavoriteGame(Long userId, Long gameId) {
        UserFavoriteGameId favoriteId = new UserFavoriteGameId(userId, gameId);
        userFavoriteGameDao.deleteById(favoriteId);
    }

    @Override
    public List<Long> getFavoriteGameIds(Long userId) {
        List<UserFavoriteGame> favorites = userFavoriteGameDao.findByUserId(userId);
        return favorites.stream()
                .map(UserFavoriteGame::getGameId)
                .collect(Collectors.toList());
    }
}
