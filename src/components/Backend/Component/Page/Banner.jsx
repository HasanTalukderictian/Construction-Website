import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../Layout";
import Footer from "../../Footer";
import DashNav from "../DashNav";

import '../../../../../src/assets/css/modal.scss';

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Form state
  const [Name, setName] = useState("");
  const [Designation, setDesignation] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/get-team`);
      const result = await response.json();
      const updatedTeams = result.data.map((member) => ({
        ...member,
        image: member.image ? `${BASE_URL}/storage/${member.image}` : null,
      }));
      setTeams(updatedTeams);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleShowModal = (member = null) => {
    if (member) {
      setName(member.Name);
      setDesignation(member.Designation);
      setSocialMediaLink(member.socialMediaLink);
      setEditMode(true);
      setTeamToEdit(member.id);
    } else {
      resetForm();
      setEditMode(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setSocialMediaLink("");
    setImage(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!Name.trim()) newErrors.Name = "Name is required.";
    if (!Designation.trim()) newErrors.Designation = "Designation is required.";
    if (!socialMediaLink.trim()) newErrors.socialMediaLink = "Social media link is required.";
    if (image && !["image/png", "image/jpeg"].includes(image.type)) {
      newErrors.image = "Only PNG or JPEG images are allowed.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("Designation", Designation);
    formData.append("socialMediaLink", socialMediaLink);
    if (image) formData.append("image", image);

    try {
      let response;
      if (editMode) {
        response = await fetch(`${BASE_URL}/api/edit-team/${teamToEdit}`, {
          method: "POST", // your route uses POST for update
          body: formData,
        });
      } else {
        response = await fetch(`${BASE_URL}/api/add-team`, {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        if (editMode) {
          setTeams(
            teams.map((t) =>
              t.id === teamToEdit
                ? { ...result.data, image: `${BASE_URL}/storage/${result.data.image}` }
                : t
            )
          );
        } else {
          setTeams([...teams, { ...result.data, image: `${BASE_URL}/storage/${result.data.image}` }]);
        }
        handleCloseModal();
      } else {
        setErrors(result.errors || {});
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleDeleteClick = (id) => {
    setTeamToDelete(id);
    setShowDialog(true);
  };

  const deleteTeamMember = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/del-team/${teamToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTeams(teams.filter((t) => t.id !== teamToDelete));
        setShowDialog(false);
      } else {
        console.error("Failed to delete team member");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setTeamToDelete(null);
  };

  return (
    <Layout>
      <DashNav />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Team Management</h2>
          <button className="btn btn-success" onClick={() => handleShowModal()}>
            + Add Member
          </button>
        </div>

        <table className="table table-bordered border-2">
          <thead className="thead-dark">
            <tr>
              <th className="text-center border border-dark fs-3">No</th>
              <th className="text-center border border-dark fs-3">Name</th>
              <th className="text-center border border-dark fs-3">Designation</th>
              <th className="text-center border border-dark fs-3">Social Media</th>
              <th className="text-center border border-dark fs-3">Picture</th>
              <th className="text-center border border-dark fs-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map((member, index) => (
                <tr key={member.id} className="border border-dark">
                  <td className="text-center border border-dark">{index + 1}</td>
                  <td className="border border-dark">{member.Name}</td>
                  <td className="border border-dark">{member.Designation}</td>
                  <td className="border border-dark">{member.socialMediaLink}</td>
                  <td className="border border-dark">
                    {member.image && (
                      <img
                        src={member.image}
                        className="img-fluid"
                        style={{ width: "80px", height: "80px" }}
                        alt="Team"
                      />
                    )}
                  </td>
                  <td className="border border-dark">
                    <button
                      className="btn btn-outline-secondary mx-2 "
                      onClick={() => handleShowModal(member)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDeleteClick(member.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center border border-dark">
                  No team members available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content custom-modal-width">
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      {errors.Name && <small className="text-danger">{errors.Name}</small>}
                    </div>

                    <div className="form-group">
                      <label>Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={Designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                      />
                      {errors.Designation && <small className="text-danger">{errors.Designation}</small>}
                    </div>

                    <div className="form-group">
                      <label>Social Media Link</label>
                      <input
                        type="url"
                        className="form-control"
                        value={socialMediaLink}
                        onChange={(e) => setSocialMediaLink(e.target.value)}
                        required
                      />
                      {errors.socialMediaLink && <small className="text-danger">{errors.socialMediaLink}</small>}
                    </div>

                    <div className="form-group mt-4">
                      <label>Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        className={`form-control ${errors.image ? "is-invalid" : ""}`}
                        onChange={handleImageChange}
                      />
                      {errors.image && <div className="invalid-feedback">{errors.image}</div>}

                      {image && (
                        <div className="position-relative mt-3" style={{ maxWidth: "150px" }}>
                          <img src={URL.createObjectURL(image)} alt="Preview" className="img-thumbnail" />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => setImage(null)}
                            style={{
                              borderRadius: "50%",
                              padding: "0 6px",
                              transform: "translate(50%, -50%)",
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editMode ? "Update Member" : "Add Member"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDialog && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content" >
                <div className="modal-body">
                  <p className="text-center text-danger font-weight-bold">
                    Are you sure you want to delete this member?
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeDialog}>
                    No
                  </button>
                  <button type="button" className="btn btn-danger" onClick={deleteTeamMember}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default Team;
