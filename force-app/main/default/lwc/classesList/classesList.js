import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubSub';

import getClasses from '@salesforce/apex/ClassExplorerController.getClasses'
import saveClass from '@salesforce/apex/ClassExplorerController.saveClass'

export default class ClassesList extends LightningElement {
    classes = [];
    newModal;
    loading = false;

    //current page reference used for event pub sub module
    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        this.loading = true;
        this.hideNewModal();
        this.reloadClasses();
    }

    reloadClasses() {
        getClasses({}).then(result => {
            this.classes = JSON.parse(result);
            this.loading = false;
        }).catch(err => {
            alert(err.body.message);
            this.loading = false;
        });
    }

    showNewModal() {
        this.newModal = true;
    }
    hideNewModal() {
        this.newModal = false;
    }

    newClassName;
    newClassLevel;
    newClassDuration;
    saveClassChangeHandler(evt) {
        let inputName = evt.target.name;
        let inputValue = evt.target.value;
        if (inputName == 'className')
            this.newClassName = inputValue;
        else if (inputName == 'classLevel')
            this.newClassLevel = inputValue;
        else if (inputName == 'classDuration')
            this.newClassDuration = inputValue;
    }

    saveClass() {
        this.loading = true;
        let newClass = {
            className: this.newClassName,
            level: this.newClassLevel,
            duration: this.newClassDuration
        };
        saveClass({
            classData: JSON.stringify(newClass)
        }).then(result => {
            this.hideNewModal();
            this.reloadClasses();
        }).catch(error => {
            alert(error.body.message);
            this.loading = false;
        });
    }

    selectClass(evt){
        let classId = evt.target.name;
        let classData = {};
        for(let i = 0; i < this.classes.length; i ++){
            if(this.classes[i].id == classId){
                classData = this.classes[i];
                break;
            }
        }
        fireEvent(this.pageRef, 'classSelected', classData);
    }
}