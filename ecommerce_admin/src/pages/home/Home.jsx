import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import { useSelector } from "react-redux";

export default function Home() {
  const [userStats, setUserStats] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).get("/users/stats")
        const sortedData = res.data.map((item) => ({
          name: MONTHS[item._id - 1], // Get the month name based on the _id from API
          "New User": item.total, // Assign the total users
        }))
        .sort((a, b) => MONTHS.indexOf(a.name) - MONTHS.indexOf(b.name)); // Sort by month order (from Jan to Dec)

        setUserStats(sortedData);
      } catch {}
    }
    getStats();
  }, [MONTHS]);


  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={userStats} title="User Analytics" grid dataKey="New User"/>
      <div className="homeWidgets">
        <WidgetSm/>
        <WidgetLg/>
      </div>
    </div>
  );
}
