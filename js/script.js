$(document).ready(function() {
	// Search
    $('#sitemenu .live').click(function(e){
        $('.drop').each(function(index) {
            var a = $(this).attr('style');
            var r = /block/;
            var id = $(this).attr('id');
            if(r.test(a) && id != "livesearch"){ 
                $(this).slideToggle();
            } 
        });
        $('#livesearch').slideToggle();

        var lastsearch = $.cookie('livesearch');
        if (lastsearch != null || lastsearch != '') {
            $('#searchBar').val(lastsearch);
            $('#searchBar').select();
        }
        
        $('#searchBar').focus();
        
        e.preventDefault();
    });
});
