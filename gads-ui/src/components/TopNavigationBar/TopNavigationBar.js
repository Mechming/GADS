import { useContext, useState } from 'react'
import './TopNavigationBar.css'
import { NavLink } from 'react-router-dom'
import { Auth } from '../../contexts/Auth'
import Button from '@mui/material/Button'

export default function NavBar() {
    let username = localStorage.getItem('username')
    let role = localStorage.getItem('role')

    const [showAdmin, setShowAdmin] = useState(false)

    if (role == 'admin') {
        if (!showAdmin) {
            setShowAdmin(true)
        }
    }

    return (
        <div className='navbar-wrapper'>
            <nav className="navbar">
                <StyledNavLink to="/" linkText='Home' />
                <StyledNavLink to="/devices" linkText='Devices' />
                {showAdmin && (<StyledNavLink to="/admin" linkText='Admin' />)}
            </nav>
            <div className="social-buttons-wrapper">
                <p>Welcome, {username}</p>
                <GithubButton></GithubButton>
                <DiscordButton></DiscordButton>
                <LogoutButton></LogoutButton>
            </div>
        </div>

    )
}

function StyledNavLink({ to, linkText }) {
    return (
        <NavLink className="nav-bar-link"
            style={({ isActive }) => ({
                backgroundColor: isActive ? "#273616" : "",
                color: "#E0D8C0"
            })}
            to={to}
        >
            {linkText}
        </NavLink>
    )
}

function GithubButton() {
    return (
        <a className='github-button' target='_blank' href='https://github.com/shamanec/GADS'>
            <img src='./images/github.png' alt='github icon' />
        </a>
    )
}

function DiscordButton() {
    return (
        <a className='discord-button' target='_blank' href='https://discordapp.com/users/365565274470088704'>
            <img src='./images/discord.png' alt='discord icon' />
        </a>
    )
}

function LogoutButton() {
    const [authToken, login, logout] = useContext(Auth)
    let url = `http://${process.env.REACT_APP_GADS_BACKEND_HOST}/logout`

    function handleLogout() {
        fetch(url, {
            method: 'POST',
            headers: {
                'X-Auth-Token': authToken
            }
        })
            .then((response) => {
                if (!response.ok) {
                    logout()
                    throw new Error('Network response was not ok.');
                }
                logout()
            })
            .catch((e) => {
                console.log(e)
            })
    }
    return (
        <Button
            variant="contained"
            type="submit"
            onClick={handleLogout}
            style={{ marginLeft: "20px", backgroundColor: "#914400" }}
        >Logout</Button>
    )
}