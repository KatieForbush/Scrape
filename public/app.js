//grab  articles as a json
$.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++){
        //display the information on page
        $(.articles).append("<p data-id=" + data[i].id)
    }
})