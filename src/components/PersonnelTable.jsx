import { useRef, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner'
import { toast } from 'react-toastify';
import { getUrl } from '../utils/urlUtils';

const PersonnelTable = ({ personnelData, searchParams, setIsPersonnelEditMode, setPersonnelToHandle, setPersonnelData }) => {
  const [personToDelete, setPersonToDelete] = useState({});
  const [loading, setLoading] = useState(false);
  const dismissBtnRef = useRef(null); 

  const filterAfterSearch = (personnel) => {       
    const isSearchTextIncluded = personnel.firstName.toLowerCase().includes(searchParams.searchText.toLowerCase()) ||
      personnel.lastName.toLowerCase().includes(searchParams.searchText.toLowerCase()) ||
      personnel.jobTitle.toLowerCase().includes(searchParams.searchText.toLowerCase()) ||
      personnel.department.toLowerCase().includes(searchParams.searchText.toLowerCase()) ||
      personnel.location.toLowerCase().includes(searchParams.searchText.toLowerCase());
    
    const isDepartmentMatched = searchParams.filterDepartmentID > 0 ? personnel.departmentID == searchParams.filterDepartmentID : true;
    const isLocationMatched = searchParams.filterLocationID > 0 ? personnel.locationID == searchParams.filterLocationID : true;

    return isSearchTextIncluded && isDepartmentMatched && isLocationMatched;
  }

  const filteredPersonnelBySearch = personnelData.filter(filterAfterSearch);

  const handlePersonnelDelete = () => {
    const filteredPersonnelData = personnelData.filter((p) => p.id != personToDelete.id);    
    if (dismissBtnRef.current) {
      dismissBtnRef.current.click();
    }
    setLoading(true);
    let url = getUrl("deleteByID.php/p", personToDelete.id);   
    
    const resolveAfterPersonnelDelete = new Promise((resolve, reject) => {
      axios
        .delete(url) 
        .then((response) => { 
          setPersonnelData(filteredPersonnelData);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          setLoading(false);   
          reject();                
        })
    });

    toast.promise(
      resolveAfterPersonnelDelete,
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
      <div className="tab-pane show active" id="personnel-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
        <table className="table table-hover">
          <tbody id="personnelTableBody">
            {filteredPersonnelBySearch.length > 0 ?
              filteredPersonnelBySearch.map((person, index) => (
                <tr key={index}>
                    <td className="align-middle text-nowrap">{person.lastName}, {person.firstName}</td>
                    <td className="align-middle text-nowrap d-none d-md-table-cell">{person.jobTitle}</td>
                    <td className="align-middle text-nowrap d-none d-md-table-cell">{person.department}</td>
                    <td className="align-middle text-nowrap d-none d-md-table-cell">{person.location}</td>
                    <td className="align-middle text-nowrap d-none d-md-table-cell">{person.email}</td>
                    <td className="text-end text-nowrap">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#addEditPersonnelModal"
                        onClick={() => { setIsPersonnelEditMode(true); setPersonnelToHandle(person); }}>
                        <i className="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-primary btn-sm btn-trash" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" onClick={() => setPersonToDelete({ id: person.id, firstName: person.firstName, lastName: person.lastName })}>
                      <i className="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>
              )) : <>{ !loading && <tr><td className="align-middle text-nowrap text-center" colSpan="6">No results</td></tr> }</>
            }
          </tbody>
        </table>
      </div>
      <div        
        id="deletePersonnelModal"
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
              Are you sure you want to delete the personnel record for <span className="fw-bold">{personToDelete.firstName} {personToDelete.lastName}?</span>
            </div>

            <div className="modal-footer">
              <button
                type="submit"                
                className="btn btn-outline-primary btn-sm myBtn"     
                onClick={handlePersonnelDelete}
              >
                YES
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm myBtn"
                data-bs-dismiss="modal"   
                ref={dismissBtnRef} 
              >
                NO
              </button>
            </div>
          </div>
        </div>
      </div> 
      {loading && <Spinner />}
    </>
  );
};

export default PersonnelTable;
