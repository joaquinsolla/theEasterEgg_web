package com.theeasteregg.model.entities;

import javax.persistence.*;

@Entity
@IdClass(UserFavoriteGameId.class)
@Table(name = "UserFavoriteGames")
public class UserFavoriteGame {

	@Id
	@Column(name = "user_id")
	private Long userId;

	@Id
	@Column(name = "game_id")
	private Long gameId;

	public UserFavoriteGame() {}

	public UserFavoriteGame(Long userId, Long gameId) {
		this.userId = userId;
		this.gameId = gameId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getGameId() {
		return gameId;
	}

	public void setGameId(Long gameId) {
		this.gameId = gameId;
	}
}
