import { useState, useRef } from "react";
import axios from 'axios';
import Spinner from './Spinner'
import { toast } from 'react-toastify';
import { getUrl } from '../utils/urlUtils';

const LocationsTable = ({ departmentsData, locationsData, searchParams, setIsLocationEditMode, setLocationsData, setLocationToHandle }) => {
  const [locationToDelete, setLocationToDelete] = useState({});
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDeleteOk, setIsDeleteOk] = useState(true);
  const [loading, setLoading] = useState(false);
  const dismissBtnRef = useRef(null); 

  const filterAfterSearch = (location) => {       
    return location.name.toLowerCase().includes(searchParams.searchText.toLowerCase());      
  }

  const filteredLocationsBySearch = locationsData.filter(filterAfterSearch);

  const checkForDelete = (location) => {
    let filteredDepartmentsData = departmentsData.filter((d) => d.locationID == location.id);
    if (filteredDepartmentsData.length > 0) {
      setIsDeleteOk(false);
      setDeleteMessage(
        <>
          You cannot delete the location record for <span className="fw-bold">{location.name}</span> because it has <span className="fw-bold">{filteredDepartmentsData.length}</span> department(s) assigned to it.
        </>
      );
    }
    else {
      setIsDeleteOk(true);
      setDeleteMessage(
        <>
          Are you sure you want to delete the location record for <span className='fw-bold'>{location.name}</span>?
        </>
      );
    }
    setLocationToDelete({ id: location.id, name: location.name });
  }

  const handleLocationDelete = () => {
    if (dismissBtnRef.current) {
      dismissBtnRef.current.click();
    }
    setLoading(true);
    let url = getUrl("deleteByID.php/l", locationToDelete.id);
    
    const resolveAfterLocationDelete = new Promise((resolve, reject) => {
      axios
        .delete(url) 
        .then((response) => {          
          const filteredLocationsData = locationsData.filter((l) => l.id != locationToDelete.id);
          setLocationsData(filteredLocationsData);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          setLoading(false);   
          reject();                
        })
    });

    toast.promise(
      resolveAfterLocationDelete,
      {
        pending: 'Deleting ...',
        success: 'Successfully deleted.',
        error: 'Failed to delete.'
      },
      {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      }
    )
  }

  return (
    <>
      <div className="tab-pane" id="locations-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabIndex="0">
        <table className="table table-hover">
          <tbody id="locationTableBody">
            {filteredLocationsBySearch.length > 0 ?
              locationsData.filter(filterAfterSearch).map((location, index) => (
                <tr key={index}>
                  <td className="align-middle text-nowrap">{location.name}</td>
                  <td className="align-middle text-end text-nowrap">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#addEditLocationModal"
                      onClick={() => { setIsLocationEditMode(true); setLocationToHandle(location); }}
                    >
                      <i className="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-primary btn-sm btn-trash" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" onClick={() => checkForDelete(location)}>
                      <i className="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>
              )) : <>{ !loading && <tr><td className="align-middle text-nowrap text-center" colSpan="2">No results</td></tr>}</>
            }
          </tbody>
        </table>
      </div>
      <div        
        id="deleteLocationModal"
        className="modal fade"
        tabIndex="-1"
        data-bs-backdrop="false"
        data-bs-keyboard="false"
        aria-labelledby="deletePersonnelModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow">
            <div className="modal-header bg-warning bg-gradient text-white">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {deleteMessage}
            </div>

            <div className="modal-footer">
              <button
                type="submit"                
                className="btn btn-outline-primary btn-sm myBtn"     
                onClick={handleLocationDelete}
                hidden={!isDeleteOk}
              >
                YES
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm myBtn"
                data-bs-dismiss="modal"   
                ref={dismissBtnRef} 
              >
                {isDeleteOk ? 'NO' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      </div> 
      {loading && <Spinner />}
    </>    
  );
};

export default LocationsTable;
