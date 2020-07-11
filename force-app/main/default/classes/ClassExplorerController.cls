/**
 * @File Name          : ClassExplorerController.cls
 * @Description        : 
 * @Author             : Mostafa Matar
 * @Group              : 
 * @Last Modified By   : Mostafa Matar
 * @Last Modified On   : 07-08-2020
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    5/5/2020   Mostafa Matar     Initial Version
**/
public with sharing class ClassExplorerController {
    @AuraEnabled
    public static String getClasses(){
        List<Class__c> classes = [select Id, Name, Class_Duration_in_Weeks__c, Class_Level__c, Teacher__r.Name,
            (select Student__c, Student__r.Name, Student__r.Student_Photo__c, Student__r.Student_Major__c,
             Student__r.Student_ID__c, Student__r.Average_GPA__c, Student__r.Student_Bio__c from Enrolled_Students__r) from Class__c
        ];
        List<Student> enrolledStudents = new List<Student>();
        List<ClassWrapper> cls = new List<ClassWrapper>();
        for(Class__c c : classes){
            List<Student> classStudents = new List<Student>();
            for(Enrolled_Student__c es : c.Enrolled_Students__r){
                classStudents.add(new Student(
                    es.Student__r.Name, es.Student__c, Integer.valueOf(es.Student__r.Student_ID__c), es.Student__r.Student_Bio__c, es.Student__r.Student_Photo__c, es.Student__r.Student_Major__c, es.Student__r.Average_GPA__c, new List<String>()
                ));
            } 
            cls.add(new ClassWrapper(c.Name, Integer.valueOf(c.Class_Duration_in_Weeks__c), c.Class_Level__c, String.valueOf(c.Id), c.Teacher__r.Name, classStudents));
        }
        return JSON.serialize(cls);
    }

    @AuraEnabled
    public static void saveClass(String classData){
        ClassWrapper cw = (ClassWrapper) JSON.deserialize(classData, ClassWrapper.class);
        Class__c c = new Class__c();
        c.Id = cw.id;
        c.Name = cw.className;
        c.Class_Duration_in_Weeks__c = cw.duration;
        c.Class_Level__c = cw.level;
        upsert c;
    }

    @AuraEnabled
    public static string getTeachers(){
        return JSON.serialize([select id, name from Teacher__c]);
    }

    @AuraEnabled
    public static string getStudents(){
        return JSON.serialize([select id, name from Student__c]);
    }

    @AuraEnabled
    public static String assignTeacher(String classData){
        ClassWrapper cw = (ClassWrapper) JSON.deserialize(classData, ClassWrapper.class);
        Class__c c = new Class__c();
        c.Id = cw.id;
        c.Teacher__c = cw.teacher;
        upsert c;
        Class__c cl = [select Id, Name, Class_Duration_in_Weeks__c, Class_Level__c, Teacher__r.Name,
        (select Student__c, Student__r.Name, Student__r.Student_Photo__c, Student__r.Student_Major__c,
         Student__r.Student_ID__c, Student__r.Average_GPA__c, Student__r.Student_Bio__c from Enrolled_Students__r) from Class__c WHERE id = :cw.id];
         List<Student> enrolledStudents = new List<Student>();
             for(Enrolled_Student__c es : cl.Enrolled_Students__r){
                enrolledStudents.add(new Student(
                     es.Student__r.Name, es.Student__c, Integer.valueOf(es.Student__r.Student_ID__c), es.Student__r.Student_Bio__c, es.Student__r.Student_Photo__c, es.Student__r.Student_Major__c, es.Student__r.Average_GPA__c, new List<String>()
                 ));
             } 
         return JSON.serialize(new ClassWrapper(cl.Name, Integer.valueOf(cl.Class_Duration_in_Weeks__c), cl.Class_Level__c, String.valueOf(cl.Id), cl.Teacher__r.Name, enrolledStudents));
    }

    @AuraEnabled
    public static string updateEnrolledStudents(String students, string classId){
        List<Student> sts = (List<Student>) Json.deserialize(students, List<Student>.class);
        List<Enrolled_Student__c> enrolledStudents = new List<Enrolled_Student__c>();
        for(Student s : sts){
            enrolledStudents.add(new Enrolled_Student__c(Class__c = classId, Student__c = s.id));
        }
        delete [select Id from Enrolled_Student__c where Class__c = :classId];
        insert enrolledStudents;
        //refresh class data
        List<Class__c> classes = [select Id, Name, Class_Duration_in_Weeks__c, Class_Level__c, Teacher__r.Name,
            (select Student__c, Student__r.Name, Student__r.Student_Photo__c, Student__r.Student_Major__c,
             Student__r.Student_ID__c, Student__r.Average_GPA__c, Student__r.Student_Bio__c from Enrolled_Students__r) from Class__c where id = :classId
        ];
        List<Student> classStudents = new List<Student>();
        for(Enrolled_Student__c es : classes[0].Enrolled_Students__r){
            classStudents.add(new Student(
                es.Student__r.Name, es.Student__c, Integer.valueOf(es.Student__r.Student_ID__c), es.Student__r.Student_Bio__c, es.Student__r.Student_Photo__c, es.Student__r.Student_Major__c, es.Student__r.Average_GPA__c, new List<String>()
            ));
        } 
        ClassWrapper cls = new ClassWrapper(classes[0].Name, Integer.valueOf(classes[0].Class_Duration_in_Weeks__c), classes[0].Class_Level__c, String.valueOf(classes[0].Id), classes[0].Teacher__r.Name, classStudents);
        return JSON.serialize(cls);
    }
}
