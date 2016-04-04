# UAComp266
Project for University of Athabasca Comp 266 
## Unit 1 Requirements
* a minimum of three HTML pages complying with at least XHTML 1.0 standards or (better).
* at least one image.
* hyperlinks between all the pages (using relative URLs).
* at least one hyperlink to an external website.
* sufficient text to require the use of at least two heading styles
* at least one list (ordered or unordered).
* at least one <div> tag (preferably more), with a specified name, to identify a section of a page (of no particular value yet, but needed later on). It would be best if this were something that you see the need to reformat later to change its appearance, position, or behaviour, for example a sidebar floated on one side of the page.
* at least one <span> tag (preferably more), with a specified name, to identify a section of text within a paragraph or other block-level element (again, no immediate value—for use later). It would be best if this were something that you see the need to reformat later to change its appearance, position, or behaviour, for example, a change in typeface or font.
* a table. (Special note regarding tables: tables are only ever to be used for tabular data, with meaningful rows and columns of data, never to lay out things on the page—such use is common but strongly deprecated because of accessibility issues).
* a form, the contents of which are mailed to the author (you).

### Unit 1 Subjective requirements
* well structured, standards-compliant HTML code with no deprecated tags, attributes, or uses of HTML
* effective use of the scenarios and personas from Unit 1, with clear rationales and appropriate design decisions based on how you expect the pages to be used and who you expect to use them.
* a broad range of HTML tags and attributes used, but only when appropriate, not for the sake of it. Examples might include heading styles, tables, hypertext links, anchors, lists (ordered, unordered, definition), divs, spans, text formatting (descriptive, not related to appearance).
* accessibility – suitable for users with different browsers and different abilities/disabilities.
* usability – bearing in mind personas and scenarios from Unit 1 and taking into account that different people may access your site with markedly different browsers (including mobile devices).
* effective navigation between pages (bearing in mind usability and accessibility constraints).
* effective organization of files: images, for example, should be saved in a separate directory (later there will be other subdirectories for different kinds of files).
* author name and date of last modification on each page.
* images sized appropriately for the Web, with useful alt attributes for those unable to see them.
* clear, effective communication that is appropriate to the personas and scenarios you have identified in Unit 1.


### Unit 3 Notes for the critque
* Statements should be defined by the fact that it ends with a semi-colon, using \ to spread over more than one line but it is not suggested
* Using curly braces to complete all blocks of code
* Using camel casing for variables such as currentUser = "Jon"
* Javascript Objects, all objects can have properties, values can be set using methods as well, essentially a JSON form of the object, name value pairs to form the properties of the object
    * Object methods are actions that can be performed on objects, methods are stored in properties as function definitions
    * You can access object properties by objectName.propertyName or objectName["propertyName"]
    * Creating objects can be done in three ways
    * You can create objects all in one group of line 
    ```javascript
        var person = {
            firstName:"John",
            lastName:"Doe",
            age:50,
            eyeColor:"blue"
        };
    ```
     * Using the JavaScript keyword new, var person = new Object(); but you can use var person = {} instead for performance
     * Using an Object constructor such as doing something :
    ```javascript
        function person(first, last, age, eye) {
            this.firstName = first;
            this.lastName = last;
            this.age = age;
            this.eyeColor = eye;
        }
    ```
    * You can delete properties using the delete keyword
var myFather = new person("John", "Doe", 50, "blue");
var myMother = new person("Sally", "Rally", 48, "green");
* Variables declared within function with a var, it will be constrained to a local scope of within a function, outside of a function it will be a global scope
* Declaring a variable without VAR will automatically make it a global variable
        * Variables within functions are destroyed when the function completes, however global variables are destroyed when the page closes
* Type conversion can be done using the typeOf function which returns a string representation of the datatype
        * Us ing constructor you can find out the original constructor of an variable using the .constructor property of an JS variable
* Hoisted, variable can be declared after it has been used, 
* Javascript prototypes: Every JS Object has a prototype, the prototype is also an object, all JS Objects inherit their properties and methods from their
Prototypes
* Strict mode, new directive in JS 1.8.5 ECMAScript 5, indicates that the code should be executed in strict mode, with strict mode you cannot use undecalred variables and a host of other rules
        * Strict mode assists and aids in the writing of better and more secure JS.
* Coding Conventions
        * camelCase for identifier names such as variables and functions
        * All variables start with a letter
        * Space around operators such as + * - /, and after commas
        * Code indentation of 4 spaces
        * Always end statements with semi colons
        * For readibility avoid lines longer than 80 characters, or break it after an operator or a comma
    * Naming Convention
        * Variables and function names written as camelCase
        * Global variables should be written in UPPERCASE
        * Constants should be written in UpperCase
        * Hyphens are not allowed in javascript names
* Best Practice
        * Declare variables on the very top of the script
        * Initalize variables
        * Never declare local variables, all variables used in a function should be declared as local variables, meaning declaring with VAR
        * Never declare number string or boolean objects
                * Slows down execution speeds, and makes it confusing when comparing between primitives
        * Don't use new Object
                * Use {} instead of new Object()
                * Use "" empty string instead of new String()
                * Use 0 instead of new Number()
                * Use false  instead of new Boolean()
                * Use [] empty array instead of new Array()
                * Use /()/ instead of new RegExp()
                * Use function (){} instead of new Function()
        * Be careful of automatic type conversions,
                * With javascript being loosely typed as variable can be any data type and its definitation can change and be automatically converted
        * Using === comparisons where the == always converts to a matching type before comparison
                * Using === operator forces comparison of values and type
        * Using parameter defaults if the parameter is not called upon then a parameter default option should be available
        * End switches with defaults
        * Avoid using eval()
        
 * Common mistakes
        * nulls are for objects while undefined is for variables
        * assuming that variables are destroyed in blocks automatically like after a for loop block the loop iteration variable is still present
 * Performance
        * Reduce activity in loops
        * Reduce DOM Size
        * Avoid unnecessary variables
        * Delay Javascript loading by placing scripts at the bottom of the page body, let the browser load the page first
        * Use strict mode
* Using JSON Text to a JS Object
        * JSON strings can be converted into a obj by using JSON.parse(jsontext)
