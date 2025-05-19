package com.theeasteregg.model.entities;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserFavoriteGameDao extends CrudRepository<UserFavoriteGame, UserFavoriteGameId> {

    List<UserFavoriteGame> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
