import "./orderList.css"; // Import your CSS for styling
import { DataGrid } from "@material-ui/data-grid"; // Import DataGrid from Material-UI
import { DeleteOutline } from "@material-ui/icons"; // Import delete icon
import { Link } from "react-router-dom"; // Import Link for navigation
import { useEffect } from "react"; // Import useEffect from React
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { deleteOrder, getOrders } from "../../redux/apiCalls"; // Import API calls

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders); // Access orders from Redux state
  
  useEffect(() => {
    getOrders(dispatch); // Fetch orders when component mounts
  }, [dispatch]);
  console.log("ORDERS\n", orders);

  const handleDelete = (id) => {
    deleteOrder(dispatch, id); // Call deleteOrder when an order is deleted
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 }, // Order ID
    {
      field: "userId",
      headerName: "User ID",
      width: 200, // User ID associated with the order
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 160, // Total amount of the order
    },
    {
      field: "status",
      headerName: "Status",
      width: 200, // Status of the order
    },
    {
      field: "action",
      headerName: "Action",
      width: 150, // Action column for Edit and Delete buttons
      renderCell: (params) => {
        return (
          <>
            <Link to={"/order/" + params.row._id}>
              <button className="orderListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="orderListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="orderList">
      <DataGrid
        rows={orders}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        rowsPerPageOptions={[8, 10, 20]}
        checkboxSelection
      />
    </div>
  );
}
