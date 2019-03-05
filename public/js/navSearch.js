$('.searchicon').click(() => {
    $('.navSearch').css('display', 'inline');
    $('.searchicon').css('display', 'none');
    $('.navSearch').focus();
});

$('.navSearch').focusout(() => {
    $('.navSearch').css('display', 'none');
    $('.searchicon').css('display', 'inline');
});