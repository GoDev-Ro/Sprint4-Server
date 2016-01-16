$(function() {
    //data
    var page = 1;
    var totalPages = 1;
    var currentEditedItem = null;
    var sortField = 'name';
    var sortDir = 'asc';
    
    //DOM elements
    var $table = $('#the-table');
    var $form = $('#the-form');
    var $pagination = $('nav .pagination');
    var $loading = $('.loading');
    
    //functions
    var errorHandler = function(error) {
        alert(error);
    };
    
    var drawTable = function() {
        store.getAll(page, sortField, sortDir).then(
            function(data) {
                //build table
                $table.find('tbody').hide();
                
                if (data.list && data.list.length) {
                    var $tbody = $table.find('.with-data').empty().show();
                    
                    $.each(data.list, function() {
                        $tbody.append(tmpl($('#tr-template').html(), this));
                    });
                } else {
                    $table.find('.without-data').show();
                }
                
                //giphy
                $table.find('a.giphy').giphy();
                
                //set values
                setTotalPages(data.totalPages);
                
                //re-attach events
                attachTableEvents();
            },
            errorHandler
        );
    };
    
    var onSubmit = function() {
        var data = getFormValues();
        var complete = function() {
            resetForm();
            drawTable();
        };
        
        if (currentEditedItem) {
            store.update(currentEditedItem.id, data)
                .then(complete, errorHandler);
        } else {
            store.add(data).then(complete, errorHandler);
        }
        
        return false;
    };
    
    var getFormValues = function() {
        return {
            name: $form.find('[name="name"]').val(),
            visited: $form.find('[name="visited"]').is(':checked') ? 1 : 0,
            stars: parseInt($form.find('[name="stars"]').val())
        };
    };
    
    var setFormValues = function(data) {
        $form.find('[name="name"]').val(data.name);
        $form.find('[name="visited"]').prop('checked', data.visited == 1);
        $form.find('[name="stars"]').val(data.stars).change();
    };
    
    var resetForm = function() {
        setFormValues({
            name: '',
            visited: 0,
            stars: ''
        });

        $form.removeClass('editing');
        currentEditedItem = null;
        
        return false;
    };
    
    var attachTableEvents = function() {
        $table.find('.bt-edit').click(editClicked);
        $table.find('.bt-delete').click(deleteClicked);
    };
    
    var getCurrentId = function() {
        return $(this).closest('tr').data('id');
    };
    
    var deleteClicked = function() {
        if (confirm('Are you sure?')) {
            store.delete(getCurrentId.call(this)).then(drawTable, errorHandler);
        }
        
        return false;
    };
    
    var editClicked = function() {
        store.get(getCurrentId.call(this)).then(
            function(data) {
                currentEditedItem = data;
                setFormValues(data);
                $form.addClass('editing');
            },
            errorHandler
        );
        
        return false;
    };
    
    //pagination
    var setPage = function(num) {
        page = num;
        $pagination.find('.page').text(num);
    };
    
    var setTotalPages = function(num) {
        totalPages = num;
        $pagination.find('.total-pages').text(num);
    };
    
    var pageChangeHandler = function(alter) {
        return function() {
            var newValue = page + alter;
            
            if (newValue > 0 && newValue <= totalPages) {
                setPage(newValue);
                drawTable();
            }
            
            return false;
        };
    };
    
    //sort
    var sortLinkClicked = function() {
        var $this = $(this);
        
        //data
        sortField = $this.data('field');
        sortDir = $this.data('dir');
        
        drawTable();
        
        //modify th to reflect current state
        $this.data('dir', sortDir == 'asc' ? 'desc' : 'asc'); //flip next order
        
        $this.closest('tr')
            .find('th a.sort i')
            .removeClass('fa-sort-up')
            .removeClass('fa-sort-down')
            .addClass('fa-sort');
        
        $this.find('i')
            .removeClass('fa-sort')
            .addClass('fa-sort-' + (sortDir == 'asc' ? 'up' : 'down'));

        return false;
    };
    
    //loading
    var ajaxToggle = function() {
        $loading.toggle();
    };
    
    //start setup
    $('.stars-input').stars();
    
    $form.on('submit', onSubmit);
    $form.find('.bt-cancel').on('click', resetForm);
    
    $table.find('th a.sort').on('click', sortLinkClicked);
    
    $pagination.find('.next').click(pageChangeHandler(1));
    $pagination.find('.prev').click(pageChangeHandler(-1));
    
    $(document).ajaxStart(ajaxToggle).ajaxStop(ajaxToggle);
    
    drawTable();
});