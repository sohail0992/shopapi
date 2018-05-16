var socket = io.connect('http://localhost:3000');


var name = document.getElementById('name');
var arabic_name = document.getElementById('arabic_name');
var description = document.getElementById('description');
var arabic_description = document.getElementById('arabic_description');
var model = document.getElementById('model');
var submitBtn = document.getElementById("submitButton");

submitBtn.addEventListener('click', function(){
    
    socket.emit('updateProduct', {
        name: name.value,
        arabic_name: arabic_name.value,
        description: description.value,
        arabic_description: arabic_description.value,
        model: model.value
    });
});
