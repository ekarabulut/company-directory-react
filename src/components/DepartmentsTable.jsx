import { useState, useRef } from "react";
import axios from 'axios';
import Spinner from './Spinner'
import { toast } from 'react-toastify';
import { getUrl } from '../utils/urlUtils';

const DepartmentsTable = ({ personnelData, departmentsData, searchParams, setDepartmentsData, setIsDepartmentEditMode, setDepartmentToHandle }) => {
  const [departmentToDelete, setDepartmentToDelete] = useState({});
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDeleteOk, setIsDeleteOk] = useState(true);
  const [loading, setLoading] = useState(false);
  const dismissBtnRef = useRef(null); 

  const checkForDelete = (department) => {
    let filteredPersonnelData = personnelData.filter((p) => p.departmentID == department.id);
    if (filteredPersonnelData.length > 0) {
      setIsDeleteOk(false);
      setDeleteMessage(
        <>
          You cannot delete the department record for <span className="fw-bold">{department.name}</span> because it has <span className="fw-bold">{filteredPersonnelData.length}</span> personnel assigned to it.
        </>
      );
    }
    else {
      setIsDeleteOk(true);
      setDeleteMessage(
        <>
          Are you sure you want to delete the department record for <span className='fw-bold'>{department.name}</span>?
        </>
      );
    }
    setDepartmentToDelete({ id: department.id, name: department.name });
  }

  const filterAfterSearch = (department) => {       
    return department.name.toLowerCase().includes(searchParams.searchText.toLowerCase()) ||
      department.location.toLowerCase().includes(searchParams.searchText.toLowerCase());
  }

  const filteredDepartmentsBySearch = departmentsData.filter(filterAfterSearch);

  const handleDepartmentDelete = () => {
    if (dismissBtnRef.current) {
      dismissBtnRef.current.click();
    }
    setLoading(true);
    let url = getUrl("deleteByID.php/d", departmentToDelete.id);
    
    const resolveAfterDepartmentDelete = new Promise((resolve, reject) => {
      axios
        .delete(url) 
        .then((response) => {          
          const filteredDepartmentsData = departmentsData.filter((d) => d.id != departmentToDelete.id);
          setDepartmentsData(filteredDepartmentsData);
          setLoading(false);
          resolve();
        })
        .catch((error) => {
          setLoading(false);   
          reject();                
        })
    });

    toast.promise(
      resolveAfterDepartmentDelete,
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
      <div className="tab-pane" id="departments-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
        <table className="table table-hover">
          <tbody id="departmentTableBody">
            {filteredDepartmentsBySearch.length > 0 ?
              departmentsData.filter(filterAfterSearch).map((department, index) => (
                <tr key={index}>
                  <td className="align-middle text-nowrap">{department.name}</td>
                  <td className="align-middle text-nowrap d-none d-md-table-cell">{department.location}</td>
                  <td className="align-middle text-end text-nowrap">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#addEditDepartmentModal"
                      onClick={() => { setIsDepartmentEditMode(true); setDepartmentToHandle(department); }}
                    >
                      <i className="fa-solid fa-pencil fa-fw"></i>
                    </button>
                    <button type="button" className="btn btn-primary btn-sm btn-trash" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" onClick={() => checkForDelete(department)}>
                      <i className="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>
              )) : <>{ !loading && <tr><td className="align-middle text-nowrap text-center" colSpan="3">No results</td></tr> }</>
            }            
          </tbody>
        </table>
      </div>
      <div        
        id="deleteDepartmentModal"
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
                onClick={handleDepartmentDelete}
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

export default DepartmentsTable;
