import { useState } from "react";
import Layout from "./Layout";
import jsPDF from "jspdf";
import "jspdf-autotable";

import icon from "../../../assets/images/Logo Icon.png";
import Footer from "../Footer";

const Orderlist = () => {
  const [formData, setFormData] = useState({
    companyName: "", 
    invoiceNo: "", 
    date: "", 
    customerName: "", 
    price: "", 
    discount: "", 
    itemCount: "", 
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate price after discount and based on item count
  const calculateDiscountedPrice = () => {
    const { price, discount, itemCount } = formData;
    const totalPrice = price * itemCount;
    return totalPrice - (totalPrice * discount) / 100;
  };

  const generateInvoice = async () => {
    const doc = new jsPDF();
    
    // Add a title
    doc.setFontSize(20);
    doc.text("Invoice", 105, 20, { align: "center" });
  
    // Add the circular logo image
    const img = new Image();
    img.src = icon;
    img.onload = () => {
      const imgSize = 20; // Diameter of the circle
      const imgX = (doc.internal.pageSize.width - imgSize) / 2; // Center the image horizontally
      const imgY = 30; // Y position
  
      // Draw the image as a circle (adjusted positioning to center)
      doc.ellipse(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, imgSize / 2, "F");
      doc.addImage(img, "PNG", imgX, imgY, imgSize, imgSize);
  
      // Add company info without margin
      doc.setFontSize(12);
      doc.text(`Company Name: ${formData.companyName || "N/A"}`, 10, 60); // Adjusted Y to remove margin
      doc.text(`Date: ${formData.date || "N/A"}`, 10, 70);
      doc.text(`Invoice No: ${formData.invoiceNo || "N/A"}`, 10, 80);
  
      // Add price, discount, item count, and total price info
      doc.text(`Price: $${formData.price || 0} per item`, 10, 90);
      doc.text(`Discount: ${formData.discount || 0}%`, 10, 100);
      doc.text(`Item Count: ${formData.itemCount || 1}`, 10, 110);
      doc.text(`Total Price After Discount: $${calculateDiscountedPrice()}`, 10, 120);
  
      // Generate the order details using the input values
      const tableColumn = ["#", "Order ID", "Customer", "Date", "Price", "Discount", "Item Count", "Total Price After Discount"];
      const tableRows = [
        [
          1, // Order number (can be static or dynamically generated)
          formData.invoiceNo || "N/A", // Order ID
          formData.customerName || "N/A", // Customer Name
          formData.date || "N/A", // Date
          `$${formData.price || 0}`, // Price
          `${formData.discount || 0}%`, // Discount
          formData.itemCount || 1, // Item Count
          `$${calculateDiscountedPrice()}`, // Total Price After Discount
        ],
      ];
  
      doc.autoTable({
        startY: 130,  // Adjusted where the table will start
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        styles: { fontSize: 10 },
      });
  
      // Add a footer with total
      const finalY = doc.lastAutoTable.finalY || 130;
      doc.text(`Total Orders: 1`, 10, finalY + 10); // Only one order in this case, can adjust for multiple orders
  
      // Add "Author Sign" and "Date" at the bottom right corner
      const pageHeight = doc.internal.pageSize.height;
      const rightMargin = doc.internal.pageSize.width - 10; // Right margin of 10 units
      doc.text("Author Sign: ____________________", rightMargin, pageHeight - 20, { align: "right" });
      doc.text(`Date: ${formData.date || "N/A"}`, rightMargin, pageHeight - 10, { align: "right" });
  
      // Save the PDF
      doc.save(`${formData.customerName}-invoice.pdf`);
    };
  };
  
  
  
  return (
    <Layout>
      <div className="container mt-4">
        <div className="d-flex align-items-center mb-4">
          <h2 className="me-3">Generate Invoice</h2>
          <img
            src={icon}
            alt="Logo Icon"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Invoice Form */}
        <form className="">
          <div className="">
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
            />
          </div>
          <div className="mb-3">
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
            />
          </div>
          <div className="mb-3">
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
            />
          </div>
          <div className="mb-3">
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
            />
          </div>
          <div className="mb-3">
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
            />
          </div>
          <div className="mb-3">
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
            />
          </div>
          <div className="mb-3">
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
            />
          </div>

          {/* Invoice Details Table */}
          <h4 className="mt-4 text-center mb-2" >Invoice Details</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Price per item</th>
                <th>Customer</th>
                <th>Discount</th>
                <th>Item Count</th>
                <th>Total Price After Discount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formData.invoiceNo || 0}</td>
                <td>${formData.price || 0}</td>
                <td>{formData.customerName}</td>
                <td>{formData.discount || 0}%</td>
                <td>{formData.itemCount || 1}</td>
                <td>${calculateDiscountedPrice()}</td>
              </tr>
            </tbody>
          </table>

          <button type="button" className="btn btn-primary" onClick={generateInvoice}>
            Generate Invoice PDF
          </button>
        </form>
      </div>

      <Footer/>
    </Layout>
  );
};

export default Orderlist;
