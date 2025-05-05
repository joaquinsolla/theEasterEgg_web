const getModuleState = state => state.users;

export const getSuccessMessage = state =>
    getModuleState(state).successMessage;

export const getUser = state =>
    getModuleState(state).user;

export const isLoggedIn = state =>
    !!getUser(state);

