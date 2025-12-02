import { useEffect, useState } from "react";
import DashNav from "./DasNav";
import Footer from "./Footer";
import Layout from "../components/Layout";

const Orderlist = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/orders")
            .then(res => res.json())
            .then(data => {
                setOrders(data.data);
            })
            .catch(error => console.error("Error fetching orders:", error));
    }, []);

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />

                    <div className="container mt-4">
                        <h3 className="text-center mb-4">Order List</h3>

                        <div className="table-responsive shadow-sm">
                            <table className="table table-bordered table-striped align-middle text-center">
                                <thead className="table-dark">
                                    <tr>
                                        
                                        <th>Customer Name</th>
                                        <th>Phone</th>
                                        <th>District</th>
                                        <th>Thana</th>
                                        <th>Products</th>
                                        <th>Total</th>
                                        <th>Delivery</th>
                                        <th>Final Total</th>
                                        <th>Date</th>
                                         <th>Confirm</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr key={order.id}>
                                               
                                                <td>{order.customer_name}</td>
                                                <td>{order.phone}</td>
                                                <td>{order.district}</td>
                                                <td>{order.thana}</td>

                                                {/* FULL PRODUCT INFO */}
                                                <td>
                                                    <div
                                                        className="d-flex flex-row flex-wrap"
                                                        style={{ gap: "10px" }}
                                                    >
                                                        {order.items && order.items.length > 0 ? (
                                                            order.items.map((item, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="border rounded p-2 bg-light d-flex align-items-center"
                                                                    style={{
                                                                        width: "250px",
                                                                        gap: "10px"
                                                                    }}
                                                                >
                                                                    {/* IMAGE */}
                                                                    <img
                                                                        src={item.image_url}
                                                                        alt={item.product_name}
                                                                        style={{
                                                                            width: "60px",
                                                                            height: "60px",
                                                                            objectFit: "cover",
                                                                            borderRadius: "5px"
                                                                        }}
                                                                    />

                                                                    {/* INFO */}
                                                                    <div className="text-start">
                                                                        <strong style={{ fontSize: "12px" }}>
                                                                            {item.product_name}
                                                                        </strong>

                                                                        <div style={{ fontSize: "12px" }}>
                                                                            Price: {item.price}৳
                                                                        </div>

                                                                        <div style={{ fontSize: "12px" }}>
                                                                            Qty: {item.quantity}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span>No Products</span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>{order.total_price}৳</td>
                                                <td>{order.delivery_charge}৳</td>
                                                <td className="fw-bold text-success">{order.final_total}৳</td>
                                                <td>{order.created_at}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center py-3">
                                                Loading orders...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        </Layout>
    );
};

export default Orderlist;
