import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getStudentsGPA from '@salesforce/apex/AnalyticsController.getStudentsGPA';


export default class HomeComponent extends NavigationMixin(LightningElement) {
    classManagerTabName = 'Class_Explorer';
    studentDirectoryTabName = 'Student_Directory';
    teacherDirectoryTabName = 'Teacher_Directory';

    Students = {};
    GPA = {};
    connectedCallback(){
        getStudentsGPA().then(result => {
            let sts = [];
            let gpas = [];
            for(let i =0 ; i < result.length; i++){
                sts.push(result[i].Name);
                gpas.push(result[i].Average_GPA__c);
            }
            this.Students.v = sts;
            this.GPA.v = gpas;
        }).catch(error => {
            alert(error.body.message);
        });
    }

    navigateToPage(evt) {
        //decide which page to navigate to 
        let pageTabName = '';
        let requiredPage = evt.target.name;
        if (requiredPage === 'classPage')
            pageTabName = this.classManagerTabName;
        else if (requiredPage === 'studentPage')
            pageTabName = this.studentDirectoryTabName;
        else if (requiredPage === 'teacherPage')
            pageTabName = this.teacherDirectoryTabName;
        //navigate to the page
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: pageTabName
            },
        });
    }
}