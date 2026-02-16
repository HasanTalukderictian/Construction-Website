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

    // Modal open
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
            Username: courierData.Username || "",
            Password: courierData.Password || "",
            paperflyKey: courierData.paperflyKey || ""
        });

        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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

    // Fixed printInvoice

    const printInvoice = (order) => {
        const invoiceWindow = window.open("", "_blank", "height=900,width=700");
        if (!invoiceWindow) { alert("Popup blocked!"); return; }

        const storeData = JSON.parse(localStorage.getItem("storeCreationData") || "{}");
        const deliveryCharge = order.delivery_charge || 0;
        const totalAmount = order.final_total || 0;

        const logoUrl = storeData.logo || "YOUR_LOGO_URL_HERE";

        const htmlContent = `
    <html>
    <head>
        <title>Invoice #${order.id}</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #57C785, #EDDD53);
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .invoice-wrapper {
                padding: 30px;
            }

            .invoice-container {
                position: relative;
                background: #ffffff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                overflow: hidden;
            }

            /* WATERMARK */
            .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.05;
                width: 300px;
                z-index: 0;
            }

            .content {
                position: relative;
                z-index: 2;
            }

            /* HEADER */
            .header {
                background: linear-gradient(90deg, #57C785, #EDDD53);
                padding: 15px;
                border-radius: 8px;
                color: #fff;
                text-align: center;
                margin-bottom: 20px;
            }

            .header h2 {
                margin: 0;
                font-size: 22px;
                letter-spacing: 1px;
            }

            /* INFO SECTION */
            .info-container { 
                display: flex; 
                justify-content: space-between; 
                gap: 15px; 
                margin-bottom: 20px; 
            }

            .box { 
                flex: 1; 
                border: 1px solid #ddd; 
                padding: 12px; 
                border-radius: 8px; 
                background: #f9f9f9;
            }

            .box-title { 
                font-weight: bold; 
                margin-bottom: 8px; 
                font-size: 14px; 
                color: #57C785;
            }

            /* TABLE */
           table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 20px; 
    table-layout: fixed;   /* IMPORTANT */
}

th, td {
    padding: 10px;
    border: 1px solid #ddd;
    word-wrap: break-word;
}

th {
    background: #57C785;
    color: white;
    text-align: center;
}

/* Column Width Fix */
th:nth-child(1), td:nth-child(1) {
    width: 60%;
    text-align: left;
}

th:nth-child(2), td:nth-child(2) {
    width: 15%;
    text-align: center;
}

th:nth-child(3), td:nth-child(3) {
    width: 25%;
    text-align: right;
}

            /* TOTAL */
            .totals { 
                margin-top: 20px; 
                text-align: right; 
                font-weight: bold; 
                font-size: 14px;
            }

            /* FOOTER */
            .footer {
                margin-top: 30px;
                padding: 12px;
                text-align: center;
                background: linear-gradient(90deg, #EDDD53, #57C785);
                border-radius: 8px;
                color: #333;
                font-weight: bold;
            }

            @media print {
                body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-wrapper">
            <div class="invoice-container">

                <img src="${logoUrl}" class="watermark"/>

                <div class="content">

                    <div class="header">
                        <h2>INVOICE #${order.id}</h2>
                    </div>

                    <div class="info-container">
                        <div class="box">
                            <div class="box-title">Sender Information</div>
                            <p><strong>${storeData.full_name || ""}</strong></p>
                            <p>${storeData.phone_number || ""}</p>
                            <p>${storeData.address || ""}, ${storeData.thana_name || ""}, ${storeData.district_name || ""}</p>
                        </div>

                        <div class="box">
                            <div class="box-title">Customer Information</div>
                            <p><strong>${order.customer_name}</strong></p>
                            <p>${order.phone}</p>
                            <p>${order.address}</p>
                        </div>
                    </div>

                    <table>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.product_name}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price} ৳</td>
                            </tr>
                        `).join("")}
                    </table>

                    <div class="totals">
                        <p>Delivery Charge: ${deliveryCharge} ৳</p>
                        <p>Total: ${totalAmount} ৳</p>
                    </div>

                    <div class="footer">
                        Thank you for your business!
                    </div>

                </div>
            </div>
        </div>
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



    // DELETE function
    const deleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.status) {
                setOrders(prev => prev.filter(o => o.id !== orderId));
                alert(data.message);
            } else {
                alert(data.message || "Failed to delete order");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the order");
        }
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1">
                    <DashNav />
                    <div className="container mt-4">
                        <h3 className="text-center mb-4">Order List</h3>
                        <div className="table-responsive shadow-sm">
                            <table className="table table-bordered table-striped align-middle text-center" style={{ fontSize: "13px" }}>
                                <thead className="table-dark" style={{ fontSize: "12px" }}>
                                    <tr>
                                        <th>SL</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>District</th>
                                        <th>Thana</th>
                                        <th>Products</th>
                                        <th>Final</th>
                                        <th>Date</th>
                                        <th>Tracking Number</th>
                                        <th>Confirm</th>
                                        <th>Invoice</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? orders.map((order, index) => (
                                        <tr key={order.id}>
                                            <td>{index + 1}</td>
                                            <td>{order.customer_name}</td>
                                            <td>{order.phone}</td>
                                            <td>{order.district}</td>
                                            <td>{order.thana}</td>
                                            <td style={{ minWidth: "240px" }}>
                                                <div className="d-flex flex-row flex-wrap" style={{ gap: "6px", justifyContent: "center" }}>
                                                    {order.items?.length > 0 ? order.items.map((item, idx) => (
                                                        <div key={idx} className="border rounded p-1 bg-light d-flex align-items-center" style={{ width: "180px", gap: "6px" }}>
                                                            <img src={item.image_url} alt={item.product_name} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px" }} />
                                                            <div className="text-start" style={{ fontSize: "11px" }}>
                                                                <strong>{item.name}</strong>
                                                                <div>Price: {item.total_price}৳</div>
                                                                <div>Qty: {item.quantity}</div>
                                                            </div>
                                                        </div>
                                                    )) : <span>No Products</span>}
                                                </div>
                                            </td>
                                            <td className="fw-bold text-success">{order.final_total}৳</td>
                                            <td>{order.created_at}</td>
                                            <td>{paperflyTracking[order.id] || "-"}</td>
                                            <td>
                                                <button className={`btn btn-sm ${paperflyTracking[order.id] ? "btn-secondary" : "btn-primary"}`}
                                                    style={{ fontSize: "11px", padding: "2px 6px" }}
                                                    onClick={() => sendToPaperfly(order)}
                                                    disabled={!!paperflyTracking[order.id]}>
                                                    {paperflyTracking[order.id] ? "Already Sent" : "Send"}
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-warning"
                                                    style={{ fontSize: "11px", padding: "2px 6px" }}
                                                    onClick={() => printInvoice(order)}>
                                                    Print
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-danger"
                                                    style={{ fontSize: "11px", padding: "2px 6px" }}
                                                    onClick={() => deleteOrder(order.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="12" className="text-center py-3">Loading orders...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="d-flex justify-content-center mt-3 gap-2 mb-4">
                                <button className="btn btn-sm btn-dark" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                                    <BsChevronLeft size={18} />
                                </button>
                                <span className="px-3 py-1 border rounded">Page {currentPage} of {lastPage}</span>
                                <button className="btn btn-sm btn-dark" disabled={currentPage === lastPage} onClick={() => setCurrentPage(prev => prev + 1)}>
                                    <BsChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Send to Paperfly</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <h6 className="fw-bold mb-3 text-primary">Sender Information</h6>
                                <div className="row">
                                    {["full_name", "phone_number", "district_name", "thana_name", "address", "label"].map(key => (
                                        <div className="col-md-6 mb-3" key={key}>
                                            <label className="form-label text-capitalize">{key.replace("_", " ")}</label>
                                            <input type="text" className="form-control" name={key} value={formData[key] || ""} onChange={handleChange} />
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                <h6 className="fw-bold mb-3 text-success">Order Details</h6>
                                <div className="row">
                                    {selectedOrder && Object.entries(selectedOrder).map(([key, value]) => (
                                        key !== "items" ? (
                                            <div className="col-md-6 mb-2" key={key}>
                                                <label className="form-label text-capitalize">{key.replace("_", " ")}</label>
                                                <input type="text" className="form-control" name={key} value={formData[key] !== undefined ? formData[key] : value} onChange={handleChange} readOnly={!(key === "address" || key === "phone")} />
                                            </div>
                                        ) : null
                                    ))}
                                </div>

                                <h6 className="fw-bold mt-4">Products</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedOrder?.items?.length > 0 ? selectedOrder.items.map((item, index) => (
                                        <div key={index} className="border rounded p-2 bg-light d-flex align-items-center" style={{ width: "200px", gap: "8px" }}>
                                            <img src={item.image_url ? `http://127.0.0.1:8000/storage/${item.image_url}` : "https://via.placeholder.com/50"} alt={item.product_name} />
                                            <div style={{ fontSize: "12px" }}>
                                                <strong>{item.product_name}</strong>
                                                <div>Price: {item.price}৳</div>
                                                <div>Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                    )) : <p>No items found</p>}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-success" style={{ backgroundColor: '#ebb434', borderColor: '#ebb434' }} onClick={() => setShowModal(false)}>Close</button>
                                <button className="btn btn-success" onClick={handleConfirm}>Confirm Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Orderlist;
