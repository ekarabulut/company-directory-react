import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner'
import { toast } from 'react-toastify';
import { getUrl } from '../utils/urlUtils';

const AddEditPersonnelModal = ({ departmentsData, isPersonnelEditMode, personnelToHandle, setPersonnelData, setPersonnelToHandle, setTriggerPersonnel }) => { 
  const newPersonnel = {
    firstName: "", lastName: "", jobTitle: "", email: "",
    departmentID: departmentsData && departmentsData.length > 0 ? departmentsData[0].id : 0
  }
  const [personnel, setPersonnel] = useState(isPersonnelEditMode ? personnelToHandle : newPersonnel);
  const [loading, setLoading] = useState(false);

  const dismissBtnRef = useRef(null); 
  // Update personnel state when personnelData or personnelToHandle changes
  useEffect(() => {
    setPersonnel(isPersonnelEditMode ? personnelToHandle : newPersonnel);
  }, [isPersonnelEditMode, personnelToHandle]);  

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPersonnel((prev) => ({ ...prev, [name]: value }));
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (dismissBtnRef.current) {
      dismissBtnRef.current.click();
    }
    setLoading(true);
    // Save personnel data logic here (can be add or edit based on isPersonnelEditMode)
    let url = getUrl("upsert.php");
    let postData = {
      isEditMode: isPersonnelEditMode, // Data to send to PHP script
      id: personnel.id || null,
      firstName: personnel.firstName,
      lastName: personnel.lastName,
      jobTitle: personnel.jobTitle,
      email: personnel.email,
      departmentID: personnel.departmentID,
      tCode: "p"
    };
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const resolveAfterSave = new Promise((resolve, reject) => {
      axios
        .post(url, postData, options)
        .then((response) => {           
          setPersonnelToHandle(personnel);         
          setTriggerPersonnel(prev => !prev);                   
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          setLoading(false);         
          reject();          
        })
    });

    toast.promise(
      resolveAfterSave,
      {
        pending: 'Saving ...',
        success: 'Successfully saved.',
        error: 'Failed to save.'
      },
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      }
    )
    
  };

  return (
    <>
      <div        
        id="addEditPersonnelModal"
        className="modal fade"
        tabIndex="-1"
        data-bs-backdrop="false"
        data-bs-keyboard="false"
        aria-labelledby="addEditModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow">
            <div className="modal-header bg-primary bg-gradient text-white">
              <h5 className="modal-title">{personnelToHandle.id > 0 ? "Edit" : "New"} employee</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form id="editPersonnelForm" onSubmit={handleSave}>
                <input type="hidden" id="editPersonnelEmployeeID" />

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="editPersonnelFirstName"
                    placeholder="First name"
                    name="firstName"
                    value={personnel.firstName}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="editPersonnelFirstName">First name</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="editPersonnelLastName"
                    placeholder="Last name"
                    name="lastName"
                    value={personnel.lastName}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="editPersonnelLastName">Last name</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="editPersonnelJobTitle"
                    placeholder="Job title"
                    name="jobTitle"
                    value={personnel.jobTitle}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="editPersonnelJobTitle">Job Title</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="editPersonnelEmailAddress"
                    placeholder="Email address"
                    name="email"
                    value={personnel.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="editPersonnelEmailAddress">Email Address</label>
                </div>

                <div className="form-floating">
                  <select
                    className="form-select"
                    id="editPersonnelDepartment"
                    placeholder="Department"
                    name="departmentID"
                    value={personnel.departmentID}
                    onChange={handleChange}
                  >
                    {
                      departmentsData.map((department, index) => {
                        return (
                          <option key={index} value={department.id}>{department.name}</option>
                        )                        
                      })
                    }
                  </select>
                  <label htmlFor="editPersonnelDepartment">Department</label>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                form="editPersonnelForm"
                className="btn btn-outline-primary btn-sm myBtn"                
              >
                SAVE
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm myBtn"
                data-bs-dismiss="modal"   
                ref={dismissBtnRef} 
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>      
      {loading && <Spinner />}
    </>
   
  );
};

export default AddEditPersonnelModal;
