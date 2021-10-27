$("#sendMessage").on("click", function() {
    message = $("#gform").serialize();
    $.ajax({
        url: "//formspree.io/sgmabunda@gmail.com", 
        method: "POST",
        data: {message: message },
        dataType: "json"
    });
    alert('Message submitted. Thanks for the message.');
    return false;
});

var contactform =  document.getElementById('gform');
contactform.setAttribute('action', '//formspree.io/' + 'sgmabunda@gmail.com')

