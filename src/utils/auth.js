import Cookies from "js-cookie";

const TokenKey = "School-Token";

export function getToken() {
    // return Cookies.get(TokenKey, {
    //     path: process.env.NODE_ENV === 'production' ?
    //         '/school' : '/'
    // });

    return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
    // return Cookies.set(TokenKey, token, {
    //     path: process.env.NODE_ENV === 'production' ?
    //         '/school' : '/'
    // });

    return sessionStorage.setItem(TokenKey, token)

}

export function removeToken() {
    // return Cookies.remove(TokenKey, {
    //     path: process.env.NODE_ENV === 'production' ?
    //         '/school' : '/'
    // });
    return sessionStorage.removeItem(TokenKey)
}