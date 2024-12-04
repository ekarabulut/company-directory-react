import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner'
import { toast } from 'react-toastify';
import { getUrl } from '../utils/urlUtils';

const AddEditDepartmentModal = ({ locationsData, isDepartmentEditMode, departmentToHandle, setTriggerPersonnel, setTriggerDepartments }) => { 
  const newDepartment = {
    name: "", location: "",
    locationID: Array.isArray(locationsData) && locationsData.length > 0 ? locationsData[0].id : 0
  }
  const [department, setDepartment] = useState(isDepartmentEditMode ? departmentToHandle : newDepartment);
  const [loading, setLoading] = useState(false);

  const dismissBtnRef = useRef(null); 

  useEffect(() => {
    setDepartment(isDepartmentEditMode ? departmentToHandle : newDepartment);
  }, [isDepartmentEditMode, departmentToHandle]);  

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (dismissBtnRef.current) {
      dismissBtnRef.current.click();
    }
    setLoading(true);
    let url = getUrl("upsert.php");
    let postData = {
      isEditMode: isDepartmentEditMode, 
      id: department.id || null,
      name: department.name,     
      locationID: department.locationID,
      tCode: "d"
    };
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const resolveAfterDepartmentSave = new Promise((resolve, reject) => {
      axios
        .post(url, postData, options)
        .then(() => { 
          setTriggerPersonnel(prev => !prev);
          setTriggerDepartments(prev => !prev);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          setLoading(false);
          reject();                   
        })
    });

    toast.promise(
      resolveAfterDepartmentSave,
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
        id="addEditDepartmentModal"
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
              <h5 className="modal-title">{departmentToHandle.id > 0 ? "Edit" : "New"} department</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form id="editDepartmentForm" onSubmit={handleSave}>
                <input type="hidden" id="editDepartmentID" />
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="editDepartmentName"
                    placeholder="name"
                    name="name"
                    value={department.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="editDepartmentName">Name</label>
                </div>
                
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="editDepartmentLocation"
                    placeholder="Location"
                    name="locationID"
                    value={department.locationID}
                    onChange={handleChange}
                  >
                    {
                      locationsData.map((location, index) => {
                        return (
                          <option key={index} value={location.id}>{location.name}</option>
                        )                        
                      })
                    }
                  </select>
                  <label htmlFor="editDepartmentLocation">Location</label>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                form="editDepartmentForm"
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

export default AddEditDepartmentModal;
