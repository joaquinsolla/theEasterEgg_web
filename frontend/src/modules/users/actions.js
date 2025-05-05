import * as actionTypes from './actionTypes';
import backend from '../../backend';

export const showSuccessMessage = (message) => ({
    type: actionTypes.SHOW_SUCCESS_MESSAGE,
    payload: message,
});

export const hideSuccessMessage = () => ({
    type: actionTypes.HIDE_SUCCESS_MESSAGE,
});

const loginCompleted = authenticatedUser => ({
    type: actionTypes.LOGIN_COMPLETED,
    authenticatedUser
});

export const login = (email, password, onSuccess, onErrors, reauthenticationCallback) => dispatch =>
    backend.userService.login(email, password,
        authenticatedUser => {
            dispatch(loginCompleted(authenticatedUser));
            dispatch(showSuccessMessage('Bienvenido'));
            onSuccess();
        },
        onErrors,
        reauthenticationCallback
    );

export const logout = () => {
    backend.userService.logout();
    return { type: actionTypes.LOGOUT };
}

export const tryLoginFromServiceToken = reauthenticationCallback => dispatch =>
    backend.userService.tryLoginFromServiceToken(
        authenticatedUser => {
            if (authenticatedUser) {
                dispatch(loginCompleted(authenticatedUser));
            }
        },
        reauthenticationCallback
    );

const signUpCompleted = authenticatedUser => ({
    type: actionTypes.SIGN_UP_COMPLETED,
    authenticatedUser
});

export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => dispatch =>
    backend.userService.signUp(user,
        authenticatedUser => {
            dispatch(signUpCompleted(authenticatedUser));
            dispatch(showSuccessMessage('Bienvenido'));
            onSuccess();
        },
        onErrors,
        reauthenticationCallback);


export const updateProfileCompleted = user => ({
    type: actionTypes.UPDATE_PROFILE_COMPLETED,
    user
});

export const updateProfile = (user, onSuccess, onErrors) => dispatch =>
    backend.userService.updateProfile(user,
        user => {
            dispatch(updateProfileCompleted(user));
            dispatch(showSuccessMessage('Tu perfil se ha actualizado con éxito'));
            onSuccess();
        },
        onErrors
    );


const changePasswordCompleted = () => ({
    type: actionTypes.CHANGE_PASSWORD_COMPLETED,
});

export const changePassword = (id, oldPassword, newPassword, onSuccess, onErrors) => dispatch =>
    backend.userService.changePassword(id, oldPassword, newPassword,
        () => {
            dispatch(changePasswordCompleted());
            dispatch(showSuccessMessage('La contraseña se ha cambiado con éxito'));
            onSuccess();
        },
        onErrors
    );

const deleteUserCompleted = () => ({
    type: actionTypes.DELETE_USER_COMPLETED,
});

export const deleteUser = (id, onSuccess, onErrors) => dispatch =>
    backend.userService.deleteUser(id,
        () => {
            dispatch(deleteUserCompleted());
            onSuccess();
        },
        onErrors
    );
