$(document).ready(()=>{
    $('#bookingForm').validate({
        rules: {
            date: {
                required: true,
                DateFormat: true
            },
            time: {
                TimeandTableFormat: true
            },
            table: {
                TimeandTableFormat: true
            }
        },
        messages: {
            date : {
                required: "Please enter a date"
            }
        },
        submitHandler: function(form){
            form.submit();
        }
    })
});

//Check date format is valid
$.validator.addMethod("DateFormat", function(value,element) {
    return value.match(/^(0[1-9]|1[012])[- //.](0[1-9]|[12][0-9]|3[01])[- //.](19|20)\d\d$/);
}, "Please choose a date from the UI");

//Check values have been entered for time and table inputs
$.validator.addMethod("TimeandTableFormat", function(value, element){
    if(value == "Please select a time" || value == "Please select a table"){
        return false;
    }
    return true;

},"Make sure you choose a value!");