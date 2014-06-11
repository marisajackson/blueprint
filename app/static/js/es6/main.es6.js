(function(){
  'use strict';

  $(document).ready(init);

  // var floor;
  var start;

  function init(){
    $('#create-room').click(createRoom);
  }

  function createRoom(){
    $('td').click(startFloor);
  }

  function startFloor(){
    start = $(this).data();
    $('td').hover(dropFloor);
  }

  function dropFloor(){
    var img = $('#floors :selected').attr('data-img');
    $(this).css('background-image', 'url('+img+')');
    $('td').mouseup(fillIn);
  }

  function fillIn(){
    var end = $(this).data();
    for(var i = start.x; i < end.x; i++){
      console.log(i);
    }
  }

})();
