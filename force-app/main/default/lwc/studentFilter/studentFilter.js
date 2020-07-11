import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubSub';


export default class StudentFilter extends LightningElement {
    //filter variables
    @track name = '';
    @track minGPA = 0;
    @track maxGPA = 5;
    @track major = '';

    //current page reference to be used with the pub sub module
    @wire(CurrentPageReference) pageRef;

    //applies user filters to the student lists
    filterStudents() {
        let filterCriteria = {
            name: this.name,
            minGPA: this.minGPA,
            maxGPA: this.maxGPA,
            major: this.major
        };
        fireEvent(this.pageRef, 'filterStudents', filterCriteria);
    }

    //syncs the filter variables with the user inputs
    handleFilterChange(evt) {
        let filterName = evt.target.name;
        let filterValue = evt.target.value;
        if (filterName == 'nameFilter')
            this.name = filterValue;
        else if (filterName == 'majorFilter')
            this.major = filterValue;
        else if (filterName == 'minGPAFilter')
            this.minGPA = filterValue;
        else if (filterName == 'maxGPAFilter')
            this.maxGPA = filterValue;
    }
}