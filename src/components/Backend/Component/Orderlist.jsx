import Layout from "./Layout"


const Orderlist = () => {
  return (
   <Layout>
     <div className="container mt-4">
    <h2>Order List</h2>
    {/* Add your order list table or content here */}
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>12345</td>
          <td>John Doe</td>
          <td>Delivered</td>
          <td>2024-12-09</td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  </div>
   </Layout>
  )
}

export default Orderlist
