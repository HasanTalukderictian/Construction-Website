import { useEffect, useState } from "react";
import DashNav from "./DasNav";
import Footer from "./Footer";
import Layout from "../components/Layout";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";


const Orderlist = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paperflyTracking, setPaperflyTracking] = useState({});



    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Modal form data
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        district_name: "",
        thana_name: "",
        address: "",
        label: "",
        Username: "",
        Password: "",
        paperflyKey: ""
    });

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/orders?page=" + currentPage)
            .then(res => res.json())
            .then(data => {
                console.log("API FULL RESPONSE:", data);

                setOrders(data?.data?.data || data?.data || data || []);
                setLastPage(data?.data?.last_page || 1);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                setOrders([]);
            });
    }, [currentPage]);


    // ========= OPEN MODAL =========

    const sendToPaperfly = (order) => {
        setSelectedOrder(order);

        const storeData = JSON.parse(localStorage.getItem("storeCreationData") || "{}");
        const courierData = JSON.parse(localStorage.getItem("courierSettings") || "{}");

        setFormData({
            full_name: storeData.full_name || "",
            phone_number: storeData.phone_number || "",
            district_name: storeData.district_name || "",
            thana_name: storeData.thana_name || "",
            address: storeData.address || "",
            label: storeData.label || "",
            Username: courierData.Username || "",      // keep hidden
            Password: courierData.Password || "",      // keep hidden
            paperflyKey: courierData.paperflyKey || "" // keep hidden
        });

        setShowModal(true);
    };


    // ========= INPUT CHANGE =========
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ========= CONFIRM SEND =========
    const handleConfirm = async () => {
        if (!selectedOrder) return;

        const payload = {
            merOrderRef: selectedOrder.id,
            pickMerchantName: formData.full_name,
            pickMerchantAddress: formData.address,
            pickMerchantThana: formData.thana_name,
            pickMerchantDistrict: formData.district_name,
            pickupMerchantPhone: formData.phone_number,
            productSizeWeight: "standard",
            productBrief: selectedOrder.items?.map(i => i.product_name).join(", ") || "Product",
            packagePrice: selectedOrder.total_price,
            max_weight: "0.3",
            deliveryOption: "regular",
            custname: selectedOrder.customer_name,
            custaddress: selectedOrder.address,
            customerThana: selectedOrder.thana,
            customerDistrict: selectedOrder.district,
            custPhone: selectedOrder.phone
        };

        try {
            const response = await fetch("https://api.paperfly.com.bd/merchant/api/service/new_order.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "paperflykey": formData.paperflyKey,
                    "Authorization": "Basic " + btoa(`${formData.Username}:${formData.Password}`)
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("Paperfly Response:", data);

            if (response.ok && data.success) {
                alert("Order sent successfully!");
                // save tracking number
                setPaperflyTracking(prev => ({
                    ...prev,
                    [selectedOrder.id]: data.success.tracking_number || "N/A"
                }));
            } else {
                alert("Failed to send order. Check console for details.");
            }
        } catch (error) {
            console.error("Error sending to Paperfly:", error);
            alert("An error occurred while sending the order.");
        }

        setShowModal(false);
    };

    const printInvoice = (order) => {
        const invoiceWindow = window.open("", "_blank", "height=800,width=600");

        if (!invoiceWindow) {
            alert("Popup blocked! Please allow popup in your browser.");
            return;
        }

        // Fetch sender info
        const storeData = JSON.parse(localStorage.getItem("storeCreationData") || "{}");

        const htmlContent = `
    <html>
    <head>
        <title>Invoice #${order.id}</title>
        <style>
            body { 
                font-family: Arial; 
                padding: 20px; 
                font-size: 13px;
            }
            h2 { text-align: center; margin-bottom: 20px; }

            .info-container {
                display: flex;
                justify-content: space-between;
                gap: 15px;
                margin-bottom: 20px;
            }

            .box {
                flex: 1;
                border: 1px solid #000;
                padding: 10px;
                border-radius: 5px;
            }

            .box-title {
                font-weight: bold;
                margin-bottom: 8px;
                font-size: 14px;
                border-bottom: 1px solid #000;
                padding-bottom: 4px;
            }

            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px; 
            }
            table, th, td { border: 1px solid #000; }
            th, td { padding: 6px; text-align: left; }

            .totals {
                margin-top: 15px;
                text-align: right;
                font-weight: bold;
            }
        </style>
    </head>
    <body>

        <h2>Invoice</h2>

        <!-- Sender + Customer 2-column box -->
        <div class="info-container">

            <!-- Sender Box -->
            <div class="box">
                <div class="box-title">Sender Information</div>
                <p><strong>Name:</strong> ${storeData.full_name || ""}</p>
                <p><strong>Phone:</strong> ${storeData.phone_number || ""}</p>
                <p><strong>Address:</strong> 
                    ${storeData.address || ""}, 
                    ${storeData.thana_name || ""}, 
                    ${storeData.district_name || ""}
                </p>
            </div>

            <!-- Customer Box -->
            <div class="box">
                <div class="box-title">Customer Information</div>
                <p><strong>Name:</strong> ${order.customer_name}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}</p>
            </div>

        </div>

        <!-- Product Table -->
        <h4>Products</h4>
        <table>
            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
            </tr>
            ${order.items
                .map(
                    (item) => `
                    <tr>
                        <td>${item.product_name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}৳</td>
                    </tr>`
                )
                .join("")}
        </table>

        <!-- Totals -->
        <div class="totals">
            <p>Delivery Charge: ${order.delivery_charge || 0}৳</p>
            <p>Total: ${order.final_total}৳</p>
        </div>

        <p style="margin-top:30px; text-align:center;">Thank you for your purchase!</p>

    </body>
    </html>
    `;

        invoiceWindow.document.open();
        invoiceWindow.document.write(htmlContent);
        invoiceWindow.document.close();

        invoiceWindow.onload = () => {
            invoiceWindow.focus();
            invoiceWindow.print();
        };
    };






    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />

                    <div className="container mt-4">
                        <h3 className="text-center mb-4">Order List</h3>

                        <div className="table-responsive shadow-sm">
                            <table
                                className="table table-bordered table-striped align-middle text-center"
                                style={{ fontSize: "13px" }}
                            >
                                <thead className="table-dark" style={{ fontSize: "12px" }}>
                                    <tr>
                                        <th>SL</th>  {/* NEW SERIAL COLUMN */}
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>District</th>
                                        <th>Thana</th>
                                        <th>Products</th>
                                        <th>Total</th>
                                        <th>Delivery</th>
                                        <th>Final</th>
                                        <th>Date</th>
                                        <th>Tracking Number</th> {/* NEW COLUMN */}
                                        <th>Confirm</th>
                                        <th>Invoice</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map((order, index) => (
                                            <tr key={order.id}>
                                                <td>{index + 1}</td>
                                                <td>{order.customer_name}</td>
                                                <td>{order.phone}</td>
                                                <td>{order.district}</td>
                                                <td>{order.thana}</td>

                                                {/* ========== Products Column (keep your existing code) ========== */}
                                                <td style={{ minWidth: "240px" }}>
                                                    <div
                                                        className="d-flex flex-row flex-wrap"
                                                        style={{ gap: "6px", justifyContent: "center" }}
                                                    >
                                                        {order.items?.length > 0 ? (
                                                            order.items.map((item, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="border rounded p-1 bg-light d-flex align-items-center"
                                                                    style={{ width: "180px", gap: "6px" }}
                                                                >
                                                                    <img
                                                                        src={item.image_url}
                                                                        alt={item.product_name}
                                                                        style={{
                                                                            width: "45px",
                                                                            height: "45px",
                                                                            objectFit: "cover",
                                                                            borderRadius: "4px"
                                                                        }}
                                                                    />
                                                                    <div className="text-start" style={{ fontSize: "11px" }}>
                                                                        <strong>{item.name}</strong>
                                                                        <div>Price: {item.total_price}৳</div>
                                                                        <div>Qty: {item.quantity}</div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span>No Products</span>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* =============================================================== */}

                                                <td>{order.total_price}৳</td>
                                                <td>{order.delivery_charge}৳</td>
                                                <td className="fw-bold text-success">{order.final_total}৳</td>
                                                <td>{order.created_at}</td>

                                                {/* ========== Tracking Number Column ========== */}
                                                <td>{paperflyTracking[order.id] || "-"}</td>

                                                {/* ========== Confirm Button Column ========== */}
                                                <td>
                                                    <button
                                                        className={`btn btn-sm ${paperflyTracking[order.id] ? "btn-secondary" : "btn-primary"}`}
                                                        style={{ fontSize: "11px", padding: "2px 6px" }}
                                                        onClick={() => sendToPaperfly(order)}
                                                        disabled={!!paperflyTracking[order.id]}
                                                    >
                                                        {paperflyTracking[order.id] ? "Already Sent" : "Send"}
                                                    </button>
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        style={{ fontSize: "11px", padding: "2px 6px" }}
                                                        onClick={() => printInvoice(order)}
                                                    >
                                                        Print
                                                    </button>
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center py-3">
                                                Loading orders...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>


                            </table>

                            <div className="d-flex justify-content-center mt-3 gap-2 mb-4">

                                <button
                                    className="btn btn-sm btn-dark"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    <BsChevronLeft size={18} />
                                </button>

                                <span className="px-3 py-1 border rounded">
                                    Page {currentPage} of {lastPage}
                                </span>

                                <button
                                    className="btn btn-sm btn-dark"
                                    disabled={currentPage === lastPage}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    <BsChevronRight size={18} />
                                </button>

                            </div>


                        </div>
                    </div>

                    <Footer />
                </div>
            </div>

            {/* =================== MODAL =================== */}
            {showModal && (
                <div
                    className="modal d-block"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Send to Paperfly</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">



                                {/* ===================== SENDER INFO ===================== */}
                                <h6 className="fw-bold mb-3 text-primary">Sender Information</h6>

                                <div className="row">
                                    {["full_name", "phone_number", "district_name", "thana_name", "address", "label"].map((key) => (
                                        <div className="col-md-6 mb-3" key={key}>
                                            <label className="form-label text-capitalize">
                                                {key.replace("_", " ")}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name={key}
                                                value={formData[key] || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ))}
                                </div>


                                <hr />

                                {/* ===================== ORDER DETAILS ===================== */}
                                <h6 className="fw-bold mb-3 text-success">Order Details</h6>

                                <div className="row">
                                    {selectedOrder &&
                                        Object.entries(selectedOrder).map(([key, value]) => (
                                            key !== "items" ? (
                                                <div className="col-md-6 mb-2" key={key}>
                                                    <label className="form-label text-capitalize">
                                                        {key.replace("_", " ")}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name={key}
                                                        value={formData[key] !== undefined ? formData[key] : value}
                                                        onChange={handleChange}
                                                        readOnly={!(key === "address" || key === "phone")}
                                                    />
                                                </div>
                                            ) : null
                                        ))
                                    }
                                </div>

                                {/* ===================== ORDER ITEMS ===================== */}
                                <h6 className="fw-bold mt-4">Products</h6>

                                <div className="d-flex flex-wrap gap-2">
                                    {selectedOrder?.items?.length > 0 ? (
                                        selectedOrder.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="border rounded p-2 bg-light d-flex align-items-center"
                                                style={{ width: "200px", gap: "8px" }}
                                            >
                                                <img
                                                    src={item.image_url}
                                                    alt={item.product_name}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px"
                                                    }}
                                                />

                                                <div style={{ fontSize: "12px" }}>
                                                    <strong>{item.product_name}</strong>
                                                    <div>Price: {item.price}৳</div>
                                                    <div>Qty: {item.quantity}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No items found</p>
                                    )}
                                </div>

                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={() => setShowModal(false)}>
                                    Close
                                </button>

                                <button className="btn btn-success" onClick={handleConfirm}>
                                    Confirm Send
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}



        </Layout>
    );
};

export default Orderlist;
