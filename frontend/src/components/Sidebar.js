import {NavLink} from "react-router-dom";
import Plus from "./Plus";

function Sidebar(props) {
    function isActiveLink(str) {
        let currURL = window.location.href.split("#")[1];
        return (currURL === str) ? "sidebar__item--active" : null;
    }
    return(
        <div className="sidebar">
            <ul className="sidebar__list">
                <li className="sidebar__item">
                    <NavLink to={`/room-${props.roomId}`} className={()=> isActiveLink(`/room-${props.roomId}`)}>Room</NavLink>
                </li>
            </ul>
            <Plus />
        </div>
    )
}

export default Sidebar;
