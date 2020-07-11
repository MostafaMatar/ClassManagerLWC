import { LightningElement, api } from 'lwc';
import upsertStudent from '@salesforce/apex/StudentDirectoryController.upsertStudent';

export default class StudentSummary extends LightningElement {
    //data of student variable to be supplied by parent student list component
    @api person;

    //edit student variables
    newName;
    newStudentId;
    newAverageGPA;
    newBio;
    newMajor;
    newProfilePic;

    //view and edit student modals show/hide variables
    viewModal = false;
    editModal = false;

    //returns true if te student has a profile picture
    get profilePicExists() {
        return (this.person.profilePic != '' && this.person.profilePic != undefined && this.person.profilePic != null);
    }

    //shows the view student modal
    showViewModal() {
        this.viewModal = true;
    }

    //hides the view student modal
    hideViewModal() {
        this.viewModal = false;
    }

    //shows the edit student modal 
    showEditModal() {
        this.newName = this.person.name;
        this.newStudentId = this.person.studentId;
        this.newAverageGPA = this.person.averageGPA;
        this.newBio = this.person.bio;
        this.newMajor = this.person.major;
        this.newProfilePic = this.person.profilePic;
        this.editModal = true;
    }

    //hides the edit student modal
    hideEditModal() {
        this.editModal = false;
    }

    //syncs edit student variables with the user inputs
    editPersonChangeHandler(evt) {
        let inputName = evt.target.name;
        let inputValue = evt.target.value;

        if (inputName == 'nameInput') {
            this.newName = inputValue;
        }
        else if (inputName == 'bioInput')
            this.newBio = inputValue;
        else if (inputName == 'studentIdInput')
            this.newStudentId = inputValue;
        else if (inputName == 'averageGPAInput')
            this.newAverageGPA = inputValue;
        else if (inputName == 'majorInput')
            this.newMajor = inputValue;
        else if (inputName == 'profilePicInput')
            this.newProfilePic = inputValue;
    }

    //saves the student data after edits by the user
    savePerson() {
        let tempPerson = {
            name: this.newName,
            id: this.person.id,
            bio: this.newBio,
            studentId: this.newStudentId,
            averageGPA: this.newAverageGPA,
            major: this.newMajor,
            profilePic: this.newProfilePic
        };
        //call server action to upsert the student
        upsertStudent({ studentData: JSON.stringify(tempPerson) })
            .then(result => {
                this.person = tempPerson;
                this.editModal = false;
            })
            .catch(error => {
                alert(error.body.message);
            });
    }
}