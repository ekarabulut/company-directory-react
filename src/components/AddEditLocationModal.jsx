import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner'
import { toast } from 'react-toastify';
import { getUrl } from '../utils/urlUtils';

const AddEditLocationModal = ({ isLocationEditMode, locationToHandle,  setTriggerPersonnel, setTriggerDepartments, setTriggerLocations }) => { 
  const newLocation = { name: "" }
  const [location, setLocation] = useState(isLocationEditMode ? locationToHandle : newLocation);
  const [loading, setLoading] = useState(false);

  const dismissBtnRef = useRef(null); 

  useEffect(() => {
    setLocation(isLocationEditMode ? locationToHandle : newLocation);
  }, [isLocationEditMode, locationToHandle]);  

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLocation((prev) => ({ ...prev, [name]: value }));
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (dismissBtnRef.current) {
      dismissBtnRef.current.click();
    }
    setLoading(true);
    let url = getUrl("upsert.php");
    let postData = {
      isEditMode: isLocationEditMode, 
      id: location.id || null,
      name: location.name,  
      tCode: "l"
    };
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const resolveAfterLocationSave = new Promise((resolve, reject) => {
      axios
        .post(url, postData, options)
        .then(() => { 
          setTriggerPersonnel(prev => !prev);
          setTriggerDepartments(prev => !prev);
          setTriggerLocations(prev => !prev);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          setLoading(false);         
          reject();          
        })
    });

    toast.promise(
      resolveAfterLocationSave,
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
        id="addEditLocationModal"
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
              <h5 className="modal-title">{locationToHandle.id > 0 ? "Edit" : "New"} location</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form id="editLocationForm" onSubmit={handleSave}>
                <input type="hidden" id="editFormID" />
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="editLocationName"
                    placeholder="Name"
                    name="name"
                    value={location.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="editLocationName">Name</label>
                </div>                               
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                form="editLocationForm"
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

export default AddEditLocationModal;
