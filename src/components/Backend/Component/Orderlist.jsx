import { useState } from "react";
import Layout from "./Layout";
import jsPDF from "jspdf";
import "jspdf-autotable";

import icon from "../../../assets/images/Logo Icon.png";
import Footer from "../Footer";
import DashNav from "./DashNav";

const Orderlist = () => {
  const [formData, setFormData] = useState({
    companyName: "Paperfly",
    invoiceNo: "04-27-25-01",
    date: "",
    customerName: "",
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
    const totalPrice = price * itemCount;
    return totalPrice - (totalPrice * discount) / 100;
  };

  const calculateDue = () => {
    const discountedPrice = calculateDiscountedPrice();
    const paidAmount = parseFloat(formData.pay) || 0;
    return discountedPrice - paidAmount;
  };

  const generateInvoice = async () => {
    const { companyName, invoiceNo, date, customerName, price, discount, itemCount, pay } = formData;

    if (!companyName || !invoiceNo || !date || !customerName || !price || !discount || !itemCount) {
      alert("Please fill in all required fields.");
      return;
    }

    const doc = new jsPDF();

    const marginTop = 20;
    const marginLeft = 20;
    const marginBottom = 20;
    const marginRight = 20;

    doc.setFontSize(20);
    doc.text("Invoice", doc.internal.pageSize.width / 2, marginTop, { align: "center" });

    const img = new Image();
    img.src = icon;
    img.onload = () => {
      const imgWidth = 25;
      const imgHeight = 25;
      const pageWidth = doc.internal.pageSize.width;
      const imgX = pageWidth - imgWidth - marginRight;
      const imgY = marginTop + 10;

      doc.addImage(img, "PNG", imgX, imgY, imgWidth, imgHeight);

      doc.setFontSize(12);
      doc.text(`Company Name: ${companyName || "N/A"}`, marginLeft, marginTop + 40);
      doc.text(`Date: ${date || "N/A"}`, marginLeft, marginTop + 50);
      doc.text(`Invoice No: ${invoiceNo || "N/A"}`, marginLeft, marginTop + 60);

      doc.text(`Price: $${price || 0} per item`, marginLeft, marginTop + 70);
      doc.text(`Discount: ${discount || 0}%`, marginLeft, marginTop + 80);
      doc.text(`Item Count: ${itemCount || 1}`, marginLeft, marginTop + 90);
      doc.text(`Total Price After Discount: $${calculateDiscountedPrice()}`, marginLeft, marginTop + 100);
      doc.text(`Amount Paid: $${pay || 0}`, marginLeft, marginTop + 110);
      doc.text(`Due: $${calculateDue()}`, marginLeft, marginTop + 120);

      const tableColumn = ["#", "Order ID", "Customer", "Date", "Price", "Discount", "Item Count", "Total", "Paid", "Due"];
      const tableRows = [
        [
          1,
          invoiceNo || "N/A",
          customerName || "N/A",
          date || "N/A",
          `$${price || 0}`,
          `${discount || 0}%`,
          itemCount || 1,
          `$${calculateDiscountedPrice()}`,
          `$${pay || 0}`,
          `$${calculateDue()}`,
        ],
      ];

      doc.autoTable({
        startY: marginTop + 130,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        styles: { fontSize: 10 },
      });

      const finalY = doc.lastAutoTable.finalY || (marginTop + 130);
      doc.text(`Total Orders: 1`, marginLeft, finalY + 10);

      const pageHeight = doc.internal.pageSize.height;
      const rightMargin = doc.internal.pageSize.width - marginRight;
      doc.text("Author Sign: ____________________", rightMargin, pageHeight - marginBottom, { align: "right" });
      doc.text(`Date: ${date || "N/A"}`, rightMargin, pageHeight - marginBottom + 10, { align: "right" });

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

        {/* Invoice Form */}
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="companyName" className="form-label">
                Company Name
              </label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="invoiceNo" className="form-label">
                Invoice Number
              </label>
              <input
                type="text"
                className="form-control"
                id="invoiceNo"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Customer Name and Date */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="customerName" className="form-label">
                Customer Name
              </label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Price and Discount Side by Side */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="price" className="form-label">
                Price per item
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="discount" className="form-label">
                Discount (%)
              </label>
              <input
                type="number"
                className="form-control"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Item Count */}
         

         <div className='row'>
            
         <div className="col-md-6 mb-3">
            <label htmlFor="itemCount" className="form-label">
              Item Count
            </label>
            <input
              type="number"
              className="form-control"
              id="itemCount"
              name="itemCount"
              value={formData.itemCount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount Paid */}
          <div className="col-md-6 mb-3">
            <label htmlFor="pay" className="form-label">
              Amount Paid
            </label>
            <input
              type="number"
              className="form-control"
              id="pay"
              name="pay"
              value={formData.pay}
              onChange={handleChange}
            />
          </div>

         </div>

          {/* Invoice Details Table */}
          <h4 className="mt-4 text-center mb-2">Invoice Details</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Price per item</th>
                <th>Customer</th>
                <th>Discount</th>
                <th>Item Count</th>
                <th>Total Price After Discount</th>
                <th>Amount Paid</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formData.invoiceNo}</td>
                <td>৳ {formData.price || 0}</td>
                <td>{formData.customerName}</td>
                <td>{formData.discount || 0}%</td>
                <td>{formData.itemCount || 1}</td>
                <td>৳ {calculateDiscountedPrice()}</td>
                <td>৳ {formData.pay || 0}</td>
                <td>৳ {calculateDue()}</td>
              </tr>
            </tbody>
          </table>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-primary" onClick={generateInvoice}>
              Download Invoice
            </button>
           
          </div>
        </form>
      </div>
      <Footer />
    </Layout>
  );
};

export default Orderlist;
