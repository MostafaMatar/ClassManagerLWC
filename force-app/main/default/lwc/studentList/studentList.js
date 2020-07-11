import { LightningElement, api, wire } from 'lwc';
import { registerListener } from 'c/pubSub';
import { CurrentPageReference } from 'lightning/navigation';

import getStudentsList from '@salesforce/apex/StudentDirectoryController.getStudentsList';
import upsertStudent from '@salesforce/apex/StudentDirectoryController.upsertStudent';

export default class StudentList extends LightningElement {
    //full list of students variable
    @api students = [];

    //filter variables
    name = '';
    major = '';
    minGPA = 0;
    maxGPA = 5;

    //pagination variables
    totalPages = 1;
    currentPage = 1;
    displayedStudents = [];

    //new student modal variables
    newModal = false;
    newName;
    newStudentId;
    newAverageGPA;
    newBio;
    newMajor;
    newProfilePic;

    //loading spinner variables
    loading = true;
    
    //shows modal for creating a student
    createStudent() {
        this.newName = null;
        this.newStudentId = null;
        this.newAverageGPA = null;
        this.newBio = null;
        this.newMajor = null;
        this.newProfilePic = null;
        this.newModal = true;
    }
    //hides modal for creating a student
    hideNewModal() {
        this.newModal = false;
    }
    //syncs new student variables with values in input fields
    savePersonChangeHandler(evt) {
        let inputName = evt.target.name;
        let inputValue = evt.target.value;

        if (inputName == 'nameInput')
            this.newName = inputValue;
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
    //saves a student record
    savePerson() {
        let tempPerson = {
            name: this.newName,
            id: null,
            bio: this.newBio,
            studentId: this.newStudentId,
            averageGPA: this.newAverageGPA,
            major: this.newMajor,
            profilePic: this.newProfilePic
        };
        upsertStudent({ studentData: JSON.stringify(tempPerson) })
            .then(result => {
                this.newModal = false;
                this.getStudents();
            })
            .catch(error => {
                alert(error.body.message);
            });
    }

    //current page reference used for event pub sub module
    @wire(CurrentPageReference) pageRef;

    //initializes the componen
    connectedCallback() {
        //get the list of students in the system
        this.getStudents();
        //register an event handler for the filtering event
        registerListener('filterStudents', this.filterStudents, this);
    }

    //gets a list of students that satisfies the user filters
    getStudents() {
        //show the loading spinner
        this.loading = true;
        //call the server action to get students
        getStudentsList({
            nameFilter: this.name, majorFilter: this.major,
            minGPAFilter: (this.minGPA ? this.minGPA : 0), maxGPAFilter: (this.maxGPA ? this.maxGPA : 5)
        })
            .then(result => {
                this.students = JSON.parse(result);
                this.totalPages = Math.ceil(this.students.length / 10);
                this.currentPage = 1;
                this.displayedStudents = this.students.slice(0, 10);
                this.loading = false;
            })
            .catch(error => {
                alert(error.body.message);
                this.loading = false;
            });
    }

    //handles the apply filters event
    filterStudents(filters) {
        this.name = filters.name;
        this.major = filters.major;
        this.minGPA = filters.minGPA;
        this.maxGPA = filters.maxGPA;

        this.getStudents();
    }

    //displays the next page of students
    nextPage() {
        this.displayedStudents = this.students.slice(10 * this.currentPage, (10 * this.currentPage) + 10);
        this.currentPage++;
    }

    //displays the previous page of students
    previousPage() {
        this.currentPage--;
        this.displayedStudents = this.students.slice(10 * (this.currentPage - 1), (10 * (this.currentPage - 1)) + 10);
    }

    //conditions to disable the next button of the paginator
    get disableNext() {
        return (this.currentPage == this.totalPages);
    }

    //conditions to disable the previous button of the paginator
    get disablePrevious() {
        return this.currentPage == 1;
    }
}