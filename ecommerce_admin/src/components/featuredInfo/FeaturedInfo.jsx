import { useEffect, useState } from "react";
import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { userRequest } from "../../requestMethods";

export default function FeaturedInfo() {
  const [income, setIncome] = useState([]);
  const [perc, setPerc] = useState(0);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const getIncome = async () => {
      try {
        const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
        const res = await userRequest(token).get("/orders/income");
        console.log("GOOD")
        const sortedData = res.data.sort((a, b) => a._id - b._id); // Sort by _id in ascending order
        setIncome(sortedData);
        if (res.data.length >= 2) {
          setPerc((sortedData[1].total * 100) / sortedData[0].total - 100);
        }
        setLoading(false); // Data is fetched, so no longer loading
      } catch (error) {
        console.error("Failed to fetch income data:", error);
        setLoading(false); // In case of an error, also stop loading
      }
    };
    getIncome();
  }, []);

  console.log(income);

  if (loading) {
    return <div>Loading...</div>; // Render this while data is being fetched
  }

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {income[1] ? `$${income[1].total}` : "Data not available"}
          </span>
        </div>
        <span className="featuredSub">This month</span>
      </div>
      {/* Other featuredItems can remain unchanged */}
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${income[0]?.total}</span>
        </div>
        <span className="featuredSub">Last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">
            {income[1] ? `%${Math.floor(perc)}` : "Data not available"}
          </span>
          <span className="featuredMoneyRate">
            {perc < 0 ? (
              <ArrowDownward className="featuredIcon negative" />
            ) : (
              <ArrowUpward className="featuredIcon" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}
