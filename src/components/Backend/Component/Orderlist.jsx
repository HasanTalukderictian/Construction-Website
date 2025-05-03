import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import icon from "../../../assets/images/Logo Icon.png";
import Layout from "./Layout";
import DashNav from "./DashNav";
import Footer from "../Footer";

const Orderlist = () => {
  const [formData, setFormData] = useState({
    companyName: "Paperfly Private Limited",
    address: "Behind the SKS Tower, Dhaka, Bangladesh",
    companyPhone: "01768712230",
    invoiceNo: "04-27-25-01",
    date: "",
    customerName: "",
    productName: "",
    price: "",
    discount: "",
    itemCount: "",
    pay: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateDiscountedPrice = () => {
    const { price, discount, itemCount } = formData;
    const totalPrice = parseFloat(price) * parseInt(itemCount);
    return totalPrice - (totalPrice * parseFloat(discount)) / 100;
  };

  const calculateDue = () => {
    const discountedPrice = calculateDiscountedPrice();
    const paidAmount = parseFloat(formData.pay) || 0;
    return discountedPrice - paidAmount;
  };

  const generateInvoice = () => {
    const {
      companyName,
      invoiceNo,
      date,
      customerName,
      productName,
      price,
      discount,
      itemCount,
      pay,
    } = formData;

    if (!companyName || !invoiceNo || !date || !customerName || !price || !discount || !itemCount || !productName) {
      alert("Please fill in all required fields.");
      return;
    }

    const doc = new jsPDF();
    const marginLeft = 20;
    const marginRight = 20;
    const pageWidth = doc.internal.pageSize.width;
    const marginBottom = 20;

    // Green Header
    doc.setFillColor(9, 141, 49);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(companyName, pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(formData.address, pageWidth / 2, 26, { align: "center" });
    doc.text(`Phone: ${formData.companyPhone}`, pageWidth / 2, 31, { align: "center" });

    // Add logo
    const img = new Image();
    img.src = icon;
    img.onload = () => {
      const imgWidth = 10;
      const imgHeight = 10;
      const imgX = pageWidth - imgWidth - marginRight;
      const imgY = 2.5;
      doc.addImage(img, "PNG", imgX, imgY, imgWidth, imgHeight);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      const yStart = 50;

      doc.text(`Company Name: ${companyName}`, marginLeft, yStart);
      doc.text(`Date: ${date}`, marginLeft, yStart + 10);
      doc.text(`Invoice No: ${invoiceNo}`, marginLeft, yStart + 20);
      doc.text(`Product Name: ${productName}`, marginLeft, yStart + 30);
      doc.text(`Price: $${price} per item`, marginLeft, yStart + 40);
      doc.text(`Discount: ${discount}%`, marginLeft, yStart + 50);
      doc.text(`Item Count: ${itemCount}`, marginLeft, yStart + 60);
      doc.text(`Total Price After Discount: $${calculateDiscountedPrice().toFixed(2)}`, marginLeft, yStart + 70);
      doc.text(`Amount Paid: $${pay}`, marginLeft, yStart + 80);
      doc.text(`Due: $${calculateDue().toFixed(2)}`, marginLeft, yStart + 90);

      // Table
      const tableColumn = ["Order ID", "Customer", "Date", "Price", "Discount", "Item Count", "Total", "Paid", "Due"];
      const tableRows = [[
        invoiceNo,
        customerName,
        date,
        `$${price}`,
        `${discount}%`,
        itemCount,
        `$${calculateDiscountedPrice().toFixed(2)}`,
        `$${pay}`,
        `$${calculateDue().toFixed(2)}`
      ]];

      doc.autoTable({
        startY: yStart + 100,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        headStyles: {
          fillColor: [9, 141, 49],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
      });

      const finalY = doc.lastAutoTable.finalY || (yStart + 100);
      doc.text(`Total Orders: 1`, marginLeft, finalY + 10);

      const rightMargin = doc.internal.pageSize.width - marginRight;
      const pageHeight = doc.internal.pageSize.height;
      doc.text("Author Sign: ____________________", rightMargin, pageHeight - marginBottom, { align: "right" });
      doc.text(`Date: ${date}`, rightMargin, pageHeight - marginBottom + 10, { align: "right" });

      doc.save(`${customerName}-invoice.pdf`);
    };
  };

  return (
    <Layout>
      <DashNav />
      <div className="container mt-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="me-3">Generate Invoice</h2>
          <img
            src={icon}
            alt="Logo Icon"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>

        <form>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Invoice Number</label>
              <input
                type="text"
                className="form-control"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Product Name</label>
              <select
                className="form-control"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              >
                <option value="">Select Product</option>
                <option value="Shirt">Shirt</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Jeans">Jeans</option>
                <option value="Bags">Bags</option>
                <option value="Shoes">Shoes</option>
                <option value="Panjabis">Panjabis</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Discount (%)</label>
              <input
                type="number"
                className="form-control"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Item Count</label>
              <input
                type="number"
                className="form-control"
                name="itemCount"
                value={formData.itemCount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Amount Paid</label>
              <input
                type="number"
                className="form-control"
                name="pay"
                value={formData.pay}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="button" className="btn btn-success mt-3" onClick={generateInvoice}>
            Generate Invoice PDF
          </button>
        </form>
      </div>
      <Footer />
    </Layout>
  );
};

export default Orderlist;

