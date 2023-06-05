import { Link } from "react-router-dom";

const navLinks = [
    { "data": "Home", "uri": "/" },
    { "data": "Loc dets", "uri": "/locationDetails" },
    { "data": "Contact", "uri": "/contact" },
]

const linksMapped = navLinks.map(({ data, uri }) =>
    <li key={uri}>
        <Link to={uri}>{data}</Link>
    </li>
);

export const Navigation = () =>
    <nav>
        <ul>
            {linksMapped}
        </ul>
    </nav>
 

