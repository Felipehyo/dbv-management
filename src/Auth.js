export const isAuthenticated = () => {
    const id = sessionStorage.getItem('id');
    const userType = sessionStorage.getItem('userType');

    return id && userType ? true : false;
};