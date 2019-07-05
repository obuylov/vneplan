#adapt-can-meter

The Can Meter extension is designed to display a meter on the course which changes as Can Meter MCQ components are answered.

##Settings Overview
The attributes listed below are used in course.json to configure can-meter, and are properly formatted as JSON in the example.json. Multiple Can Meters can be added to a course.

###Attributes

#### *course.json*  
The following attributes are set within *course.json*. These attributes are set on a per meter basis.

**_isEnabled** (boolean): Turns the meter extension on or off. Acceptable values are `true` or `false`.

**_meterItems** (array): Array of the meter objects that will exist in the course.

>**id** (string): This is the id of the meter, the Can Meter MCQ and Can Meter Results will use this id to link to the meter.

>**name** (string): The name of the meter, this will be displayed in a title attribute and is translatable.

>**meterStartValue** (number): The value of the meter when the course is first opened.

>**meterMinValue** (number): The minimum value of the meter that will be displayed.

>**meterMaxValue** (number): The maximum value of the meter that will be displayed.

>**_attempts** (number): Controls the number of attempts that will be allowed on the meter. The meter can only be retried from the Can Meter Results component. Set to -1 or 0 to allow infinite atttempts.

>**_resetType** (enum): Determines whether the question will register as completed when reset. When assigned a value of 'soft', the learner may continue to interact with it, but the complete attribute remains set to true. When assigned 'hard', complete is set to false, and the learner will be forced to complete it again if it is reset.

>**_pageIds** (array): Array of the page ids that the meter should be displayed on.
