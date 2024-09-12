import { Link, useLocation } from "react-router-dom";

const RightSideBar = () => {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#212121" : "#9B9FAA",
  });

  return (
    <div>
      <ul>
        <li>
          <Link to="/diary" style={linkStyle("/diary")}>
            Diary
          </Link>
        </li>
        <li>
          <Link to="/" style={linkStyle("/")}>
            Calculator
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default RightSideBar;
