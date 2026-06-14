import { useEffect, useState } from "react";
import DashNav from "./DasNav";
import Footer from "./Footer";
import Layout from "../components/Layout";
import { BsChevronLeft, BsChevronRight, BsSearch, BsDownload, BsEye, BsPrinter, BsSend, BsTrash, BsShieldCheck, BsTruck, BsBox, BsGraphUp } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export const API_STORE = import.meta.env.VITE_API_STORAGE_URL;
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Orderlist = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [trackingData, setTrackingData] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [confirmFilter, setConfirmFilter] = useState("all");
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyData, setVerifyData] = useState(null);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [verifyError, setVerifyError] = useState(null);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [filterText, setFilterText] = useState("");

    const [formData, setFormData] = useState({
        full_name: "", phone_number: "", district_name: "", thana_name: "",
        address: "", label: "", Username: "", Password: "", paperflyKey: ""
    });

    // Fetch orders
    useEffect(() => {
        setLoadingOrders(true);
        fetch(`${API_BASE}/orders?page=` + currentPage)
            .then(res => res.json())
            .then(data => {
                const allOrders = data?.data?.data || data?.data || data || [];
                setOrders(allOrders);
                setFilteredOrders(allOrders);
                setLastPage(data?.data?.last_page || 1);
                setLoadingOrders(false);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                setOrders([]);
                setFilteredOrders([]);
                setLoadingOrders(false);
                showToastMessage("Failed to load orders", "error");
            });
    }, [currentPage]);

    // Apply filters
    useEffect(() => {
        let filtered = [...orders];
        if (confirmFilter === "sent") filtered = filtered.filter(order => !!order.tracking_number);
        else if (confirmFilter === "notSent") filtered = filtered.filter(order => !order.tracking_number);
        
        if (filterText) {
            const lowerFilter = filterText.toLowerCase();
            filtered = filtered.filter(order =>
                (order.customer_name?.toLowerCase().includes(lowerFilter)) ||
                (order.phone?.toLowerCase().includes(lowerFilter)) ||
                (order.district?.toLowerCase().includes(lowerFilter)) ||
                (order.thana?.toLowerCase().includes(lowerFilter))
            );
        }
        setFilteredOrders(filtered);
    }, [filterText, confirmFilter, orders]);

    const showToastMessage = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const exportToExcel = () => {
        if (filteredOrders.length === 0) {
            showToastMessage("No data to export", "error");
            return;
        }
        const data = filteredOrders.map((order, index) => ({
            SL: index + 1, Customer: order.customer_name, Phone: order.phone,
            District: order.district, Thana: order.thana, Address: order.address,
            Products: order.items?.map(i => `${i.product_name} (x${i.quantity})`).join(", ") || "-",
            Final: order.final_total, Date: order.created_at, TrackingNumber: order.tracking_number || "-"
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Orders.xlsx");
        showToastMessage("Excel exported successfully!");
    };

    const viewTracking = async (order) => {
        try {
            const courierRes = await fetch(`${API_BASE}/couriers`);
            const courierData = await courierRes.json();
            if (courierRes.ok && courierData.status && courierData.data.length > 0) {
                const courier = courierData.data[0];
                const response = await fetch("https://api.paperfly.com.bd/API-Order-Tracking", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "paperflykey": courier.paperflyKey,
                        "Authorization": "Basic " + btoa(`${courier.Username}:${courier.Password}`)
                    },
                    body: JSON.stringify({ ReferenceNumber: order.id })
                });
                const data = await response.json();
                if (data.success) {
                    setTrackingData(data.success.trackingStatus[0]);
                    setShowTrackingModal(true);
                }
            }
        } catch (error) {
            console.error("Tracking error:", error);
            showToastMessage("Failed to fetch tracking info", "error");
        }
    };

    const verifyOrder = async (order) => {
        if (!order?.phone) {
            setVerifyError("Customer phone number is missing");
            setShowVerifyModal(true);
            return;
        }
        setVerifyLoading(true);
        setVerifyError(null);
        setVerifyData(null);
        try {
            const response = await fetch('https://api.bdcourier.com/courier-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ySFLXGfOnjCDYKD5SZ1SH3Oa8eJ6aIgVspSe4S7OhugqLBtN0OJUPAWpr2D6'
                },
                body: JSON.stringify({ phone: order.phone })
            });
            const result = await response.json();
            if (result.status === "success") {
                setVerifyData(result);
                setVerifyError(null);
            } else {
                setVerifyError(result.message || "Failed to fetch courier data");
            }
        } catch (error) {
            console.error("Verify error:", error);
            setVerifyError("Network error. Please try again.");
        } finally {
            setVerifyLoading(false);
            setShowVerifyModal(true);
        }
    };

    const sendToPaperfly = async (order) => {
        setSelectedOrder(order);
        try {
            const storeRes = await fetch(`${API_BASE}/stores`);
            const storeData = await storeRes.json();
            let storeInfo = {};
            if (storeRes.ok && storeData.status && Array.isArray(storeData.data) && storeData.data.length > 0) {
                storeInfo = storeData.data[0];
            }
            const courierRes = await fetch(`${API_BASE}/couriers`);
            const courierDataResp = await courierRes.json();
            let courierInfo = {};
            if (courierRes.ok && courierDataResp.status && Array.isArray(courierDataResp.data) && courierDataResp.data.length > 0) {
                courierInfo = courierDataResp.data[0];
            }
            setFormData({
                full_name: storeInfo.full_name || "", phone_number: storeInfo.phone_number || "",
                district_name: storeInfo.district_name || "", thana_name: storeInfo.thana_name || "",
                address: storeInfo.address || "", label: storeInfo.label || "",
                Username: courierInfo.Username || "", Password: courierInfo.Password || "",
                paperflyKey: courierInfo.paperflyKey || ""
            });
        } catch (error) {
            console.error("Error fetching info:", error);
        }
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (!selectedOrder) return;
        const payload = {
            merOrderRef: selectedOrder.id, pickMerchantName: formData.full_name,
            pickMerchantAddress: formData.address, pickMerchantThana: formData.thana_name,
            pickMerchantDistrict: formData.district_name, pickupMerchantPhone: formData.phone_number,
            productSizeWeight: "standard", productBrief: selectedOrder.items?.map(i => i.product_name).join(", ") || "Product",
            packagePrice: selectedOrder.total_price, max_weight: "0.3", deliveryOption: "regular",
            custname: selectedOrder.customer_name, custaddress: selectedOrder.address,
            customerThana: selectedOrder.thana, customerDistrict: selectedOrder.district, custPhone: selectedOrder.phone
        };
        try {
            const response = await fetch(`https://api.paperfly.com.bd/merchant/api/service/new_order.php`, {
                method: "POST", headers: {
                    "Content-Type": "application/json", "paperflykey": formData.paperflyKey,
                    "Authorization": "Basic " + btoa(`${formData.Username}:${formData.Password}`)
                }, body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok && data.success) {
                const trackingNumber = data.success.tracking_number;
                await fetch(`${API_BASE}/orders/${selectedOrder.id}/tracking`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tracking_number: trackingNumber })
                });
                setOrders(prev => prev.map(order => order.id === selectedOrder.id ? { ...order, tracking_number: trackingNumber } : order));
                setFilteredOrders(prev => prev.map(order => order.id === selectedOrder.id ? { ...order, tracking_number: trackingNumber } : order));
                showToastMessage("Order sent successfully!");
            } else {
                showToastMessage("Failed to send order", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showToastMessage("Network error", "error");
        }
        setShowModal(false);
    };

    const printInvoice = async (order) => {
        let storeData = {};
        try {
            const res = await fetch(`${API_BASE}/stores`);
            const data = await res.json();
            if (res.ok && data.status && Array.isArray(data.data) && data.data.length > 0) storeData = data.data[0];
        } catch (error) { console.error("Error fetching store info:", error); }
        
        const deliveryCharge = order.delivery_charge || 0;
        const totalAmount = order.final_total || 0;
        const logoUrl = storeData.logo || "";
        const trackingNumber = order.tracking_number || "N/A";
        const invoiceWindow = window.open("", "_blank", "height=900,width=700");
        if (!invoiceWindow) { alert("Popup blocked!"); return; }
        
        invoiceWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head><title>Invoice #${order.id}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .invoice-card { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
                .invoice-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                .invoice-header h1 { font-size: 28px; margin-bottom: 10px; }
                .invoice-body { padding: 30px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                .info-box { background: #f8f9fa; padding: 15px; border-radius: 12px; }
                .info-box h4 { color: #667eea; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
                th { background: #667eea; color: white; }
                .total-section { text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea; }
                .tracking-box { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 12px; text-align: center; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 12px; }
                @media print { body { background: white; padding: 0; } }
            </style>
            </head>
            <body>
                <div class="invoice-card">
                    <div class="invoice-header">
                        <h1>INVOICE #${order.id}</h1>
                        <p>Order Date: ${new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="invoice-body">
                        <div class="info-grid">
                            <div class="info-box"><h4>From</h4><p><strong>${storeData.full_name || ""}</strong><br>${storeData.phone_number || ""}<br>${storeData.address || ""}</p></div>
                            <div class="info-box"><h4>To</h4><p><strong>${order.customer_name}</strong><br>${order.phone}<br>${order.address}</p></div>
                        </div>
                        <table><thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead><tbody>
                            ${order.items.map(item => `<tr><td><strong>${item.product_name}</strong></td><td>${item.quantity}</td><td>${item.price} ৳</td>`).join("")}
                        </tbody></table>
                        <div class="total-section"><p>Delivery Charge: ${deliveryCharge} ৳</p><h3>Total: ${totalAmount} ৳</h3></div>
                        <div class="tracking-box"><strong>Tracking Number:</strong> ${trackingNumber}</div>
                    </div>
                    <div class="footer"><p>Thank you for your business!</p></div>
                </div>
            </body>
            </html>
        `);
        invoiceWindow.document.close();
        invoiceWindow.onload = () => { invoiceWindow.focus(); invoiceWindow.print(); };
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}`, { method: "DELETE" });
            const data = await response.json();
            if (data.status) {
                setOrders(prev => prev.filter(o => o.id !== orderId));
                showToastMessage(data.message);
            } else {
                showToastMessage(data.message || "Failed to delete order", "error");
            }
        } catch (error) {
            console.error("Delete error:", error);
            showToastMessage("Network error", "error");
        }
    };

    const getRiskColor = (level) => {
        switch(level) {
            case 'high': return { bg: '#fee2e2', text: '#dc2626', border: '#dc2626', label: 'High Risk' };
            case 'review': return { bg: '#fef3c7', text: '#d97706', border: '#d97706', label: 'Review Needed' };
            case 'low': return { bg: '#dcfce7', text: '#16a34a', border: '#16a34a', label: 'Low Risk' };
            default: return { bg: '#f3f4f6', text: '#6b7280', border: '#6b7280', label: 'Unknown' };
        }
    };

    return (
        <Layout>
            <div className="d-flex">
                <div className="flex-grow-1" style={{ overflowX: 'hidden' }}>
                    <DashNav />
                    <div className="container-fluid px-3 px-md-4 py-3 py-md-4">
                        {/* Header - Responsive */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                            <div>
                                <h3 className="mb-0 fw-bold" style={{ color: '#1f2937', fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>Order Management</h3>
                                <p className="text-muted mt-1 mb-0">Manage and track all customer orders</p>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <div className="position-relative flex-grow-1" style={{ minWidth: '200px' }}>
                                    <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: '14px' }} />
                                    <input type="text" className="form-control ps-5" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px' }}
                                        placeholder="Search orders..." value={filterText} onChange={e => setFilterText(e.target.value)} />
                                </div>
                                <select className="form-select" style={{ borderRadius: '12px', width: '130px', fontSize: '14px' }} value={confirmFilter} onChange={e => setConfirmFilter(e.target.value)}>
                                    <option value="all">All Orders</option>
                                    <option value="sent">Sent</option>
                                    <option value="notSent">Pending</option>
                                </select>
                                <button className="btn" style={{ background: '#10b981', color: 'white', borderRadius: '12px', padding: '6px 16px', fontSize: '14px' }} onClick={exportToExcel}>
                                    <BsDownload className="me-1" /> Export
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards - Responsive Grid */}
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                    <div className="card-body p-3 p-md-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div><h6 className="mb-1 opacity-75" style={{ fontSize: '12px' }}>Total Orders</h6><h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)' }}>{orders.length}</h2></div>
                                            <BsBox size={30} className="opacity-50 d-none d-md-block" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', color: 'white' }}>
                                    <div className="card-body p-3 p-md-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div><h6 className="mb-1 opacity-75" style={{ fontSize: '12px' }}>Pending</h6><h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)' }}>{orders.filter(o => !o.tracking_number).length}</h2></div>
                                            <BsSend size={30} className="opacity-50 d-none d-md-block" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                                    <div className="card-body p-3 p-md-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div><h6 className="mb-1 opacity-75" style={{ fontSize: '12px' }}>Delivered</h6><h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)' }}>{orders.filter(o => o.tracking_number).length}</h2></div>
                                            <BsTruck size={30} className="opacity-50 d-none d-md-block" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                                    <div className="card-body p-3 p-md-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div><h6 className="mb-1 opacity-75" style={{ fontSize: '12px' }}>Revenue</h6><h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>৳{orders.reduce((sum, o) => sum + (o.final_total || 0), 0).toLocaleString()}</h2></div>
                                            <BsGraphUp size={30} className="opacity-50 d-none d-md-block" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Table - Responsive with Horizontal Scroll */}
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="card-body p-0">
                                <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                    <table className="table table-hover mb-0" style={{ minWidth: '900px', width: '100%' }}>
                                        <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                            <tr>
                                                <th className="py-3 px-2 px-md-3" style={{ width: '50px' }}>#</th>
                                                <th className="py-3 px-2 px-md-3" style={{ minWidth: '120px' }}>Customer</th>
                                                <th className="py-3 px-2 px-md-3" style={{ minWidth: '110px' }}>Phone</th>
                                                <th className="py-3 px-2 px-md-3" style={{ minWidth: '130px' }}>Location</th>
                                                <th className="py-3 px-2 px-md-3" style={{ minWidth: '180px' }}>Products</th>
                                                <th className="py-3 px-2 px-md-3" style={{ width: '80px' }}>Total</th>
                                                <th className="py-3 px-2 px-md-3" style={{ minWidth: '90px' }}>Date</th>
                                                <th className="py-3 px-2 px-md-3" style={{ width: '90px' }}>Status</th>
                                                <th className="py-3 px-2 px-md-3 text-center" style={{ minWidth: '220px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingOrders ? (
                                                <tr><td colSpan="9" className="text-center py-5"><FaSpinner className="fa-spin me-2" size={30} /> Loading orders...</td></tr>
                                            ) : filteredOrders.length === 0 ? (
                                                <tr><td colSpan="9" className="text-center py-5"><BsBox size={50} className="text-muted mb-2 d-block mx-auto" /><p className="text-muted">No orders found</p></td></tr>
                                            ) : (
                                                filteredOrders.map((order, index) => (
                                                    <tr key={order.id} style={{ transition: 'all 0.3s' }} className="align-middle">
                                                        <td className="px-2 px-md-3">{index + 1}</td>
                                                        <td className="px-2 px-md-3"><strong className="text-truncate d-block" style={{ maxWidth: '150px' }}>{order.customer_name}</strong></td>
                                                        <td className="px-2 px-md-3" style={{ fontSize: '13px' }}>{order.phone}</td>
                                                        <td className="px-2 px-md-3" style={{ fontSize: '13px' }}>{order.district}<br/><small className="text-muted">{order.thana}</small></td>
                                                        <td className="px-2 px-md-3">
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {order.items?.slice(0, 2).map((item, idx) => (
                                                                    <span key={idx} className="badge bg-light text-dark px-2 py-1" style={{ fontSize: '11px' }}>{item.product_name?.substring(0, 15)} x{item.quantity}</span>
                                                                ))}
                                                                {order.items?.length > 2 && <span className="badge bg-secondary" style={{ fontSize: '11px' }}>+{order.items.length - 2}</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-2 px-md-3 fw-bold text-success" style={{ fontSize: '14px' }}>৳{order.final_total}</td>
                                                        <td className="px-2 px-md-3" style={{ fontSize: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="px-2 px-md-3">
                                                            {order.tracking_number ? 
                                                                <span className="badge px-2 py-1" style={{ background: '#10b981', borderRadius: '20px', fontSize: '11px' }}>✓ Sent</span> :
                                                                <span className="badge px-2 py-1" style={{ background: '#f59e0b', borderRadius: '20px', fontSize: '11px' }}>⏳ Pending</span>
                                                            }
                                                        </td>
                                                        <td className="px-2 px-md-3">
                                                            <div className="d-flex gap-1 justify-content-center flex-wrap">
                                                                <button className="btn btn-sm p-1 p-md-2" style={{ background: '#3b82f6', color: 'white', borderRadius: '8px', width: '30px', height: '30px' }} onClick={() => sendToPaperfly(order)} disabled={!!order.tracking_number} title="Send">
                                                                    <BsSend size={12} />
                                                                </button>
                                                                <button className="btn btn-sm p-1 p-md-2" style={{ background: '#f59e0b', color: 'white', borderRadius: '8px', width: '30px', height: '30px' }} onClick={() => printInvoice(order)} disabled={!order.tracking_number} title="Print">
                                                                    <BsPrinter size={12} />
                                                                </button>
                                                                <button className="btn btn-sm p-1 p-md-2" style={{ background: '#8b5cf6', color: 'white', borderRadius: '8px', width: '30px', height: '30px' }} onClick={() => verifyOrder(order)} title="Verify">
                                                                    <BsShieldCheck size={12} />
                                                                </button>
                                                                <button className="btn btn-sm p-1 p-md-2" style={{ background: '#06b6d4', color: 'white', borderRadius: '8px', width: '30px', height: '30px' }} onClick={() => viewTracking(order)} disabled={!order.tracking_number} title="Track">
                                                                    <BsEye size={12} />
                                                                </button>
                                                                <button className="btn btn-sm p-1 p-md-2" style={{ background: '#ef4444', color: 'white', borderRadius: '8px', width: '30px', height: '30px' }} onClick={() => deleteOrder(order.id)} title="Delete">
                                                                    <BsTrash size={12} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer bg-white border-0 py-3">
                                <div className="d-flex justify-content-center gap-2">
                                    <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                                        <BsChevronLeft /> Prev
                                    </button>
                                    <span className="px-3 py-1 bg-light rounded">Page {currentPage} of {lastPage}</span>
                                    <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === lastPage} onClick={() => setCurrentPage(prev => prev + 1)}>
                                        Next <BsChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            {/* Send to Paperfly Modal */}
            {showModal && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" style={{ margin: '16px' }}>
                        <div className="modal-content" style={{ borderRadius: '20px' }}>
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                                <h5 className="modal-title"><BsSend className="me-2" /> Send to Paperfly</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row">
                                    {["full_name", "phone_number", "district_name", "thana_name", "address"].map(key => (
                                        <div className="col-md-6 mb-3" key={key}>
                                            <label className="form-label fw-semibold">{key.replace("_", " ").toUpperCase()}</label>
                                            <input type="text" className="form-control" style={{ borderRadius: '10px' }} name={key} value={formData[key] || ""} onChange={handleChange} />
                                        </div>
                                    ))}
                                </div>
                                <hr />
                                <h6 className="fw-bold mb-3">Order Items</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedOrder?.items?.map((item, index) => (
                                        <div key={index} className="border rounded p-2 bg-light" style={{ width: "180px" }}>
                                            <img src={item.image_url || "https://via.placeholder.com/50"} alt={item.product_name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px" }} />
                                            <div className="mt-1"><strong>{item.product_name}</strong><br />৳{item.price} x {item.quantity}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button className="btn btn-light" style={{ borderRadius: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn" style={{ background: '#10b981', color: 'white', borderRadius: '10px' }} onClick={handleConfirm}>Confirm Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Order Modal */}
            {showVerifyModal && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999, overflowY: "auto" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" style={{ margin: '16px' }}>
                        <div className="modal-content" style={{ borderRadius: '20px' }}>
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                                <h5 className="modal-title"><BsShieldCheck className="me-2" /> Courier Verification Report</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowVerifyModal(false)}></button>
                            </div>
                            <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                                {verifyLoading ? (
                                    <div className="text-center py-5"><FaSpinner className="fa-spin me-2" size={40} /><p className="mt-3">Fetching courier data...</p></div>
                                ) : verifyError ? (
                                    <div className="alert alert-danger text-center">{verifyError}</div>
                                ) : verifyData?.data ? (
                                    <>
                                        {verifyData.risk_verdict && (() => {
                                            const risk = getRiskColor(verifyData.risk_verdict.level);
                                            return (
                                                <div className="card mb-4 border-0 shadow-sm" style={{ background: risk.bg, borderRadius: '16px' }}>
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="rounded-circle p-3" style={{ background: risk.text + '20' }}><BsShieldCheck size={30} color={risk.text} /></div>
                                                            <div><h5 className="mb-1" style={{ color: risk.text }}>{risk.label}</h5>
                                                            <p className="mb-0">{verifyData.risk_verdict.action}</p></div>
                                                        </div>
                                                        {verifyData.risk_verdict.reasons && <ul className="mt-3 mb-0"><li>{verifyData.risk_verdict.reasons[0]}</li></ul>}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        
                                        {verifyData.data.summary && (
                                            <div className="row g-3 mb-4">
                                                <div className="col-6 col-md-4"><div className="card border-0 shadow-sm text-center p-3"><h3 className="text-primary mb-0">{verifyData.data.summary.total_parcel}</h3><small>Total Parcels</small></div></div>
                                                <div className="col-6 col-md-4"><div className="card border-0 shadow-sm text-center p-3"><h3 className="text-success mb-0">{verifyData.data.summary.success_parcel}</h3><small>Successful</small></div></div>
                                                <div className="col-6 col-md-4"><div className="card border-0 shadow-sm text-center p-3"><h3 className="text-warning mb-0">{verifyData.data.summary.success_ratio}%</h3><small>Success Rate</small></div></div>
                                            </div>
                                        )}
                                        
                                        <h6 className="fw-bold mb-3">Courier Performance</h6>
                                        <div className="row g-3">
                                            {verifyData.data && Object.entries(verifyData.data).map(([key, courier]) => {
                                                if (key === 'summary' || !courier.total_parcel) return null;
                                                return (
                                                    <div className="col-sm-6" key={key}>
                                                        <div className="card border-0 shadow-sm h-100">
                                                            <div className="card-body">
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                    <img src={courier.logo} alt={courier.name} style={{ width: "30px", height: "30px" }} onError={(e) => e.target.style.display = 'none'} />
                                                                    <strong className="text-capitalize">{courier.name}</strong>
                                                                </div>
                                                                <div className="small"><div>📦 Total: {courier.total_parcel}</div><div>✅ Success: {courier.success_parcel}</div></div>
                                                                <div className="progress mt-2" style={{ height: "6px" }}><div className="progress-bar bg-success" style={{ width: `${courier.success_ratio}%` }}></div></div>
                                                                <div className="mt-1 text-end small">{courier.success_ratio}% success</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="alert alert-info text-center">No verification data available</div>
                                )}
                            </div>
                            <div className="modal-footer border-0"><button className="btn btn-secondary" style={{ borderRadius: '10px' }} onClick={() => setShowVerifyModal(false)}>Close</button></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tracking Modal */}
            {showTrackingModal && trackingData && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ margin: '16px' }}>
                        <div className="modal-content" style={{ borderRadius: '20px' }}>
                            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: 'white', borderRadius: '20px 20px 0 0' }}>
                                <h5 className="modal-title"><BsTruck className="me-2" /> Order Tracking Status</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowTrackingModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                {[{ label: "Picked", value: trackingData.Pick, time: trackingData.PickTime }, { label: "In Transit", value: trackingData.inTransit, time: trackingData.inTransitTime }, { label: "Out For Delivery", value: trackingData.PickedForDelivery, time: trackingData.PickedForDeliveryTime }, { label: "Delivered", value: trackingData.Delivered, time: trackingData.DeliveredTime }, { label: "Returned", value: trackingData.Returned, time: trackingData.ReturnedTime }].map((status, idx) => (
                                    status.value && <div key={idx} className="border-start border-3 border-primary ps-3 mb-3 py-1"><strong>{status.label}</strong><div className="small text-muted">{status.value} {status.time && `- ${status.time}`}</div></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: 99999 }}>
                    <div className={`toast show shadow-lg border-0`} style={{ background: toast.type === 'error' ? '#ef4444' : '#10b981', borderRadius: '12px' }}>
                        <div className="toast-body text-white">{toast.message}</div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Orderlist;