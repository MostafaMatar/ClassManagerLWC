/**
 * @File Name          : StudentDirectoryController.cls
 * @Description        : 
 * @Author             : Mostafa Matar
 * @Group              : 
 * @Last Modified By   : Mostafa Matar
 * @Last Modified On   : 07-11-2020
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    4/23/2020   Mostafa Matar     Initial Version
**/
public with sharing class TeacherDirectoryController {
    /**
    * @description 
    * @author Mostafa Matar | 4/28/2020 
    * @param nameFilter 
    * @return string the list of teachers as a JSON string
    **/
    @AuraEnabled
    public static string getTeachersList(String nameFilter){
        String query = 'select Id, Name, Teacher_Bio__c, Teacher_EMail__c, Teacher_Photo__c, Teacher_Rating__c, (Select Id, Name From Classes__r) from Teacher__c';
        if(nameFilter != null && nameFilter != ''){
            query += (' WHERE Name LIKE \'%'+nameFilter+'%\'');
        }
        query += ' LIMIT 100';
        List<Teacher__c> teachers = database.query(query);
        return JSON.serialize(teachers);
    }
    /**
    * @description 
    * @author Mostafa Matar | 4/28/2020 
    * @param teacherData 
    * @return void 
    **/
    @AuraEnabled
    public static void upsertTeacher(String teacherData){
        Teacher__c teacher = (Teacher__c) JSON.deserialize(teacherData, Teacher__c.class);
        upsert teacher;
    }
}