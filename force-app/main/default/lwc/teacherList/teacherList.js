import { LightningElement } from 'lwc';
import getTeachersList from '@salesforce/apex/TeacherDirectoryController.getTeachersList';
import upsertTeacher from '@salesforce/apex/TeacherDirectoryController.upsertTeacher';

export default class TeacherList extends LightningElement {
    teachers = [];
    name = '';
    connectedCallback() {
        this.init();
    }
    init() {
        getTeachersList({ nameFilter: this.name }).then(result => {
            this.teachers = JSON.parse(result);
        }).catch(error => {
            alert(error.body.message);
        });
    }
    nameFilterChangeHandler(evt) {
        this.name = evt.target.value;
        this.init();
    }
    newModal = false;
    viewNewModal() {
        this.newModal = true;
    }
    hideNewModal() {
        this.newModal = false;
    }
    //edit student variables
    newName;
    newBio;
    newEmail;
    newPhoto;
    newRating;
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
            Teacher_Bio__c: this.newBio,
            Teacher_EMail__c: this.newEmail,
            Teacher_Photo__c: this.newPhoto,
            Teacher_Rating__c: this.newRating,
        };

        //call server action to upsert the student
        upsertTeacher({ teacherData: JSON.stringify(tempTeacher) })
            .then(result => {
                this.init();
                this.newModal = false;
            })
            .catch(error => {
                alert(error.body.message);
            });
    }
}