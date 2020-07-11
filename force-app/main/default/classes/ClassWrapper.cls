/**
 * @File Name          : ClassWrapper.cls
 * @Description        : 
 * @Author             : Mostafa Matar
 * @Group              : 
 * @Last Modified By   : Mostafa Matar
 * @Last Modified On   : 5/6/2020, 10:36:26 PM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    5/5/2020   Mostafa Matar     Initial Version
**/
public with sharing class ClassWrapper {
    @AuraEnabled 
    public String className;

    @AuraEnabled
    public Integer duration;

    @AuraEnabled
    public String level;

    @AuraEnabled
    public String teacher;

    @AuraEnabled
    public String id;

    @AuraEnabled
    public List<Student> students;

    public ClassWrapper(String className, Integer duration, String level, String id, String teacher, List<Student> students) {
        this.className = className;
        this.duration = duration;
        this.level = level;
        this.id = id;
        this.teacher = teacher;
        this.students = students;
    }
}
