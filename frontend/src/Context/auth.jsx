import React, { useReducer, createContext } from 'react'

const initialState = {
    user: null,
    googleData: null
}


export const AuthContext = createContext(null)

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'REGISTER_WITH_GOOGLE':
            return {
                ...state,
                googleData: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state
    }
}

export function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, initialState);

    function login(userData) {
        localStorage.setItem("token", userData.token)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function loadGoogleData(googleData) {
        dispatch({
            type: 'REGISTER_WITH_GOOGLE',
            payload: googleData
        })
    }

    function logout(){
        localStorage.removeItem("token")
        dispatch({ type: "LOGOUT" })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, googleData: state.googleData, login, logout, loadGoogleData }}
            {...props}
            />
    )
}