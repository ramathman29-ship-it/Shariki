import { Link, NavLink } from "react-router-dom"

export default function Header() {
    const activeStyles = {
  fontWeight: "bold",
  color: "#161616",
  borderRadius: "50px",
  padding: "7px 7px",
  backgroundColor: "rgba(255, 255, 255, 0.2)"
}

    
    return (
<header>
            <Link className="site-logo" to="/">
                <img src="/images/download.png" alt="Shariki Logo" className="logo-img" />
            </Link>
                <div className="nav">
                <NavLink 
                    to="/host"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    My houses
                </NavLink>
                <NavLink 
                    to="/about"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    About
                </NavLink>
                <NavLink 
                    to="/houses"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    houses
                </NavLink>
                <NavLink 
                    to="/addHouses"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    sell your house
                </NavLink>

                <NavLink 
                    to="/myRequests"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    my Requests
                </NavLink>
                </div>      
                <NavLink 
                className="a"
                    to="/Login"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    <img src="/imges/download (1).png.png" alt="" />
                </NavLink>
               <h1 className="webName">Shariki web.</h1>
               <div className="info">
                <div className="info1">
                    SureSize Measuring Guarantee.<br/>
                    We’ve got you covered.
                </div>
                <div className="info2">
                    14 million sofas sold<br/>
                    24 years of exceptional service
                </div>
                <div className="info3">
                    Up to 60% off High Street Prices<br/>
                    Live Beautifully, For Less
                </div>
            </div>
        </header>
    )
}