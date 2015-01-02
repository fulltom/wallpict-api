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
        });
    });
})();