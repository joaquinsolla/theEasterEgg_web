package com.theeasteregg.model.entities;

import java.io.Serializable;
import java.util.Objects;

public class UserFavoriteGameId implements Serializable {
    private Long userId;
    private Long gameId;

    public UserFavoriteGameId() {}

    public UserFavoriteGameId(Long userId, Long gameId) {
        this.userId = userId;
        this.gameId = gameId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserFavoriteGameId)) return false;
        UserFavoriteGameId that = (UserFavoriteGameId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(gameId, that.gameId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, gameId);
    }
}
