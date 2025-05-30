import React, { Fragment, useState } from "react";
import "../App.css";

//Had the help of https://www.youtube.com/watch?v=5vF0FGfa0RQ throughout

const EditModule = ({ module }) => {
  // State for module name and code, initialised with existing module values
  const [mod_name, setModName] = useState(module.mod_name);
  const [mod_cod, setModCode] = useState(module.mod_cod);

  /**
   * Function to edit the module by sending a PUT request to the backend.
   * It includes a JWT token for authentication.
   */

  // Edit module function with JWT token
  const editModule = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const body = { mod_cod, mod_name }; // Create request body

      const res = await fetch(`http://localhost:5001/modules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Ensure JSON format
          token: token, // Attach authentication token
        },
        body: JSON.stringify(body), // Convert object to JSON format
      });

      if (res.ok) {
        console.log("Module updated successfully");
      } else {
        console.error("Failed to update module");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      {/* Button to trigger modal */}
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${module.mod_id}`}
      >
        Edit
      </button>

      {/* Modal for editing the module, helped with https://www.w3schools.com/howto/howto_css_modals.asp */}
      <div className="modal" id={`id${module.mod_id}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Edit Module</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setModName(module.mod_name);
                  setModCode(module.mod_cod);
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body for Module Code */}
            <div className="modal-body">
              <label>Module Code</label>
              <input
                type="text"
                className="form-control"
                value={mod_cod}
                onChange={(e) => setModCode(e.target.value)}
              />
            </div>

            {/* Modal Body for Module Name */}
            <div className="modal-body">
              <label>Module Name</label>
              <input
                type="text"
                className="form-control"
                value={mod_name}
                onChange={(e) => setModName(e.target.value)}
              />
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              {/* Save Changes Button */}
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={() => editModule(module.mod_id)}
              >
                Save Changes
              </button>
              {/* Close Button - Resets fields to original values */}
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => {
                  setModName(module.mod_name);
                  setModCode(module.mod_cod);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditModule;
