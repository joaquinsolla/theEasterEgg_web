package com.theeasteregg.rest.dtos;

import javax.validation.constraints.NotNull;

/**
 * The Class LoginParamsDto.
 */
public class LoginParamsDto {

	/** The email. */
	private String email;

	/** The password. */
	private String password;

	/**
	 * Instantiates a new login params dto.
	 */
	public LoginParamsDto() {
		super();
	}

	/**
	 * Gets the email.
	 *
	 * @return the email
	 */
	@NotNull
	public String getEmail() {
		return email;
	}

	/**
	 * Sets the email.
	 *
	 * @param email the new email
	 */
	public void setEmail(String email) {
		this.email = email.trim();
	}

	/**
	 * Gets the password.
	 *
	 * @return the password
	 */
	@NotNull
	public String getPassword() {
		return password;
	}

	/**
	 * Sets the password.
	 *
	 * @param password the new password
	 */
	public void setPassword(String password) {
		this.password = password;
	}

}
