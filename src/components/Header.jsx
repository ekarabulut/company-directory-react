import { useEffect, useState } from "react";

const Header = ({ departmentsData, locationsData, searchParams, setSearchParams, setIsPersonnelEditMode, setPersonnelToHandle, setIsDepartmentEditMode, setDepartmentToHandle, setIsLocationEditMode, setLocationToHandle }) => {
  const [activeTab, setActiveTab] = useState('personnelBtn');
  const [targetModal, setTargetModal] = useState('#addEditPersonnelModal');

  useEffect(() => {
    switch (activeTab) {
      case 'personnelBtn':
        setTargetModal('#addEditPersonnelModal');
        break;
      case 'departmentsBtn':
        setTargetModal('#addEditDepartmentModal');
        break;
      case 'locationsBtn':
        setTargetModal('#addEditLocationModal');
        break;
      default:
        setTargetModal('#addEditPersonnelModal');
        break;
    }
  }, [activeTab]);

  const handleAdd = () => {
    switch (activeTab) {
      case 'personnelBtn':
        setIsPersonnelEditMode(false);
        setPersonnelToHandle({});
        break;
      case 'departmentsBtn':
        setIsDepartmentEditMode(false);
        setDepartmentToHandle({});
        break;
      case 'locationsBtn':
        setIsLocationEditMode(false);
        setLocationToHandle({});
        break;
      default:
        setIsPersonnelEditMode(false);
        setPersonnelToHandle({});
        break;
    }
  }  

  const handleFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <div className="appHeader">
        <div className="row">
          <div className="col">
            <input id="searchInp" className="form-control mb-3" placeholder="search" onChange={(e) => setSearchParams(prev => ({ ...prev, searchText: e.target.value })) } value={searchParams.searchText} />
          </div>
          <div className="col-6 text-end me-2">
            <div className="btn-group" role="group" aria-label="buttons">
              <button id="refreshBtn" type="button" className="btn btn-primary" onClick={() => setSearchParams({ searchText: '', filterDepartmentID: 0, filterLocationID: 0 })}>
                <i className="fa-solid fa-refresh fa-fw"></i>
              </button>
              <button id="filterBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#filtersModal" disabled={activeTab != 'personnelBtn'}>
                <i className="fa-solid fa-filter fa-fw"></i>
              </button>
              <button
                id="addBtn"
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target={targetModal}
                onClick={handleAdd}
              >
                <i className="fa-solid fa-plus fa-fw"></i>
              </button>
            </div>
          </div>
        </div>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="personnelBtn" data-bs-toggle="tab" data-bs-target="#personnel-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true" onClick={() => setActiveTab("personnelBtn")}>
              <i className="fa-solid fa-person fa-lg fa-fw"></i><span className="d-none d-sm-block">Personnel</span>
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="departmentsBtn" data-bs-toggle="tab" data-bs-target="#departments-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onClick={() => setActiveTab("departmentsBtn")}>
              <i className="fa-solid fa-building fa-lg fa-fw"></i><span className="d-none d-sm-block">Departments</span>
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="locationsBtn" data-bs-toggle="tab" data-bs-target="#locations-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false" onClick={() => setActiveTab("locationsBtn")}>
              <i className="fa-solid fa-map-location-dot fa-lg fa-fw"></i><span className="d-none d-sm-block">Locations</span>
            </button>
          </li>
        </ul>
      </div>
      <div        
        id="filtersModal"
        className="modal fade"
        tabIndex="-1"
        data-bs-backdrop="false"
        data-bs-keyboard="false"
        aria-labelledby="filtersModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-m modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow">
            <div className="modal-header bg-primary bg-gradient text-white">
              <h5 className="modal-title">Filter personnel</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    id="filterDepartment"
                    placeholder="Department"   
                    name="filterDepartmentID"
                    value={searchParams.filterDepartmentID}     
                    onChange={handleFilter}               
                  >
                    <option value={0}>All</option>
                    {
                      departmentsData.map((department, index) => {
                        return (
                          <option key={index} value={department.id}>{department.name}</option>
                        )                        
                      })
                    }
                  </select>
                  <label htmlFor="filterDepartment">Department</label>
                </div>
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="filterLocation"
                    placeholder="Department"   
                    name="filterLocationID"                 
                    value={searchParams.filterLocationID} 
                    onChange={handleFilter}
                  >
                    <option value={0}>All</option>
                    {
                      locationsData.map((location, index) => {
                        return (
                          <option key={index} value={location.id}>{location.name}</option>
                        )                        
                      })
                    }
                  </select>
                  <label htmlFor="filterLocation">Location</label>
                </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm myBtn"
                data-bs-dismiss="modal"                   
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div> 
    </>   
  );
};

export default Header;
