/**
 * @File Name          : Person.cls
 * @Description        : 
 * @Author             : Mostafa Matar
 * @Group              : 
 * @Last Modified By   : Mostafa Matar
 * @Last Modified On   : 4/28/2020, 1:09:24 PM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    4/24/2020   Mostafa Matar     Initial Version
**/
public with sharing class Student {
    @AuraEnabled 
    public String name;
    
    @AuraEnabled
    public String id;

    @AuraEnabled
    public Integer studentId;

    @AuraEnabled
    public String bio;

    @AuraEnabled
    public String profilePic;

    @AuraEnabled
    public String major;

    @AuraEnabled
    public Decimal averageGPA;

    @AuraEnabled
    public List<String> courses;

    //student object constructor
    public Student(String name, String id, Integer studentId, String bio, string profilePic, 
                string major, Decimal averageGPA, List<String> courses){
        this.name = name;
        this.id = id;
        this.studentId = studentId;
        this.bio = bio;
        this.profilePic = profilePic;
        this.averageGPA = averageGPA;
        this.major = major;
        this.courses = courses;
    }
}
