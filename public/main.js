$(document).ready(function() {
  document.querySelector('#fileSelect').addEventListener('click', function(e) {
    // Use the native click() of the file input.
    document.querySelector('#fileElem').click();
  }, false);
});

(function getData() {
    // Grab the template
    $.get('/public/item.ejs', function (template) {
        // Compile the EJS template.
        var func = ejs.compile(template);
        // Grab the data
        $.get('/api/item', function (data) {
           // Generate the html from the given data.
           var html = func(data);
           $('#container').html(html);
           // $('#like').click(function(e){
           //  $.post( "/api/item/54a6bc5ecb2f8d8f2a000002/like", function (data) {
           //    $( ".likeCount" ).html( data );
           //  });
          });
    });
})();