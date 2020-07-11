/**
 * @File Name          : StudentDirectoryController.cls
 * @Description        : 
 * @Author             : Mostafa Matar
 * @Group              : 
 * @Last Modified By   : Mostafa Matar
 * @Last Modified On   : 4/28/2020, 1:10:10 PM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    4/23/2020   Mostafa Matar     Initial Version
**/
public with sharing class StudentDirectoryController {
    /**
    * @description 
    * @author Mostafa Matar | 4/28/2020 
    * @param nameFilter 
    * @param majorFilter 
    * @param minGPAFilter 
    * @param maxGPAFilter 
    * @return string the list of students as a JSON string
    **/
    @AuraEnabled
    public static string getStudentsList(String nameFilter, String majorFilter, Decimal minGPAFilter, Decimal maxGPAFilter){
        String query = 'select Id, Name, Student_Major__c, Student_ID__c, Average_GPA__c, Student_Bio__c, Student_Photo__c, (Select Class__r.Name From Enrolled_Classes__r) from Student__c WHERE ';
        if(nameFilter != null && nameFilter != ''){
            query += ('Name LIKE \'%'+nameFilter+'%\' AND ');
        }
        if(majorFilter != null && majorFilter != ''){
            query += ('Student_Major__c = :majorFilter AND ');
        }
        if(minGPAFilter != null){
            query += ('Average_GPA__c >= :minGPAFilter AND ');
        }
        if(maxGPAFilter != null){
            query += ('Average_GPA__c <= :maxGPAFilter AND ');
        }
        query += 'Student_ID__c <> null LIMIT 100';
        List<Student__c> students = database.query(query);
        List<Student> result = new List<Student>();
        for(Student__c s : students){
            List<String> courseNames = new List<String>();
            for(Enrolled_Student__c es : s.Enrolled_Classes__r){
                courseNames.add(es.Class__r.Name);
            }
            result.add(new Student(
                s.Name, String.valueOf(s.Id), Integer.valueOf(s.Student_ID__c), s.Student_Bio__c, s.Student_Photo__c, s.Student_Major__c, s.Average_GPA__c, courseNames
            ));
        }
        return JSON.serialize(result);
    }
    /**
    * @description 
    * @author Mostafa Matar | 4/28/2020 
    * @param studentData 
    * @return void 
    **/
    @AuraEnabled
    public static void upsertStudent(String studentData){
        Student student = (Student) JSON.deserialize(studentData, Student.class);
        Student__c newStudent = new Student__c();
        newStudent.Id = student.id;
        newStudent.Student_ID__c = student.studentId;
        newStudent.Name = student.name;
        newStudent.Student_Major__c = student.major;
        newStudent.Student_Bio__c = student.bio;
        newStudent.Student_Photo__c = student.profilePic;
        newStudent.Average_GPA__c = student.averageGPA;
        upsert newStudent;
    }
}
