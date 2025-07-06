const Logout = () => {

    sessionStorage.clear();
    window.location.href = "/";

}

export default Logout;