DROP TABLE IF EXISTS User;

CREATE TABLE User (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS UserFavoriteGames;

CREATE TABLE UserFavoriteGames (
   user_id BIGINT NOT NULL,
   game_id BIGINT NOT NULL,
   PRIMARY KEY (user_id, game_id),
   FOREIGN KEY (user_id) REFERENCES User(id)
);
