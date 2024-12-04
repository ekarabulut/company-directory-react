<?php

function checkInput($data) {
    $tCode = $data['tCode'];
    $checkResult = false;

    switch($tCode) {
        case 'p':
            $checkResult = isset($data['firstName'], $data['lastName'], $data['jobTitle'], $data['email'], $data['departmentID']);
            break;
        case 'd':
            $checkResult = isset($data['name'], $data['locationID']);
            break;
        case 'l':
            $checkResult = isset($data['name']);
            break;
        default:
            break;
    }
    return $checkResult;
}

function upsertPersonnel($conn, $data) {
    if($data['isEditMode']) {			
        $queryUpsertPersonnel = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id=?');	        
        $queryUpsertPersonnel->bind_param("ssssii", $data['firstName'], $data['lastName'], $data['jobTitle'], $data['email'], $data['departmentID'], $data['id']);					
    }
    else {
        $queryUpsertPersonnel = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?,?,?,?,?)');
        $queryUpsertPersonnel->bind_param("ssssi", $data['firstName'], $data['lastName'], $data['jobTitle'], $data['email'], $data['departmentID']);
    }

    return $queryUpsertPersonnel;
}

function upsertDepartment($conn, $data) {
    if($data['isEditMode']) {			
        $queryUpsertDepartment = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id=?');	        
        $queryUpsertDepartment->bind_param("sii", $data['name'], $data['locationID'], $data['id']);                
    }
    else {        
        $queryUpsertDepartment = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?,?)');
        $queryUpsertDepartment->bind_param("si", $data['name'], $data['locationID']);
    }

    return $queryUpsertDepartment;
}

function upsertLocation($conn, $data) {

    if($data['isEditMode']) {			
        $queryUpsertLocation = $conn->prepare('UPDATE location SET name = ? WHERE id=?');	    
        $queryUpsertLocation->bind_param("si", $data['name'], $data['id']);               
    }
    else {
        $queryUpsertLocation = $conn->prepare('INSERT INTO location (name) VALUES(?)');
        $queryUpsertLocation->bind_param("s", $data['name']);
    }

    return $queryUpsertLocation;
}
?>