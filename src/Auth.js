export const isAuthenticated = () => {
    const id = localStorage.getItem('id');
    const userType = localStorage.getItem('userType');

    return id && userType ? true : false;
};