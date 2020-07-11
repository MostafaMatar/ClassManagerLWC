import { LightningElement, api } from 'lwc';
import upsertTeacher from '@salesforce/apex/TeacherDirectoryController.upsertTeacher';

export default class StudentSummary extends LightningElement {
    //data of student variable to be supplied by parent student list component
    @api teacher;

    //edit student variables
    newName;
    newBio;
    newEmail;
    newPhoto;
    newRating;

    //view and edit student modals show/hide variables
    viewModal = false;
    editModal = false;

    //returns true if te student has a profile picture
    get profilePicExists() {
        return (this.teacher.Teacher_Photo__c != '' && this.teacher.Teacher_Photo__c != undefined && this.teacher.Teacher_Photo__c != null);
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
        this.newName = this.teacher.Name;
        this.newBio = this.teacher.Teacher_Bio__c;
        this.newEmail = this.teacher.Teacher_EMail__c;
        this.newPhoto = this.teacher.Teacher_Photo__c;
        this.newRating = this.teacher.Teacher_Rating__c;
        this.editModal = true;
    }

    //hides the edit student modal
    hideEditModal() {
        this.editModal = false;
    }

    //syncs edit student variables with the user inputs
    editTeacherChangeHandler(evt) {
        let inputName = evt.target.name;
        let inputValue = evt.target.value;

        if (inputName == 'nameInput') {
            this.newName = inputValue;
        }
        else if (inputName == 'bioInput')
            this.newBio = inputValue;
        else if (inputName == 'emailInput')
            this.newEmail = inputValue;
        else if (inputName == 'photoInput')
            this.newPhoto = inputValue;
        else if (inputName == 'ratingInput')
            this.newRating = inputValue;
    }

    //saves the teacher data after edits by the user
    saveTeacher() {
        let tempTeacher = {
            Name: this.newName,
            Id: this.teacher.Id,
            Teacher_Bio__c: this.newBio,
            Teacher_EMail__c: this.newEmail,
            Teacher_Photo__c: this.newPhoto,
            Teacher_Rating__c: this.newRating,
        };
        //call server action to upsert the student
        upsertTeacher({ teacherData: JSON.stringify(tempTeacher) })
            .then(result => {
                this.teacher = tempTeacher;
                this.editModal = false;
            })
            .catch(error => {
                alert(error.body.message);
            });
    }
}