import { useEffect, useState } from 'react';
import AddEditPersonnelModal from './components/AddEditPersonnelModal';
import AddEditDepartmentModal from './components/AddEditDepartmentModal';
import AddEditLocationModal from './components/AddEditLocationModal';
import Header from './components/Header';
import PersonnelTable from './components/PersonnelTable';
import DepartmentsTable from './components/DepartmentsTable';
import LocationsTable from './components/LocationsTable';
import Footer from './components/Footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './components/Loading';
import { getUrl } from './utils/urlUtils';

function App() {  

  const [personnelData, setPersonnelData] = useState([]); 
  const [departmentsData, setDepartmentsData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
    
  const [personnelToHandle, setPersonnelToHandle] = useState( { firstName: '', lastName: '', jobTitle: '', email: '', departmentID: 0, department: '', locationID:0, location: '' })
  const [isPersonnelEditMode, setIsPersonnelEditMode] = useState(false);
 
  const [departmentToHandle, setDepartmentToHandle] = useState( { name: '', locationID: '', location: '' })
  const [isDepartmentEditMode, setIsDepartmentEditMode] = useState(false);

  const [locationToHandle, setLocationToHandle] = useState( { name: '' })
  const [isLocationEditMode, setIsLocationEditMode] = useState(false);

  const [triggerPersonnel, setTriggerPersonnel] = useState(false);
  const [triggerDepartments, setTriggerDepartments] = useState(false);
  const [triggerLocations, setTriggerLocations] = useState(false);

  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useState({ searchText: '', filterDepartmentID: 0, filterLocationID: 0 });
  
  let url = getUrl("getAll.php");
  
  useEffect(() => {    
    const fetchPersonnelData = async () => {      
      axios
        .get(url, { params: { tCode: 'p' } })
        .then((response) => {          
          setPersonnelData(response.data.data);     
          setLoading(false);
        })
        .catch((error) => {
          toast.error(`Error fetching data: ${error}`);
        })
    };

    fetchPersonnelData();

  }, [triggerPersonnel]); 

  useEffect(() => {        
    const fetchDepartmentsData = async () => {      
      axios
        .get(url, { params: { tCode: 'd' } })
        .then((response) => {          
          setDepartmentsData(response.data.data);          
        })
        .catch((error) => {
          toast.error(`Error fetching data: ${error}`);
        })
    };

    fetchDepartmentsData();

  }, [triggerDepartments]); 

  useEffect(() => {       
    const fetchLocationsData = async () => {      
      axios
        .get(url, { params: { tCode: 'l' } })
        .then((response) => {
          setLocationsData(response.data.data);          
        })
        .catch((error) => {
          toast.error(`Error fetching data: ${error}`);
        })
    };

    fetchLocationsData();

  }, [triggerLocations]); 
    
  return (
    <>
      <section>
        {/* Header Section */}
        <Header
          departmentsData={departmentsData}
          locationsData={locationsData}
          searchParams={searchParams}
          setIsPersonnelEditMode={setIsPersonnelEditMode}
          setPersonnelToHandle={setPersonnelToHandle}
          setIsDepartmentEditMode={setIsDepartmentEditMode}
          setDepartmentToHandle={setDepartmentToHandle}
          setIsLocationEditMode={setIsLocationEditMode}
          setLocationToHandle={setLocationToHandle}          
          setPersonnelData={setPersonnelData}
          setDepartmentsData={setDepartmentsData}
          setLocationsData={setLocationsData}          
          setSearchParams={setSearchParams}          
        />

        {/* Tab Content Section */}
        <div className="tab-content bg-white">
          {/* Personnel Table */}
          <PersonnelTable
            personnelData={personnelData}
            setIsPersonnelEditMode={setIsPersonnelEditMode}
            setPersonnelToHandle={setPersonnelToHandle}
            setPersonnelData={setPersonnelData}
            searchParams={searchParams}
          />
          
          {/* Departments Table */}
          <DepartmentsTable
            personnelData={personnelData}
            departmentsData={departmentsData}
            setDepartmentsData={setDepartmentsData}
            setIsDepartmentEditMode={setIsDepartmentEditMode}
            setDepartmentToHandle={setDepartmentToHandle}
            searchParams={searchParams}
          />

          {/* Locations Table */}
          <LocationsTable
            departmentsData={departmentsData}
            locationsData={locationsData}
            setIsLocationEditMode={setIsLocationEditMode}
            setLocationsData={setLocationsData}
            setLocationToHandle={setLocationToHandle}
            searchParams={searchParams}
          />
        </div>

        {/* Footer Section */}
        <Footer />
      </section>

      {/* Add/Edit Personnel Modal */}
      <AddEditPersonnelModal
        departmentsData={departmentsData}
        isPersonnelEditMode={isPersonnelEditMode}
        personnelToHandle={personnelToHandle} 
        setPersonnelToHandle={setPersonnelToHandle}
        setPersonnelData={setPersonnelData}
        setTriggerPersonnel={setTriggerPersonnel}
      />     
      <AddEditDepartmentModal
        locationsData={locationsData}
        isDepartmentEditMode={isDepartmentEditMode}
        departmentToHandle={departmentToHandle}         
        setTriggerPersonnel={setTriggerPersonnel}
        setTriggerDepartments={setTriggerDepartments}
      />     
      <AddEditLocationModal
        isLocationEditMode={isLocationEditMode}
        locationToHandle={locationToHandle}         
        setTriggerPersonnel={setTriggerPersonnel}
        setTriggerDepartments={setTriggerDepartments}
        setTriggerLocations={setTriggerLocations}
      />     
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true} />
      { loading && <Loading />}
    </>
  );
}

export default App;
