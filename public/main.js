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