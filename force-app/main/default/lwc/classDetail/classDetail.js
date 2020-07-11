import { LightningElement, wire, track } from 'lwc';
import { registerListener } from 'c/pubSub';
import { CurrentPageReference } from 'lightning/navigation';

import saveClass from '@salesforce/apex/ClassExplorerController.saveClass';
import getTeachers from '@salesforce/apex/ClassExplorerController.getTeachers';
import getStudents from '@salesforce/apex/ClassExplorerController.getStudents';
import assignTeacher from '@salesforce/apex/ClassExplorerController.assignTeacher';
import updateEnrolledStudents from '@salesforce/apex/ClassExplorerController.updateEnrolledStudents';


export default class ClassDetail extends LightningElement {
    classData = {};

    loading = false;
    //current page reference used for event pub sub module
    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        //register an event handler for the filtering event
        registerListener('classSelected', this.selectClass, this);
    }
    editModal = false;
    studentsModal = false;
    teacherModal = false;
    newClassName;
    newClassLevel;
    newClassDuration;
    showEditModal() {
        this.editModal = true;
        this.newClassName = this.classData.className;
        this.newClassDuration = this.classData.duration;
        this.newClassLevel = this.classData.level;
    }
    hideEditModal() {
        this.editModal = false;
    }
    @track 
    enrolledStudents = [];
    @track
    allStudents = [];
    @track
    availableStudents = [];
    showStudentsModal() {
        for (let i = 0; i < this.classData.students.length; i++) {
            this.enrolledStudents.push({
                Id: this.classData.students[i].id,
                Name: this.classData.students[i].name
            });
        }
        getStudents().then(result => {
            this.allStudents = JSON.parse(result);
            for (let i = 0; i < this.allStudents.length; i++) {
                let exists = false;
                for (let j = 0; j < this.enrolledStudents.length; j++) {
                    if (this.allStudents[i].Id == this.enrolledStudents[j].Id) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    this.availableStudents.push({
                        Id: this.allStudents[i].Id,
                        Name: this.allStudents[i].Name
                    });
                }
            }
            this.studentsModal = true;
        }).catch(error => {
            alert(error.body.message);
        });
    }
    hideStudentsModal() {
        this.studentsModal = false;
    }
    studentToAdd;
    studentToRemove;
    studentToAddChanged(evt){
        this.studentToAdd = evt.target.value;
    }
    studentToRemoveChanged(evt){
        this.studentToRemove = evt.target.value;
    }
    addStudent(){
        let student = {};
        for(let i = 0; i < this.allStudents.length; i++){
            if(this.studentToAdd == this.allStudents[i].Id){
                student = this.allStudents[i];
                break;
            }
        }
        this.enrolledStudents.push(student);
        let ind = 0;
        for(; ind < this.availableStudents.length; ind ++){
            if(student.Id == this.availableStudents[ind].Id)
                break;
        }
        this.availableStudents.splice(ind,1);
    }
    removeStudent(){
        let student = {};
        for(let i = 0; i < this.allStudents.length; i++){
            if(this.studentToRemove == this.allStudents[i].Id){
                student = this.allStudents[i];
                break;
            }
        }
        this.availableStudents.push(student);
        let ind = 0;
        for(; ind < this.enrolledStudents.length; ind ++){
            if(student.Id == this.enrolledStudents[ind].Id)
                break;
        }
        this.enrolledStudents.splice(ind,1);
    }
    upsertClassStudents(){
        updateEnrolledStudents({students: JSON.stringify(this.enrolledStudents), 
            classId : this.classData.id})
            .then(result => {
                this.classData = JSON.parse(result);
                this.enrolledStudents = [];
                this.availableStudents = [];
                this.allStudents = [];
                this.studentsModal = false;
            })
            .catch(error => {
                alert(error.body.message);
            });
    }

    teachers = {};
    newTeacherId;
    showTeacherModal() {
        getTeachers().then(result => {
            this.teachers = JSON.parse(result);
            this.teacherModal = true;
        }).catch(error => {
            alert(error.body.message);
        });
    }
    hideTeacherModal() {
        this.teacherModal = false;
    }
    editClassHandler(evt) {
        let inputName = evt.target.name;
        let inputValue = evt.target.value;

        if (inputName == 'className') {
            this.newClassName = inputValue;
        }
        else if (inputName == 'classLevel') {
            this.newClassLevel = inputValue;
        }
        else if (inputName == 'classDuration') {
            this.newClassDuration = inputValue;
        }
    }
    editTeacherHandler(evt) {
        let inputName = evt.target.name;
        let inputValue = evt.target.value;
        if (inputName == 'classTeacher') {
            this.newTeacherId = inputValue;
        }
    }
    assignClassTeacher() {
        let newClass = {
            id: this.classData.id,
            className: this.classData.className,
            level: this.classData.level,
            duration: this.classData.duration,
            teacher: this.newTeacherId
        };
        assignTeacher({
            classData: JSON.stringify(newClass)
        }).then(result => {
            this.classData = JSON.parse(result);
            this.hideTeacherModal();
        }).catch(error => {
            alert(error.body.message);
        });
    }
    saveClassData() {
        let newClass = {
            id: this.classData.id,
            className: this.newClassName,
            level: this.newClassLevel,
            duration: this.newClassDuration
        };
        saveClass({
            classData: JSON.stringify(newClass)
        }).then(result => {
            this.classData.className = this.newClassName;
            this.classData.duration = this.newClassDuration;
            this.classData.level = this.newClassLevel;
            this.hideEditModal();
        }).catch(error => {
            alert(error.body.message);
        });
    }
    selectClass(selectedClass) {
        this.classData = selectedClass;
    }
}