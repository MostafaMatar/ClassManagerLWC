/**
 * @description       : 
 * @author            : Mostafa Matar
 * @group             : 
 * @last modified on  : 07-11-2020
 * @last modified by  : Mostafa Matar
 * Modifications Log 
 * Ver   Date         Author          Modification
 * 1.0   07-11-2020   Mostafa Matar   Initial Version
**/
public with sharing class AnalyticsController {
    @AuraEnabled
    public static List<Student__c> getStudentsGPA(){
        List<Student__c> students = [Select Name, Average_GPA__c from Student__c];
        return students;
    }
}